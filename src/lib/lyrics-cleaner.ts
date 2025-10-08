export function cleanStringLines(text: string): string {
  if (!text) return '';

  const lines = text.split('\n');
  const cleanedLines = [];

  for (const line of lines) {
    if (line.trim() === '') {
      cleanedLines.push('');
      continue;
    }

    let cleanedLine = line.trim();

    // Handle '--' at the end of the line or in the middle
    if (cleanedLine.endsWith('--')) {
      cleanedLine = cleanedLine.slice(0, -2).trim();
    } else {
      cleanedLine = cleanedLine.replace(/--/g, '—');
    }

    // Remove specified punctuation from the end of the line
    cleanedLine = cleanedLine.replace(/([,.;:।॥]+)$/, '');

    // Remove space before punctuation
    cleanedLine = cleanedLine.replace(/\s+([!?])/g, '$1');

    // Replace multiple spaces with a single space
    cleanedLine = cleanedLine.replace(/\s+/g, ' ');

    cleanedLines.push(cleanedLine.trim());
  }

  return cleanedLines.join('\n');
}

export function formatLyricsForDisplay(text: string): string {
  if (!text) return '';

  const lines = text.split('\n');
  const formattedLines = [];
  let previousLineWasBlank = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '') {
      if (!previousLineWasBlank) {
        formattedLines.push('');
        previousLineWasBlank = true;
      }
    } else {
      formattedLines.push(line);
      previousLineWasBlank = false;
    }
  }

  // Ensure the text doesn't end with multiple blank lines
  while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
    formattedLines.pop();
  }

  return formattedLines.join('\n');
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.split('\n').filter(line => line.trim().length > 0).length;
}

// Bengali number converter
export function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return bengaliDigits[parseInt(digit)];
    }
    return digit;
  }).join('');
}
