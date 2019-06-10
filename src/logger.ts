export interface Log {
  log: string[]
}

export interface LogWithTimestamp extends Log {
  timestamp: number
}

export class Logger {
  logs: LogWithTimestamp[] = []
  addLog(log: Log) {
    const LogWithTimestamp = { ...log, timestamp: Date.now() }
    this.logs = [...this.logs, LogWithTimestamp]
  }
}
