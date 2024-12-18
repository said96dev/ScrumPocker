'use client'

import { Player, VotingSystem } from '@/lib/types'
import { calculateAverage } from '@/lib/utils'
import { BarChart, Calculator } from 'lucide-react'

interface GameStatsProps {
  players: any[]
  revealed: boolean
  showAverage: boolean
  votingSystem: VotingSystem
  revelCards: boolean
}

function GameStats({
  players,
  revealed,
  showAverage,
  votingSystem,
  revelCards,
}: GameStatsProps) {
  if (!revealed || !showAverage) return null
  const average = calculateAverage(players, votingSystem)
  if (!average) return null

  const votedPlayers = players.filter(
    (p) => p.vote && p.vote !== '?' && p.vote !== '--'
  ).length
  const totalPlayers = players.length
  const participationRate = Math.round((votedPlayers / totalPlayers) * 100)

  return (
    revelCards &&
    showAverage && (
      <div className='card bg-base-100 shadow-xl m-0 pb-0'>
        <div className='card-body'>
          <h3 className='card-title text-lg'>Voting Statistics</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='stat bg-base-200 rounded-box p-4'>
              <div className='stat-title'>Average Estimate</div>
              <div className='stat-value'>{average}</div>
              <div className='stat-desc'>Story Points</div>
            </div>
            <div className='stat bg-base-200 rounded-box p-4'>
              <div className='stat-title'>Participation</div>
              <div className='stat-value'>{participationRate}%</div>
              <div className='stat-desc'>
                {votedPlayers} out of {totalPlayers} voted
              </div>
            </div>
          </div>

          <div className='mt-4'>
            <h4 className='font-semibold flex items-center mb-2'>
              <BarChart className='h-4 w-4 mr-2' />
              Vote Distribution
            </h4>
            <div className='space-y-2'>
              {getVoteDistribution(players).map(
                ({ value, count, percentage }) => (
                  <div key={value} className='flex items-center gap-2'>
                    <span className='w-12 text-sm'>{value}</span>
                    <div className='flex-1 bg-base-200 rounded-full h-2'>
                      <div
                        className='bg-primary h-2 rounded-full'
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className='text-sm w-12 text-right'>{count}x</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

function getVoteDistribution(players: Player[]) {
  const distribution = new Map<string, number>()

  players.forEach((player) => {
    if (player.vote && player.vote !== '?' && player.vote !== '--') {
      distribution.set(player.vote, (distribution.get(player.vote) || 0) + 1)
    }
  })

  const totalVotes = Array.from(distribution.values()).reduce(
    (a, b) => a + b,
    0
  )

  return Array.from(distribution.entries())
    .map(([value, count]) => ({
      value,
      count,
      percentage: (count / totalVotes) * 100,
    }))
    .sort((a, b) => Number(a.value) - Number(b.value))
}

export default GameStats
