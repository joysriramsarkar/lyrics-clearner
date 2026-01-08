/**
 * Cleans lyrics by removing extra empty lines if the text is double-spaced.
 * Rule: If there is an empty line after every line, delete the extra empty line.
 */
export function removeExtraEmptyLines(text: string): string {
  if (!text) return "";

  // ১. লাইন এন্ডিং নরমাল করা এবং খালি লাইনের স্পেস মুছে ফেলা
  let cleaned = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  cleaned = cleaned.replace(/^[ \t]+$/gm, "");

  // ২. ডাবল স্পেসিং ডিটেক্ট করার জন্য আরও সহজ লজিক
  // যদি অন্তত একটি ডাবল নিউলাইন থাকে, তবেই আমরা একে ডাবল স্পেসড ধরব
  const newlineSequences = cleaned.match(/\n+/g) || [];
  const doublePlusCount = newlineSequences.filter(s => s.length >= 2).length;

  if (doublePlusCount > 0) {
    // ৩. মূল রুল: ২টি থাকলে ১টি, ৩টি থাকলে ২টি (একটি নিউলাইন কমিয়ে দেয়া)
    return cleaned.replace(/\n{2,}/g, (match) => match.slice(1));
  }

  return text;
}