import type { Express } from "express";
import { requireAuth } from "./auth";
import { storage } from "./storage";

export interface XCurveConfig {
  apiUrl: string;
  apiKey: string;
  timeout: number;
}

export interface XCurveScoreRequest {
  document: string;
  personType: "PF" | "PJ";
  fullName: string;
  proposalId: number;
  requestedAmount?: number;
}

export interface XCurveScoreResponse {
  score: string;
  scoreNumeric: number;
  riskLevel: "low" | "medium" | "high" | "very_high";
  recommendation: "approve" | "review" | "deny";
  details: {
    creditHistory: string;
    paymentBehavior: string;
    debtRatio: number;
    restrictions: number;
  };
  timestamp: string;
  requestId: string;
}

function getXCurveConfig(): XCurveConfig | null {
  const apiUrl = process.env.XCURVE_API_URL;
  const apiKey = process.env.XCURVE_API_KEY;

  if (!apiUrl || !apiKey) {
    return null;
  }

  return {
    apiUrl,
    apiKey,
    timeout: parseInt(process.env.XCURVE_TIMEOUT || "30000"),
  };
}

export async function requestXCurveScore(
  req: XCurveScoreRequest
): Promise<XCurveScoreResponse | null> {
  const config = getXCurveConfig();
  if (!config) {
    console.warn("[XCurve] Integration not configured - missing XCURVE_API_URL or XCURVE_API_KEY");
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(`${config.apiUrl}/v1/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`,
        "X-Request-Source": "SIGA",
      },
      body: JSON.stringify({
        document: req.document,
        person_type: req.personType,
        full_name: req.fullName,
        requested_amount: req.requestedAmount,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[XCurve] API error ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return {
      score: data.score || data.rating || "N/A",
      scoreNumeric: data.score_numeric || data.scoreNumeric || 0,
      riskLevel: mapRiskLevel(data.risk_level || data.riskLevel),
      recommendation: mapRecommendation(data.recommendation),
      details: {
        creditHistory: data.details?.credit_history || "N/A",
        paymentBehavior: data.details?.payment_behavior || "N/A",
        debtRatio: data.details?.debt_ratio || 0,
        restrictions: data.details?.restrictions || 0,
      },
      timestamp: new Date().toISOString(),
      requestId: data.request_id || data.requestId || "",
    };
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("[XCurve] Request timed out");
    } else {
      console.error("[XCurve] Request failed:", error.message);
    }
    return null;
  }
}

function mapRiskLevel(level: string): XCurveScoreResponse["riskLevel"] {
  const normalized = (level || "").toLowerCase();
  if (normalized === "low" || normalized === "baixo") return "low";
  if (normalized === "medium" || normalized === "medio" || normalized === "médio") return "medium";
  if (normalized === "high" || normalized === "alto") return "high";
  return "very_high";
}

function mapRecommendation(rec: string): XCurveScoreResponse["recommendation"] {
  const normalized = (rec || "").toLowerCase();
  if (normalized === "approve" || normalized === "aprovado" || normalized === "aprovar") return "approve";
  if (normalized === "review" || normalized === "revisar" || normalized === "analise") return "review";
  return "deny";
}

export function registerXCurveRoutes(app: Express) {
  app.post("/api/xcurve/score", requireAuth, async (req, res) => {
    try {
      const { proposalId, document, personType, fullName, requestedAmount } = req.body;

      if (!proposalId || !document || !personType) {
        return res.status(400).json({ message: "proposalId, document e personType são obrigatórios" });
      }

      const config = getXCurveConfig();
      if (!config) {
        return res.status(503).json({
          message: "Integração XCurve não configurada. Configure XCURVE_API_URL e XCURVE_API_KEY.",
          configured: false,
        });
      }

      const result = await requestXCurveScore({
        document,
        personType,
        fullName: fullName || "",
        proposalId,
        requestedAmount,
      });

      if (!result) {
        return res.status(502).json({ message: "Erro ao consultar XCurve. Tente novamente." });
      }

      const currentUser = req.user as Express.User;
      await storage.createCreditAnalysis({
        proposalId,
        analysisType: "xcurve",
        score: result.score,
        riskLevel: result.riskLevel,
        rawResponse: JSON.stringify(result),
        conditions: result.recommendation,
        status: "completed",
      });

      await storage.createAuditEntry({
        userId: currentUser.id,
        action: "xcurve_score_requested",
        entityType: "proposal",
        entityId: String(proposalId),
        details: `XCurve score: ${result.score} (${result.riskLevel}) - ${result.recommendation}`,
        ipAddress: req.ip || null,
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Erro ao consultar XCurve" });
    }
  });

  app.get("/api/xcurve/status", requireAuth, async (req, res) => {
    const config = getXCurveConfig();
    res.json({
      configured: !!config,
      apiUrl: config ? config.apiUrl : null,
    });
  });
}
