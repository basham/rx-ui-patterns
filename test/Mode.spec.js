/* eslint-env mocha */
import { expect } from 'chai'
import { Mode } from '../public/util/objects/Mode.js'

describe('Mode', () => {
  it('requires an object to be the first argument', () => {
    expect(() => new Mode({})).to.not.throw('object')
    expect(() => new Mode()).to.throw()
    expect(() => new Mode(true)).to.throw()
    expect(() => new Mode(2)).to.throw()
    expect(() => new Mode('a')).to.throw()
    expect(() => new Mode(() => {})).to.throw()
  })

  it('requires 2 or more modes', () => {
    expect(() => new Mode({ modes: [] })).to.throw()
    expect(() => new Mode({ modes: ['a'] })).to.throw()
    expect(() => new Mode({ modes: ['a', 'b'] })).to.not.throw()
    expect(() => new Mode({ modes: ['a', 'b', 'c'] })).to.not.throw()
  })

  it('defaults to the first mode', () => {
    expect((new Mode({ modes: ['a', 'b'] })).value).to.equal('a')
  })

  it('sets to a specific mode during initialization', () => {
    expect((new Mode({ modes: ['a', 'b'], value: 'b' })).value).to.equal('b')
  })

  it('does not set to an invalid mode', () => {
    expect(() => {
      const mode = new Mode({ modes: ['a', 'b'] })
      mode.value = 'c'
    }).to.throw()
  })

  it('sets to a valid mode', () => {
    const mode = new Mode({ modes: ['a', 'b'] })
    expect(() => {
      mode.value = 'b'
    }).to.not.throw()
    expect(mode.value).to.equal('b')
  })

  it('moves to the next mode, without wrapping', () => {
    const mode = new Mode({ modes: ['a', 'b'] })
    mode.next()
    expect(mode.value).to.equal('b')
    mode.next()
    expect(mode.value).to.equal('b')
  })

  it('moves to the next mode, while wrapping', () => {
    const mode = new Mode({ modes: ['a', 'b'] })
    mode.next({ wrap: true })
    expect(mode.value).to.equal('b')
    mode.next({ wrap: true })
    expect(mode.value).to.equal('a')
  })

  it('moves to the previous mode, without wrapping', () => {
    const mode = new Mode({ modes: ['a', 'b'], value: 'b' })
    mode.previous()
    expect(mode.value).to.equal('a')
    mode.previous()
    expect(mode.value).to.equal('a')
  })

  it('moves to the previous mode, while wrapping', () => {
    const mode = new Mode({ modes: ['a', 'b'], value: 'b' })
    mode.previous({ wrap: true })
    expect(mode.value).to.equal('a')
    mode.previous({ wrap: true })
    expect(mode.value).to.equal('b')
  })

  it('next and previous "options" must be an object', () => {
    const mode = new Mode({ modes: ['a', 'b'] })
    expect(() => mode.next({ wrap: true })).to.not.throw()
    expect(() => mode.next({ wrap: false })).to.not.throw()
    expect(() => mode.next({})).to.not.throw()
    expect(() => mode.next()).to.not.throw()
    expect(() => mode.next(1)).to.throw()
    expect(() => mode.next('')).to.throw()
    expect(() => mode.next(false)).to.throw()
    expect(() => mode.next([])).to.throw()
    expect(() => mode.next(() => {})).to.not.throw()
    expect(() => mode.previous({ wrap: true })).to.not.throw()
    expect(() => mode.previous({ wrap: false })).to.not.throw()
    expect(() => mode.previous({})).to.not.throw()
    expect(() => mode.previous()).to.not.throw()
    expect(() => mode.previous(1)).to.throw()
    expect(() => mode.previous('')).to.throw()
    expect(() => mode.previous(false)).to.throw()
    expect(() => mode.previous([])).to.throw()
    expect(() => mode.previous(() => {})).to.not.throw()
  })
})
