/**
 * Renders a lesson concept with textbook-style typography.
 *
 * Concept strings use a light convention: blank lines separate paragraphs, and
 * lines indented with two+ spaces are "pattern lines" (conjugation tables,
 * example patterns, bullet rules). Those become inset grammar boxes — like the
 * Point Langue boxes in a print méthode — instead of being flattened flush-left.
 */
type Block = { kind: "p"; text: string } | { kind: "pattern"; lines: string[] };

function parseConcept(concept: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let pattern: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ kind: "p", text: para.join(" ") });
      para = [];
    }
  };
  const flushPattern = () => {
    if (pattern.length) {
      blocks.push({ kind: "pattern", lines: pattern });
      pattern = [];
    }
  };

  for (const raw of concept.split("\n")) {
    if (raw.trim() === "") {
      flushPara();
      flushPattern();
      continue;
    }
    if (/^\s{2,}/.test(raw)) {
      // Pattern line: strip the two-space base indent, keep deeper indentation.
      flushPara();
      pattern.push(raw.replace(/^ {2}/, "").trimEnd());
      continue;
    }
    flushPattern();
    para.push(raw.trim());
  }
  flushPara();
  flushPattern();
  return blocks;
}

export default function ConceptText({ text }: { text: string }) {
  const blocks = parseConcept(text);
  return (
    <div className="max-w-prose space-y-3 text-ink/80">
      {blocks.map((b, i) =>
        b.kind === "p" ? (
          <p key={i}>{b.text}</p>
        ) : (
          <div
            key={i}
            className="whitespace-pre-wrap rounded-r border-l-2 border-marine/40 bg-card px-4 py-2.5 leading-relaxed text-ink/85"
          >
            {b.lines.join("\n")}
          </div>
        ),
      )}
    </div>
  );
}
