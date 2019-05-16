import * as prompt from 'prompt';

interface Player {
  id: number
  name: string
  record: {
    wins: number
    losses: number
  }
}

interface Lobby {
  id: number
  players: Player[]
}

interface GamePlayer extends Player {
  hand: number[]
}

interface Game extends Lobby {
  players: GamePlayer[]
  round: number
  currentPlayerIndex: number
}

interface Settings {
  numberOfStartingDice: number
}

interface Bid {
  number: number;
  face: number;
}

const addPlayer = (lobby: Lobby, player: Player): Lobby => {
  return { ...lobby, players: [...lobby.players, player] }
}
const addPlayers = (lobby: Lobby, players: Player[]): Lobby => {
  return players.reduce((previous, current) => addPlayer(previous, current), lobby)
}

const removePlayer = (lobby: Lobby, playerId: number): Lobby => {
  return { ...lobby, players: lobby.players.filter(player => player.id !== playerId) }
}

const removePlayers = (lobby: Lobby, players: Player[]): Lobby => {
  return players.reduce((previous, current) => removePlayer(previous, current.id), lobby)
}

const dealDice = (player: Player, numberOfStartingDice: number): GamePlayer => {
  const hand = new Array(numberOfStartingDice)
    .fill(undefined)
    .map(() => Math.floor(Math.random() * 6) + 1)
  return {
    ...player,
    hand
  }
}

const getDefaultSettings = (): Settings => {
  return {
    numberOfStartingDice: 5
  }
}

const startGame = (lobby: Lobby, settings: any = {}): Game => {
  let mergedSettings = { ...getDefaultSettings(), settings }
  return {
    ...lobby,
    players: lobby.players.map(player => dealDice(player, mergedSettings.numberOfStartingDice)),
    round: 0,
    currentPlayerIndex: Math.floor(Math.random() * lobby.players.length)
  }
}

let players: Player[] = [
  { id: 1, name: 'Rob', record: { wins: 1, losses: 0 } },
  { id: 2, name: 'Tom', record: { wins: 0, losses: 1 } }
]

let lobby = { id: 1, players: [] }

let game = startGame(addPlayers(lobby, players), {})
console.log("Game: %j", game);
