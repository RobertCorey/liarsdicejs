import { Liars } from './../src/liars'
/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })
})
describe('Liars: it instantiates', () => {
  let game: Liars
  beforeEach(() => {
    game = new Liars(1, {})
  })
  it('should instantiate', () => {
    expect(game instanceof Liars).toBeTruthy()
  })
  it('works if true is truthy', () => {
    expect(game.id).toBe(1)
  })
})
