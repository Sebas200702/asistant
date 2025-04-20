export const calculateMatchScore = (
  inputTokens: string[],
  contextKeywords: string[]
): number => {
  const matches = contextKeywords.filter((kw) =>
    inputTokens.some((t) => t.includes(kw.toLowerCase()))
  )
  return matches.length / contextKeywords.length
}
