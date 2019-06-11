/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

var GameState;
(function (GameState) {
    GameState[GameState["Open"] = 0] = "Open";
    GameState[GameState["In Progress"] = 1] = "In Progress";
    GameState[GameState["Closed"] = 2] = "Closed";
})(GameState || (GameState = {}));
var Liars = /** @class */ (function () {
    function Liars(id, userSettings) {
        this.id = id;
        this.userSettings = userSettings;
        this.players = [];
        this.roundHistory = [];
        this.bids = [];
        this.currentPlayerIndex = -1;
        this.winners = [];
        this.losers = [];
        this.gameState = GameState.Open;
        this.defaultSettings = {
            numberOfStartingDice: 5
        };
        this.validFaces = [1, 2, 3, 4, 5, 6];
        this.logger = new Logger();
        this.settings = __assign({}, this.defaultSettings, userSettings);
    }
    Liars.prototype.startGame = function () {
        this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);
        this.dealDice(this.settings.numberOfStartingDice);
        this.logRoundState();
    };
    Liars.prototype.logRoundState = function () {
        var _this = this;
        var messages = [
            "There are " + this.totalNumberOfDice + " dice left in the game"
        ].concat(this.players.map(function (player) {
            return player.name + " has " + player.hand.length + " dice remaining";
        }), this.bids.map(function (bid) {
            var player = _this.getPlayerById(bid.playerId);
            return (player && player.name) + " bid " + bid.quantity + "," + bid.face;
        }));
        this.logger.addLogs(messages);
    };
    Object.defineProperty(Liars.prototype, "gameStateText", {
        get: function () {
            return Object.values(GameState)[this.gameState];
        },
        enumerable: true,
        configurable: true
    });
    Liars.prototype.dealDice = function (numberOfStartingDice) {
        var _this = this;
        this.players = this.players.map(function (player) {
            player.hand = _this.generateHand(numberOfStartingDice);
            return player;
        });
    };
    Liars.prototype.generateHand = function (numberOfDice) {
        return new Array(numberOfDice).fill(undefined).map(function () { return Math.floor(Math.random() * 6) + 1; });
    };
    Object.defineProperty(Liars.prototype, "allDice", {
        get: function () {
            return this.players.flatMap(function (player) { return player.hand; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Liars.prototype, "totalNumberOfDice", {
        get: function () {
            return this.allDice.length;
        },
        enumerable: true,
        configurable: true
    });
    Liars.prototype.getNumberOfDiceWithFace = function (target) {
        return this.allDice.filter(function (die) { return die === target; }).length;
    };
    Liars.prototype.convertPlayerToGamePlayer = function (player) {
        return __assign({}, player, { hand: [] });
    };
    Liars.prototype.addPlayer = function (player) {
        this.players = this.players.concat([this.convertPlayerToGamePlayer(player)]);
    };
    Liars.prototype.addPlayers = function (players) {
        this.players = this.players.concat(players.map(this.convertPlayerToGamePlayer));
    };
    Liars.prototype.removePlayer = function (playerId) {
        this.players = this.players.filter(function (player) { return player.id !== playerId; });
    };
    Liars.prototype.getCurrentPlayer = function () {
        return this.players[this.currentPlayerIndex];
    };
    Liars.prototype.setCurrentPlayer = function (playerId) {
        var index = this.players.findIndex(function (player) { return player.id === playerId; });
        if (index < 0) {
            throw new Error('Player not Found');
        }
        else {
            this.currentPlayerIndex = index;
        }
    };
    Liars.prototype.getCurrentBid = function () {
        if (this.bids.length > 0) {
            return this.bids[this.bids.length - 1];
        }
        throw new Error("Current Bid Doesn't exist");
    };
    Liars.prototype.convertBidToPlayerBid = function (bid) {
        return __assign({}, bid, { playerId: this.getCurrentPlayer().id });
    };
    Liars.prototype.getPlayerById = function (id) {
        return this.players.find(function (player) { return player.id === id; });
    };
    Liars.prototype.getNextPlayer = function () {
        return (this.currentPlayerIndex + 1) % this.players.length;
    };
    Liars.prototype.makeBid = function (bid) {
        try {
            this.validateBid(bid);
            this.bids = this.bids.concat([this.convertBidToPlayerBid(bid)]);
            this.logRoundState();
            this.currentPlayerIndex = this.getNextPlayer();
            return true;
        }
        catch (error) {
            return error;
        }
    };
    Liars.prototype.doesATrumpB = function (a, b) {
        if (a === b)
            return 0;
        if (a === 1)
            return 1;
        if (a > b)
            return 1;
        return -1;
    };
    Liars.prototype.isFaceValid = function (face) {
        return this.validFaces.includes(face);
    };
    Liars.prototype.validateBid = function (bid) {
        if (!this.isFaceValid(bid.face)) {
            throw new Error("That face doesn't exist in " + this.validFaces.toString());
        }
        if (this.bids.length > 0) {
            this.validatePotentialBidAgainstCurrent(bid, this.getCurrentBid());
        }
    };
    Liars.prototype.validatePotentialBidAgainstCurrent = function (potentialBid, currentBid) {
        if (potentialBid.quantity === currentBid.quantity) {
            if (this.doesATrumpB(potentialBid.face, currentBid.face) <= 0) {
                throw new Error("If the quantity of dice is the same, the face must be higher");
            }
        }
        if (potentialBid.face === currentBid.face) {
            if (potentialBid.quantity <= currentBid.quantity) {
                throw new Error("If the face of the dice is the same as the last bid, the quantity must be higher");
            }
        }
        if (potentialBid.face > currentBid.face && potentialBid.quantity < currentBid.quantity) {
            throw new Error("If the face of the die is greater than the last bid, the quantity must be greater than or the same");
        }
    };
    Liars.prototype.validateLiarCall = function () {
        if (this.bids.length < 1) {
            throw new Error("You can't call 'liar' if there are no previous bids");
        }
    };
    Liars.prototype.callLiar = function () {
        try {
            this.validateLiarCall();
            var currentBid = this.getCurrentBid();
            var actualNumberOfDie = this.getNumberOfDiceWithFace(currentBid.face);
            if (currentBid.quantity === actualNumberOfDie) {
                this.handleSpotOn();
            }
            if (currentBid.quantity > actualNumberOfDie) {
                this.handleGreaterThan();
            }
            if (currentBid.quantity < actualNumberOfDie) {
                this.handleLessThan();
            }
            this.removeWinners();
            if (this.isEndGame()) {
                this.handleEndGame();
            }
            this.startNewRound();
            return true;
        }
        catch (error) {
            return error;
        }
    };
    Liars.prototype.handleSpotOn = function () {
        this.handleLessThan();
    };
    Liars.prototype.handleLessThan = function () {
        var loserId = this.getCurrentPlayer().id;
        this.players = this.removeDice(loserId);
    };
    Liars.prototype.handleGreaterThan = function () {
        var loserId = this.getCurrentBid().playerId;
        this.players = this.removeDice(loserId);
    };
    Liars.prototype.removeDice = function (excludedPlayerId) {
        var _this = this;
        return this.players.map(function (player) {
            if (player.id !== excludedPlayerId) {
                player.hand = _this.generateHand(player.hand.length - 1);
            }
            else {
                player.hand = _this.generateHand(player.hand.length);
            }
            return player;
        });
    };
    Liars.prototype.removeWinners = function () {
        this.winners = this.winners.concat(this.players.filter(function (player) { return player.hand.length === 0; }));
        this.players = this.players.filter(function (player) { return player.hand.length !== 0; }).slice();
    };
    Liars.prototype.isEndGame = function () {
        return this.players.length === 1;
    };
    Liars.prototype.handleEndGame = function () {
        this.losers = this.players;
        this.players = [];
    };
    // TODO: make sure we are handling who the first to act is next round
    Liars.prototype.startNewRound = function () {
        this.roundHistory = this.roundHistory.concat([this.bids]);
        this.bids = [];
    };
    Object.defineProperty(Liars.prototype, "round", {
        get: function () {
            return this.roundHistory.length;
        },
        enumerable: true,
        configurable: true
    });
    Liars.prototype.printGameState = function () {
        console.log(this);
    };
    return Liars;
}());
var game = new Liars(1, {});
game.addPlayers([{ id: 1, name: 'Rob' }, { id: 2, name: 'Lela' }]);
game.startGame();
// console.log(game.players[0])
// game.printGameState()
game.makeBid({ quantity: 2, face: 3 });
game.makeBid({ quantity: 2, face: 3 });
game.makeBid({ quantity: 10, face: 2 });
game.logger.printAll();
// console.log(game.players)
// console.log(game.players)
// game.printGameState()
// game.makeBid({ quantity: 2, face: 6 })
// game.makeBid({ quantity: 1, face: 2 })
// console.log(game.bids)
// console.log('result: %j', game.getNumberOfDie(3))

export { Liars };
//# sourceMappingURL=liars.es5.js.map
