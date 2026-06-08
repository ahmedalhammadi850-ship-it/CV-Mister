/**
 * BulletDesc — renders a description field as individual lines, each in its
 * own div with break-inside:avoid so no single bullet point is ever orphaned
 * across a page break.
 *
 * Single-line text falls back to the original behaviour (one div, pre-line).
 * Multi-line text (newline-separated) gets one div per line, each protected.
 */
export default function BulletDesc({ text, style, bold, italic }) {
  if (!text) return null;

  const spanStyle = {
    fontWeight:  bold   ? 700       : undefined,
    fontStyle:   italic ? 'italic'  : undefined,
  };

  const lines = text.split('\n').filter(l => l.trim() !== '');

  if (lines.length <= 1) {
    return (
      <div style={style}>
        <span style={spanStyle}>{text}</span>
      </div>
    );
  }

  // Strip whiteSpace:pre-line from the wrapper — we handle newlines manually.
  const { whiteSpace: _ws, ...wrapStyle } = style || {};

  return (
    <div style={wrapStyle}>
      {lines.map((line, i) => (
        <div key={i} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <span style={spanStyle}>{line}</span>
        </div>
      ))}
    </div>
  );
}
