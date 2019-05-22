import { mockLobby, mockPlayers } from './mocks'
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
  value: number
  number: number
}

interface PlayerBid extends Bid {
  playerId: Player['id']
}

class Game {
  players: GamePlayer[] = []
  roundHistory = []
  bids: PlayerBid[] = []
  currentPlayerIndex: number = -1
  winners: GamePlayer[] = []
  losers: GamePlayer[] = []
  defaultSettings: Settings = {
    numberOfStartingDice: 5
  }
  settings: Settings

  constructor(public id: number, private userSettings: UserSettings) {
    this.settings = { ...this.defaultSettings, ...userSettings }
  }

  print() {
    console.log(JSON.stringify(this, null, 2))
  }

  startGame() {
    this.currentPlayerIndex = Math.floor(Math.random() * this.players.length)
    this.dealDice(this.settings.numberOfStartingDice)
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

  getNumberOfDie(target: number) {
    return this.players.flatMap(player => player.hand).filter(die => die === target).length
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

  getCurrentBid() {
    return this.bids[this.bids.length - 1]
  }

  convertBidToPlayerBid(bid: Bid): PlayerBid {
    return { ...bid, playerId: this.getCurrentPlayer().id }
  }
  makeBid(bid: Bid) {
    this.bids = [...this.bids, this.convertBidToPlayerBid(bid)]
  }

  callLiar() {
    const currentBid = this.bids[this.bids.length - 1]
    const actualNumberOfDie = this.getNumberOfDie(currentBid.value)
    if (currentBid.number === actualNumberOfDie) {
      this.handleSpotOn()
    }
    if (currentBid.number > actualNumberOfDie) {
      this.handleGreaterThan()
    }
    if (currentBid.number < actualNumberOfDie) {
      this.handleLessThan()
    }
    this.removeWinners()
    if (this.isEndGame()) {
      this.handleEndGame()
    }
  }

  handleSpotOn() {
    this.handleLessThan()
  }

  handleLessThan() {
    this.players = this.removeDice(this.getCurrentPlayer().id)
  }

  handleGreaterThan() {
    this.players = this.removeDice(this.getCurrentBid().playerId)
  }

  private removeDice(excludedPlayerId: number): GamePlayer[] {
    return this.players.map(player => {
      if (player.id !== excludedPlayerId) {
        player.hand = this.generateHand(player.hand.length - 1)
      }
      return player
    })
  }

  removeWinners() {
    this.winners = [...this.winners, ...this.players.filter(player => player.hand.length === 0)]
    this.players = [...this.players, ...this.players.filter(player => player.hand.length !== 0)]
  }

  isEndGame() {
    return this.players.length === 1
  }

  handleEndGame() {
    this.losers = this.players
    this.players = []
  }
}

let game = new Game(1, {})
game.addPlayers([{ id: 1, name: 'Rob' }, { id: 2, name: 'Tom' }])
game.startGame()

console.log('result: %j', game.getNumberOfDie(3))

// let game = startGame(addPlayers(lobby, players), {})
// let result = {}
// console.log('result: %j', result)
