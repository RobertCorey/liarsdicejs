interface Log {
  log: string[]
}

interface LogWithTimestamp extends Log {
  timestamp: number
}

export class Logger {
  logs: LogWithTimestamp[] = []
  addLog(log: Log) {
    const LogWithTimestamp = { ...log, timestamp: Date.now() }
    this.logs = [...this.logs, LogWithTimestamp]
  }
}
