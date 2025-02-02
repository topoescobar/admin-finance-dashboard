import { fetchCardData } from '@/app/lib/data'

export async function getUserInvestment(userId: string) {
   const investment = await fetchCardData(userId)
   return investment
}