/**
 * Cleans lyrics by removing extra empty lines if the text is double-spaced.
 * Rule: If there is an empty line after every line, delete the extra empty line.
 */
export function removeExtraEmptyLines(text: string): string {
  // Normalize line endings to \n
  let normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove whitespace from lines that contain only whitespace
  normalized = normalized.replace(/^[ \t]+$/gm, "");

  // Find all newline sequences
  const newlineSequences = normalized.match(/\n+/g);

  if (!newlineSequences) return text;

  let doubleOrMoreCount = 0;
  let singleCount = 0;

  for (const seq of newlineSequences) {
    if (seq.length >= 2) doubleOrMoreCount++;
    else singleCount++;
  }

  // Heuristic: If double newlines (or more) are more frequent than single newlines,
  // it indicates the text is likely double-spaced.
  if (doubleOrMoreCount > singleCount) {
    // Rule: Remove exactly one newline from any sequence of 2 or more newlines.
    // 3 newlines (\n\n\n) -> 2 newlines (\n\n)
    // 2 newlines (\n\n) -> 1 newline (\n)
    return normalized.replace(/\n{2,}/g, (match) => match.slice(1));
  }

  // Return original text if the condition is not met
  return text;
}