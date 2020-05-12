/* eslint-env mocha */
import { expect } from 'chai'
import { useMode } from '../public/util/use/useMode.js'

describe('useMode', () => {
  it('should only allow an array to be the first argument', () => {
    expect(() => useMode([])).to.not.throw('array')
    expect(() => useMode()).to.throw()
    expect(() => useMode(true)).to.throw()
    expect(() => useMode(2)).to.throw()
    expect(() => useMode('a')).to.throw()
    expect(() => useMode({})).to.throw()
    expect(() => useMode(() => {})).to.throw()
  })

  it('should not allow < 2 modes', () => {
    expect(() => useMode([])).to.throw()
    expect(() => useMode(['a'])).to.throw()
  })

  it('should default to the first mode', () => {
    expect(useMode(['a', 'b']).value()).to.equal('a')
  })

  it('should allow setting to a specific mode', () => {
    expect(useMode(['a', 'b'], 'b').value()).to.equal('b')
  })

  it('should not allow setting to an invalid mode', () => {
    expect(() => useMode(['a', 'b']).set('c')).to.throw()
  })

  it('should allow setting to a valid mode', () => {
    const mode = useMode(['a', 'b'])
    expect(() => mode.set('b')).to.not.throw()
    expect(mode.value()).to.equal('b')
  })
})
