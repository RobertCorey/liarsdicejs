import { mockLobby, mockPlayers } from '../test/mocks'
import { Logger } from './logger'
interface Player {
  id: number
  name: string
}
interface GamePlayer extends Player {
  hand: number[]
}

interface UserSettings {
  numberOfStartingDice?: number
}
interface Settings {
  numberOfStartingDice: number
}

interface Bid {
  face: number
  quantity: number
}

interface PlayerBid extends Bid {
  playerId: Player['id']
}

enum GameState {
  'Open',
  'In Progress',
  'Closed'
}

export class Liars {
  players: GamePlayer[] = []
  roundHistory: PlayerBid[][] = []
  bids: PlayerBid[] = []
  currentPlayerIndex: number = -1
  winners: GamePlayer[] = []
  losers: GamePlayer[] = []
  gameState: GameState = GameState.Open
  defaultSettings: Settings = {
    numberOfStartingDice: 5
  }
  settings: Settings
  validFaces: number[] = [1, 2, 3, 4, 5, 6]
  logger: Logger = new Logger()

  constructor(public id: number, private userSettings: UserSettings) {
    this.settings = { ...this.defaultSettings, ...userSettings }
  }

  startGame() {
    this.currentPlayerIndex = Math.floor(Math.random() * this.players.length)
    this.dealDice(this.settings.numberOfStartingDice)
    this.logRoundState()
  }

  logRoundState() {
    let messages = [
      `There are ${this.totalNumberOfDice} dice left in the game`,
      ...this.players.map(player => {
        return `${player.name} has ${player.hand.length} dice remaining`
      }),
      ...this.bids.map(bid => {
        const player = this.getPlayerById(bid.playerId)
        return `${player && player.name} bid ${bid.quantity},${bid.face}`
      })
    ]
    this.logger.addLogs(messages)
  }

  get gameStateText() {
    return Object.values(GameState)[this.gameState]
  }

  private dealDice(numberOfStartingDice: number) {
    this.players = this.players.map(player => {
      player.hand = this.generateHand(numberOfStartingDice)
      return player
    })
  }

  private generateHand(numberOfDice: number) {
    return new Array(numberOfDice).fill(undefined).map(() => Math.floor(Math.random() * 6) + 1)
  }
  get allDice() {
    return this.players.flatMap(player => player.hand)
  }

  get totalNumberOfDice() {
    return this.allDice.length
  }
  getNumberOfDiceWithFace(target: number) {
    return this.allDice.filter(die => die === target).length
  }

  private convertPlayerToGamePlayer(player: Player) {
    return { ...player, hand: [] }
  }

  addPlayer(player: Player) {
    this.players = [...this.players, this.convertPlayerToGamePlayer(player)]
  }

  addPlayers(players: Player[]) {
    this.players = [...this.players, ...players.map(this.convertPlayerToGamePlayer)]
  }

