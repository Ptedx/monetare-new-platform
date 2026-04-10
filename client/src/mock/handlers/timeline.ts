import * as db from "../db";
import { MockTimelineEvent, MockUser } from "../types";

function nextTimelineId(): number {
  const items = db.getCollection<MockTimelineEvent>("timeline");
  if (items.length === 0) return 1;
  return Math.max(...items.map((t) => t.id)) + 1;
}

export function handleGetTimeline(proposalId: string) {
  const events = db
    .getCollection<MockTimelineEvent>("timeline")
    .filter((e) => e.proposalId === parseInt(proposalId, 10));
  return { status: 200, body: events };
}

export function handleCreateTimelineEvent(proposalId: string, body: unknown) {
  const pid = parseInt(proposalId, 10);
  const data = body as { eventType: string; content: Record<string, unknown> };
  const session = db.getSession();

  let userName = "Sistema";
  let userRole = "Sistema";
  if (session) {
    const user = db.getById<MockUser>("users", session.userId);
    if (user) {
      userName = user.name;
      userRole = user.profile?.description ?? "Usuário";
    }
  }

  const event: MockTimelineEvent = {
    id: nextTimelineId(),
    proposalId: pid,
    eventType: data.eventType ?? "COMMENT",
    content: data.content ?? {},
    createdAt: new Date().toISOString(),
    user: { name: userName, role: userRole },
  };
  db.createItem<MockTimelineEvent>("timeline", event);
  return { status: 200, body: { success: true, event } };
}
