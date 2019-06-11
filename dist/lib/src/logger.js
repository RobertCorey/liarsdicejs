"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger() {
        this.logs = [];
    }
    Logger.prototype.addLog = function (log) {
        var LogWithTimestamp = { log: log, timestamp: Date.now() };
        this.logs = this.logs.concat([LogWithTimestamp]);
    };
    Logger.prototype.addLogs = function (logs) {
        this.addLog(logs.join('\n'));
    };
    Logger.prototype.printAll = function () {
        this.logs.forEach(function (log) {
            console.log("[" + new Date(log.timestamp) + "]");
            console.log(log.log);
        });
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map