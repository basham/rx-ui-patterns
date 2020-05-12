/* eslint-env mocha */
import { expect } from 'chai'
import { useMode } from '../public/util/use/useMode.js'

describe('useMode', () => {
  it('requires an array to be the first argument', () => {
    expect(() => useMode([])).to.not.throw('array')
    expect(() => useMode()).to.throw()
    expect(() => useMode(true)).to.throw()
    expect(() => useMode(2)).to.throw()
    expect(() => useMode('a')).to.throw()
    expect(() => useMode({})).to.throw()
    expect(() => useMode(() => {})).to.throw()
  })

  it('requires 2 or more modes', () => {
    expect(() => useMode([])).to.throw()
    expect(() => useMode(['a'])).to.throw()
    expect(() => useMode(['a', 'b'])).to.not.throw()
    expect(() => useMode(['a', 'b', 'c'])).to.not.throw()
  })

  it('defaults to the first mode', () => {
    expect(useMode(['a', 'b']).value()).to.equal('a')
  })

  it('sets to a specific mode during initialization', () => {
    expect(useMode(['a', 'b'], 'b').value()).to.equal('b')
  })

  it('does not set to an invalid mode', () => {
    expect(() => useMode(['a', 'b']).set('c')).to.throw()
  })

  it('sets to a valid mode', () => {
    const mode = useMode(['a', 'b'])
    expect(() => mode.set('b')).to.not.throw()
    expect(mode.value()).to.equal('b')
  })
})
