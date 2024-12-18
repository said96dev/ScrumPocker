import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Player, VotingSystem } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAverage(
  players: Player[],
  votingSystem: VotingSystem
): number | null {
  // console.log(players)
  //console.log(votingSystem)
  // Filter out non-numeric votes and "?" votes
  const numericVotes = players
    .map((p) => p.vote)
    .filter(
      (vote): vote is string =>
        vote !== null &&
        vote !== undefined &&
        vote !== '?' &&
        !isNaN(Number(vote.replace('½', '0.5')))
    )
    .map((vote) => Number(vote.replace('½', '0.5')))
  //const numericVotes2 = players.map((p) => console.log(p.vote))

  if (numericVotes.length === 0) return null

  // For t-shirt sizes, we can't calculate an average
  if (votingSystem === 't-shirt-sizes') return null

  const sum = numericVotes.reduce((acc, curr) => acc + curr, 0)
  const average = sum / numericVotes.length

  // Round to one decimal place
  return Math.round(average * 10) / 10
}
