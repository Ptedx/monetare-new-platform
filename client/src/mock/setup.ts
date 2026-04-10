import { runSeed } from "./seed";
import * as h from "./handlers";

// Run seed on first initialization
runSeed();

const originalFetch = window.fetch;

function simulateDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 400));
}

function jsonRes(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeResponse(status: number, body: unknown): Response {
  return jsonRes(body, status);
}

// Parse URL path, optionally extract segment after prefix
function splitPath(path: string): string[] {
  return path.split("/").filter(Boolean);
}

async function handleApiRequest(method: string, url: string, body: string | undefined): Promise<Response> {
  await simulateDelay();

  const segments = splitPath(url);

  // --- Auth ---
  if (segments[0] === "api" && segments[1] === "auth") {
    if (segments[2] === "login") return handleResp(() => h.handleLogin(method, url, JSON.parse(body ?? "{}")));
    if (segments[2] === "me") return handleResp(h.handleMe);
    if (segments[2] === "register") return handleResp(() => h.handleRegister(JSON.parse(body ?? "{}")));
    if (segments[2] && segments[3] === "pf") return handleResp(() => h.handleUpdatePf(method, segments[2], JSON.parse(body ?? "{}")));
    if (segments[2] && segments[3] === "pj") return handleResp(() => h.handleUpdatePj(method, segments[2], JSON.parse(body ?? "{}")));
    if (method === "PUT" && segments[2]) return handleResp(() => h.handleUpdateUser(method, segments[2], JSON.parse(body ?? "{}")));
    // GET with single segment — lookup by document
    if (!segments[3]) return handleResp(() => h.handleGetByDocument(segments[2]));
  }

  // --- Proposals ---
  if (segments[0] === "api" && segments[1] === "proposals") {
    if (segments[2] === "simulate") return handleResp(() => h.handleSimulate(JSON.parse(body ?? "{}")));
    if (segments[2] === "stats") return handleResp(h.handleStats);
    if (segments[2] === "sla-alerts") return handleResp(h.handleSlaAlerts);
    if (segments[2] && segments[3] === "timeline") {
      if (method === "POST") return handleResp(() => h.handleCreateTimelineEvent(segments[2], JSON.parse(body ?? "{}")));
      return handleResp(() => h.handleGetTimeline(segments[2]));
    }
    if (segments[2] && segments[3] === "documents") {
      return handleResp(() => h.handleUploadDocument(method, segments[2], body));
    }
    if (segments[2] && segments[3] === "owner") {
      return handleResp(() => h.handleAssignOwner(method, segments[2], JSON.parse(body ?? "{}")));
    }
    if (segments[2]) return handleResp(() => {
      if (method === "PUT") return h.handleUpdateProposal(segments[2], JSON.parse(body ?? "{}"));
      return h.handleGetProposal(segments[2]);
    });
    return handleResp(h.handleGetProposals);
  }

  // --- Users ---
  if (segments[0] === "api" && segments[1] === "users") {
    if (!segments[2]) return handleResp(h.handleGetUsers);
    if (segments[3] === "role") return handleResp(() => h.handleUpdateRole(segments[2], JSON.parse(body ?? "{}")));
    return handleResp(() => h.handleGetUser(segments[2]));
  }

  // --- Visitas ---
  if (segments[0] === "api" && segments[1] === "visitas") {
    if (segments[2] === "dashboard") return handleResp(h.handleVisitasDashboard);
    if (method === "POST") return handleResp(() => h.handleCreateVisita(JSON.parse(body ?? "{}")));
    if (method === "PUT" && segments[2]) return handleResp(() => h.handleUpdateVisita(segments[2], JSON.parse(body ?? "{}")));
    return handleResp(h.handleGetVisitas);
  }

  // --- Documents / Signatures ---
  if (segments[0] === "api" && segments[1] === "documents") {
    if (segments[2] && segments[3] === "sign") {
      return handleResp(() => h.handleSign(segments[2], JSON.parse(body ?? "{}")));
    }
    if (segments[2] && segments[3] === "signatures") {
      return handleResp(() => h.handleGetSignatures(segments[2]));
    }
  }

  // --- Agencies ---
  if (segments[0] === "api" && segments[1] === "agencies" && segments[2] === "stats") {
    return handleResp(h.handleAgenciesStats);
  }

  // --- External Integrations ---
  if (segments[0] === "api" && segments[1] === "xcurve" && segments[2] === "analyze") {
    return handleResp(() => h.handleXcurveAnalyze(JSON.parse(body ?? "{}")));
  }
  if (segments[0] === "api" && segments[1] === "agronavis" && segments[2] === "analyze") {
    return handleResp(() => h.handleAgronavisAnalyze(JSON.parse(body ?? "{}")));
  }

  // Unknown route — pass through or return 404
  return makeResponse(404, { message: "Mock route not handled" });
}

function handleResp(handler: () => { status: number; body: unknown } | Promise<{ status: number; body: unknown }>): Promise<Response> {
  return Promise.resolve(handler()).then((r) => makeResponse(r.status, r.body));
}

export function setupMockApi(): void {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let url: string;
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof URL) {
      url = input.pathname;
    } else {
      url = input.url;
    }

    if (url.startsWith("/api/")) {
      const method = init?.method ?? "GET";
      const body = typeof init?.body === "string" ? init.body : undefined;
      return handleApiRequest(method, url, body);
    }

    return originalFetch(input, init);
  };
}