  removePlayer(playerId: number) {
    this.players = this.players.filter(player => player.id !== playerId)
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  setCurrentPlayer(playerId: Player['id']) {
    const index = this.players.findIndex(player => player.id === playerId)
    if (index < 0) {
      throw new Error('Player not Found')
    } else {
      this.currentPlayerIndex = index
    }
  }

  getCurrentBid() {
    if (this.bids.length > 0) {
      return this.bids[this.bids.length - 1]
    }
    throw new Error(`Current Bid Doesn't exist`)
  }

  convertBidToPlayerBid(bid: Bid): PlayerBid {
    return { ...bid, playerId: this.getCurrentPlayer().id }
  }

  getPlayerById(id: Player['id']) {
    return this.players.find(player => player.id === id)
  }

  getNextPlayer() {
    return (this.currentPlayerIndex + 1) % this.players.length
  }

  makeBid(bid: Bid) {
    try {
      this.validateBid(bid)
      this.bids = [...this.bids, this.convertBidToPlayerBid(bid)]
      this.logRoundState()
      this.currentPlayerIndex = this.getNextPlayer()
      return true
    } catch (error) {
      return error
    }
  }

  doesATrumpB(a: number, b: number) {
    if (a === b) return 0
    if (a === 1) return 1
    if (a > b) return 1
    return -1
  }

  isFaceValid(face: number) {
    return this.validFaces.includes(face)
  }

  validateBid(bid: Bid) {
    if (!this.isFaceValid(bid.face)) {
      throw new Error(`That face doesn't exist in ${this.validFaces.toString()}`)
    }
    if (this.bids.length > 0) {
      this.validatePotentialBidAgainstCurrent(bid, this.getCurrentBid())
    }
  }

  validatePotentialBidAgainstCurrent(potentialBid: Bid, currentBid: Bid) {
    if (potentialBid.quantity === currentBid.quantity) {
      if (this.doesATrumpB(potentialBid.face, currentBid.face) <= 0) {
        throw new Error(`If the quantity of dice is the same, the face must be higher`)
      }
    }
    if (potentialBid.face === currentBid.face) {
      if (potentialBid.quantity <= currentBid.quantity) {
        throw new Error(
          `If the face of the dice is the same as the last bid, the quantity must be higher`
        )
      }
    }
    if (potentialBid.face > currentBid.face && potentialBid.quantity < currentBid.quantity) {
      throw new Error(
        `If the face of the die is greater than the last bid, the quantity must be greater than or the same`
      )
    }
  }
  validateLiarCall() {
    if (this.bids.length < 1) {
      throw new Error(`You can't call 'liar' if there are no previous bids`)
    }
  }

  callLiar() {
    try {
      this.validateLiarCall()
      const currentBid = this.getCurrentBid()
      const actualNumberOfDie = this.getNumberOfDiceWithFace(currentBid.face)
      if (currentBid.quantity === actualNumberOfDie) {
        this.handleSpotOn()
      }
      if (currentBid.quantity > actualNumberOfDie) {
        this.handleGreaterThan()
      }
      if (currentBid.quantity < actualNumberOfDie) {
        this.handleLessThan()
      }
      this.removeWinners()
      if (this.isEndGame()) {
        this.handleEndGame()
      }
      this.startNewRound()
      return true
    } catch (error) {
      return error
    }
  }

  handleSpotOn() {
    this.handleLessThan()
  }

  handleLessThan() {
    const loserId = this.getCurrentPlayer().id
    this.players = this.removeDice(loserId)
  }

  handleGreaterThan() {
    const loserId = this.getCurrentBid().playerId
    this.players = this.removeDice(loserId)
  }

  private removeDice(excludedPlayerId: number): GamePlayer[] {
    return this.players.map(player => {
      if (player.id !== excludedPlayerId) {
        player.hand = this.generateHand(player.hand.length - 1)
      } else {
        player.hand = this.generateHand(player.hand.length)
      }
      return player
    })
  }

  removeWinners() {
    this.winners = [...this.winners, ...this.players.filter(player => player.hand.length === 0)]
    this.players = [...this.players.filter(player => player.hand.length !== 0)]
  }

  isEndGame() {
    return this.players.length === 1
  }

  handleEndGame() {
    this.losers = this.players
    this.players = []
  }
  // TODO: make sure we are handling who the first to act is next round
  startNewRound() {
    this.roundHistory = [...this.roundHistory, this.bids]
    this.bids = []
  }
  get round() {
    return this.roundHistory.length
  }
  printGameState() {
    console.log(this)
  }
}
let game = new Liars(1, {})
game.addPlayers([{ id: 1, name: 'Rob' }, { id: 2, name: 'Lela' }])
game.startGame()
// console.log(game.players[0])
// game.printGameState()
game.makeBid({ quantity: 2, face: 3 })
game.makeBid({ quantity: 2, face: 3 })
game.makeBid({ quantity: 10, face: 2 })
game.logger.printAll()
// console.log(game.players)
// console.log(game.players)
// game.printGameState()
// game.makeBid({ quantity: 2, face: 6 })
// game.makeBid({ quantity: 1, face: 2 })
// console.log(game.bids)

// console.log('result: %j', game.getNumberOfDie(3))
