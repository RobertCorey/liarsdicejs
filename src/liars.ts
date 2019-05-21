import { mockLobby } from './mocks'
interface Player {
  id: number
  name: string
  hand: []
}
interface Settings {
  numberOfStartingDice: number
}

interface Round {
  bids: Bid[]
}

class Game {
  players: Player[] = []
  rounds: Round[]
  currentRoundIndex: number
  currentPlayerIndex: number
  winners: Player[] = []
  losers: Player[] = []

  constructor(public id: number) {}

  startGame() {
    this.rounds = [{ bids: [] }]
    this.currentRoundIndex = 0
    this.currentPlayerIndex = Math.floor(Math.random() * this.players.length)
  }

  addPlayer(player: Player) {
    this.players = [...this.players, player]
  }

  addPlayers(players: Player[]) {
    this.players = [...this.players, ...players]
  }

  removePlayer(playerId: number) {
    this.players = this.players.filter(player => player.id !== playerId)
  }
}

// const dealDice = (player: Player, numberOfStartingDice: number): GamePlayer => {
//   const hand = new Array(numberOfStartingDice)
//     .fill(undefined)
//     .map(() => Math.floor(Math.random() * 6) + 1)
//   return {
//     ...player,
//     hand
//   }
// }

// const getNumberOfDie = (game: Game, target: number) =>
//   game.players.flatMap(player => player.hand).filter(die => die === target).length

// const handleBid = (game: Game, bid: Bid): => {
//   if (game.players[game.currentPlayerIndex].id !== bid.playerId) {
//     throw new Error('Error: only the current player is allowed to bid')
//   }
//   if (bid.type === BidType.liar) {
//     return handleLiarBid(game, bid)
//   }

//   if (bid.type === BidType.call) {
//     return handleCallBid(game, bid)
//   }
// }

// const handleCallBid = (game: Game, bid: Bid) => {
//   return {...game, rounds: [...game.rounds, {}]}

// }
// const handleLiarBid = (game: Game, bid: Bid) => {}

// const getDefaultSettings = (): Settings => {
//   return {
//     numberOfStartingDice: 5
//   }
// }

// const startGame = (lobby: Lobby, settings: any = {}): Game => {
//   let mergedSettings = { ...getDefaultSettings(), settings }
//   return {
//     ...lobby,
//     players: lobby.players.map(player => dealDice(player, mergedSettings.numberOfStartingDice)),
//     winners: [],
//     losers: [],
//     rounds: [{ bids: [] }],
//     currentRoundIndex: 0,
//     currentPlayerIndex: Math.floor(Math.random() * lobby.players.length)
//   }
// }

// let game = startGame(addPlayers(lobby, players), {})
let result = {}
console.log('result: %j', result)
