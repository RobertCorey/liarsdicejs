export interface Log {
  log: string
  timestamp: number
}

export class Logger {
  logs: Log[] = []
  addLog(log: string) {
    const LogWithTimestamp = { log, timestamp: Date.now() }
    this.logs = [...this.logs, LogWithTimestamp]
  }

  addLogs(logs: string[]) {
    this.addLog(logs.join('\n'))
  }

  printAll() {
    this.logs.forEach(log => {
      console.log(`[${new Date(log.timestamp)}]`)
      console.log(log.log)
    })
  }
}
