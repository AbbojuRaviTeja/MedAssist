// Lightweight markdown → JSX renderer.
// Supports: **bold**, *italic*, `inline code`, ```code blocks```, paragraphs, line breaks.
// No external dependency needed — we control all assistant content so XSS isn't a concern.

const CODE_BLOCK_RE = /(```[\s\S]*?```)/g;
const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

function parseInline(text, baseKey) {
  return text.split(INLINE_RE).map((part, i) => {
    const key = `${baseKey}-${i}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={key} className="inline-code">{part.slice(1, -1)}</code>;
    }
    return <span key={key}>{part}</span>;
  });
}

function renderParagraph(text, paraKey) {
  return text.split('\n').flatMap((line, li, arr) => {
    const inline = parseInline(line, `${paraKey}-l${li}`);
    return li < arr.length - 1 ? [...inline, <br key={`${paraKey}-br${li}`} />] : inline;
  });
}

export function MarkdownContent({ content }) {
  const segments = content.split(CODE_BLOCK_RE);

  return (
    <div className="markdown">
      {segments.map((seg, si) => {
        if (seg.startsWith('```')) {
          const nlIdx = seg.indexOf('\n');
          const hasLang = nlIdx > 3;
          const lang = hasLang ? seg.slice(3, nlIdx).trim() : '';
          const code = seg.slice(hasLang ? nlIdx + 1 : 3).replace(/```$/, '').trimEnd();
          return (
            <div key={si} className="code-block">
              {lang && <span className="code-lang">{lang}</span>}
              <pre><code>{code}</code></pre>
            </div>
          );
        }

        return seg
          .split(/\n{2,}/)
          .filter((p) => p.trim())
          .map((para, pi) => (
            <p key={`${si}-${pi}`}>{renderParagraph(para.trim(), `${si}-${pi}`)}</p>
          ));
      })}
    </div>
  );
}
