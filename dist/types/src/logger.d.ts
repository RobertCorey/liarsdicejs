export interface Log {
    log: string;
    timestamp: number;
}
export declare class Logger {
    logs: Log[];
    addLog(log: string): void;
    addLogs(logs: string[]): void;
    printAll(): void;
}
