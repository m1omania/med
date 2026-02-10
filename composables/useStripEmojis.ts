export function stripEmojis(s: string): string {
  return s
    .replace(
      /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim()
}

export function useStripEmojis() {
  return { stripEmojis }
}
