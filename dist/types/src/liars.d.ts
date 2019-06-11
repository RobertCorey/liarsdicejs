import { Logger } from './logger';
interface Player {
    id: number;
    name: string;
}
interface GamePlayer extends Player {
    hand: number[];
}
interface UserSettings {
    numberOfStartingDice?: number;
}
interface Settings {
    numberOfStartingDice: number;
}
interface Bid {
    face: number;
    quantity: number;
}
interface PlayerBid extends Bid {
    playerId: Player['id'];
}
declare enum GameState {
    'Open' = 0,
    'In Progress' = 1,
    'Closed' = 2
}
export declare class Liars {
    id: number;
    private userSettings;
    players: GamePlayer[];
    roundHistory: PlayerBid[][];
    bids: PlayerBid[];
    currentPlayerIndex: number;
    winners: GamePlayer[];
    losers: GamePlayer[];
    gameState: GameState;
    defaultSettings: Settings;
    settings: Settings;
    validFaces: number[];
    logger: Logger;
    constructor(id: number, userSettings: UserSettings);
    startGame(): void;
    logRoundState(): void;
    readonly gameStateText: any;
    private dealDice;
    private generateHand;
    readonly allDice: number[];
    readonly totalNumberOfDice: number;
    getNumberOfDiceWithFace(target: number): number;
    private convertPlayerToGamePlayer;
    addPlayer(player: Player): void;
    addPlayers(players: Player[]): void;
    removePlayer(playerId: number): void;
    getCurrentPlayer(): GamePlayer;
    setCurrentPlayer(playerId: Player['id']): void;
    getCurrentBid(): PlayerBid;
    convertBidToPlayerBid(bid: Bid): PlayerBid;
    getPlayerById(id: Player['id']): GamePlayer | undefined;
    getNextPlayer(): number;
    makeBid(bid: Bid): any;
    doesATrumpB(a: number, b: number): 1 | -1 | 0;
    isFaceValid(face: number): boolean;
    validateBid(bid: Bid): void;
    validatePotentialBidAgainstCurrent(potentialBid: Bid, currentBid: Bid): void;
    validateLiarCall(): void;
    callLiar(): any;
    handleSpotOn(): void;
    handleLessThan(): void;
    handleGreaterThan(): void;
    private removeDice;
    removeWinners(): void;
    isEndGame(): boolean;
    handleEndGame(): void;
    startNewRound(): void;
    readonly round: number;
    printGameState(): void;
}
export {};
