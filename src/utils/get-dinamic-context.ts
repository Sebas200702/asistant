import { supabase } from '@libs/supabase'
import { calculateMatchScore } from '@utils/calculate-match-score'

export const getDynamicContext = async (
  userInput: string,
  topK: number = 5
) => {
  const tokens = userInput
    .toLowerCase()
    .split(/[\s,.;:!?]+/)
    .filter((t) => t.length > 3)

  const { data, error } = await supabase
    .from('University_data')
    .select('id, content, keywords')
    .or(tokens.map((t) => `keywords.cs.{${t}}`).join(','))
    .limit(topK)

  if (error) {
    console.error('Error fetching data:', error)
  }
  return (
    data
      ?.map((item) => ({
        score: calculateMatchScore(tokens, item.keywords),
        ...item,
      }))
      .sort((a, b) => b.score - a.score) || []
  )
}
