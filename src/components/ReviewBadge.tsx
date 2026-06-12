import type { ReviewStatusValue } from "../lib/content/schema";

const LABELS: Record<ReviewStatusValue, { text: string; cls: string }> = {
  draft: { text: "Draft", cls: "bg-ink/10 text-ink/60" },
  pending_review: { text: "Pending review", cls: "bg-amber-100 text-amber-800" },
  needs_changes: { text: "Needs changes", cls: "bg-rouge/10 text-rouge" },
  approved: { text: "Native-approved", cls: "bg-emerald-100 text-emerald-800" },
};

export default function ReviewBadge({ status }: { status: ReviewStatusValue }) {
  // The whole catalogue is queued for one big native-review sitting; per-unit
  // "pending" tags are noise until then. Approved/needs-changes still show.
  if (status === "pending_review") return null;
  const { text, cls } = LABELS[status];
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
}
