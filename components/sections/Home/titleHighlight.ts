// components/sections/Home/titleHighlight.ts

export function getHighlightRange(
  words: string[],
  highlight: string,
): { start: number; end: number } | null {
  const target = highlight.split(" ").filter((word) => word !== "");
  if (target.length === 0) return null;

  for (let start = 0; start + target.length <= words.length; start++) {
    if (target.every((word, offset) => words[start + offset] === word)) {
      return { start, end: start + target.length };
    }
  }
  return null;
}
