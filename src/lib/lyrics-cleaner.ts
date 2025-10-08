export function cleanStringLines(text: string): string {
  if (!text || !text.trim()) return '';
  
  const lines = text.split('\n');
  const cleanedLines = [];
  
  for (const line of lines) {
    let cleanedLine = line.trim();
    
    // শব্দের পরে ও যতি চিহ্নের আগে স্পেস মুছে ফেলা
    cleanedLine = cleanedLine.replace(/\s+([.,;:!?।॥])/g, '$1');
    
    // একাধিক স্পেসকে একটিতে পরিণত করা
    cleanedLine = cleanedLine.replace(/\s+/g, ' ');
    
    // লাইনের শেষে অবাঞ্ছিত যতিচিহ্ন মুছে ফেলা (সিমপ্লিফাইড)
    cleanedLine = cleanedLine.replace(/[.,;:'"()\[\]{}<>\-_=+@#$%^&*|/\\~`।॥]+$/g, '');
    
    // আলাদাভাবে '--' মুছে ফেলা
    cleanedLine = cleanedLine.replace(/--+$/g, '');
    
    if (cleanedLine) {
      cleanedLines.push(cleanedLine);
    }
  }
  
  return cleanedLines.join('\n');
}

export function formatLyricsForDisplay(text: string): string {
  if (!text) return '';
  
  // অতিরিক্ত ফরম্যাটিং - খালি লাইন রিমুভ করা
  return text.split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n');
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.split('\n').filter(line => line.trim().length > 0).length;
}

// বাংলা সংখ্যা কনভার্টার
export function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return bengaliDigits[parseInt(digit)];
    }
    return digit;
  }).join('');
}