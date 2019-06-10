import { Log, LogWithTimestamp } from '../src/logger'

export const mockPlayers = [
  { id: 1, name: 'Rob', record: { wins: 1, losses: 0 } },
  { id: 2, name: 'Tom', record: { wins: 0, losses: 1 } }
]

export const mockLobby = { id: 1, players: [] }

export const mockLog: Log = {
  log: ['foo', 'bar']
}

export const mockLogWithTimestamp: LogWithTimestamp = { ...mockLog, timestamp: 1 }
