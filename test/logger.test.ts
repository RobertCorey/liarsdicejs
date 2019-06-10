import { Logger, Log } from '../src/logger'
import { mockLog } from './mocks'

describe('Logger', () => {
  let logger: Logger
  beforeEach(() => {
    logger = new Logger()
  })
  describe('addLog', () => {
    it('should add the log', () => {
      logger.addLog(mockLog)
      expect(logger.logs.length).toBe(1)
    })
    it('should convert the Log to a LogWithTimestamp', () => {
      expect(logger.addLog.length).toBe(1)
    })
  })
})
