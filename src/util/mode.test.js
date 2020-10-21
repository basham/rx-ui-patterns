/* eslint-env mocha */
import { expect } from '@esm-bundle/chai'
import { nextMode, parseOptions, previousMode, setMode } from './mode.js'

describe('mode', () => {
  it('requires "options" to be an object', () => {
    expect(() => parseOptions({})).to.not.throw('object')
    expect(() => parseOptions()).to.throw()
    expect(() => parseOptions(true)).to.throw()
    expect(() => parseOptions(2)).to.throw()
    expect(() => parseOptions('a')).to.throw()
    expect(() => parseOptions(() => {})).to.throw()
  })

  it('requires 2 or more modes', () => {
    expect(() => parseOptions({ modes: [] })).to.throw()
    expect(() => parseOptions({ modes: ['a'] })).to.throw()
    expect(() => parseOptions({ modes: ['a', 'b'] })).to.not.throw()
    expect(() => parseOptions({ modes: ['a', 'b', 'c'] })).to.not.throw()
  })

  it('defaults to the first mode', () => {
    expect(parseOptions({ modes: ['a', 'b'] }).defaultValue).to.equal('a')
  })

  it('sets to a specific mode during initialization', () => {
    expect(parseOptions({ modes: ['a', 'b'], defaultValue: 'b' }).defaultValue).to.equal('b')
  })

  it('does not set to an invalid mode', () => {
    expect(() => setMode('c', { modes: ['a', 'b'] })).to.throw()
  })

  it('sets to a valid mode', () => {
    expect(setMode('b', { modes: ['a', 'b'] })).to.equal('b')
  })

  it('sets to the default mode', () => {
    expect(setMode(undefined, { modes: ['a', 'b'] })).to.equal('a')
    expect(setMode(undefined, { modes: ['a', 'b'], defaultValue: 'b' })).to.equal('b')
  })

  it('moves to the next mode, without wrapping', () => {
    expect(nextMode('a', { modes: ['a', 'b'] })).to.equal('b')
    expect(nextMode('b', { modes: ['a', 'b'] })).to.equal('b')
  })

  it('moves to the next mode, while wrapping', () => {
    expect(nextMode('a', { modes: ['a', 'b'], wrap: true })).to.equal('b')
    expect(nextMode('b', { modes: ['a', 'b'], wrap: true })).to.equal('a')
  })

  it('moves to the previous mode, without wrapping', () => {
    expect(previousMode('b', { modes: ['a', 'b'] })).to.equal('a')
    expect(previousMode('a', { modes: ['a', 'b'] })).to.equal('a')
  })

  it('moves to the previous mode, while wrapping', () => {
    expect(previousMode('b', { modes: ['a', 'b'], wrap: true })).to.equal('a')
    expect(previousMode('a', { modes: ['a', 'b'], wrap: true })).to.equal('b')
  })
})
