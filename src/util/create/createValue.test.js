/* eslint-env mocha */
import { expect } from '@esm-bundle/chai'
import { BehaviorSubject, isObservable } from 'rxjs'
import { createValue } from './createValue.js'

describe('createValue', () => {
  it('`value$`: exports an Observable, not BehaviorSubject', () => {
    const { value$ } = createValue()
    expect(isObservable(value$)).to.equal(true)
    expect(value$ instanceof BehaviorSubject).to.equal(false)
  })

  it('`value()`: gets the current value', () => {
    const { value } = createValue('a')
    expect(value()).to.equal('a')
  })

  it('`set()`: sets a value', () => {
    const { set, value } = createValue('a')
    set('b')
    expect(value()).to.equal('b')
  })

  it('`options.distinct = false (default)`: emits all values', () => {
    const { value$, set } = createValue('a')
    const out = []
    const sub = value$.subscribe((v) => out.push(v))
    set('a')
    set('b')
    set('b')
    set('a')
    set('a')
    expect(out.join('-')).to.equal('a-a-b-b-a-a')
    sub.unsubscribe()
  })

  it('`options.distinct = false`: emits all values', () => {
    const { value$, set } = createValue('a', { distinct: false })
    const out = []
    const sub = value$.subscribe((v) => out.push(v))
    set('a')
    set('b')
    set('b')
    set('a')
    set('a')
    expect(out.join('-')).to.equal('a-a-b-b-a-a')
    sub.unsubscribe()
  })

  it('`options.distinct = true`: does not emit repetitive values', () => {
    const { value$, set } = createValue('a', { distinct: true })
    const out = []
    const sub = value$.subscribe((v) => out.push(v))
    set('a')
    set('b')
    set('b')
    set('a')
    set('a')
    expect(out.join('-')).to.equal('a-b-a')
    sub.unsubscribe()
  })

  it('`options.parseValue`: must be a function', () => {
    expect(() => createValue()).to.not.throw()
    expect(() => createValue('a')).to.not.throw()
    expect(() => createValue('a', { parseValue: () => {} })).to.not.throw()
    expect(() => createValue('a', { parseValue: true })).to.throw()
    expect(() => createValue('a', { parseValue: 1 })).to.throw()
    expect(() => createValue('a', { parseValue: 'a' })).to.throw()
    expect(() => createValue('a', { parseValue: {} })).to.throw()
    expect(() => createValue('a', { parseValue: [] })).to.throw()
  })

  it('`tapSet()`: sets the value based on another Observable value', () => {
    const a = createValue('a')
    const b = createValue()
    const sub = a.value$.pipe(
      b.tapSet()
    ).subscribe()
    expect(b.value()).to.equal('a')
    sub.unsubscribe()
  })

  it('`tapSet() first argument`: must be a function', () => {
    const { tapSet } = createValue()
    expect(() => tapSet()).to.not.throw()
    expect(() => tapSet((value) => value)).to.not.throw()
    expect(() => tapSet(true)).to.throw()
    expect(() => tapSet(1)).to.throw()
    expect(() => tapSet('a')).to.throw()
    expect(() => tapSet({})).to.throw()
    expect(() => tapSet([])).to.throw()
  })

  it('`tapSet()`: selects and sets the value based on another Observable value', () => {
    const a = createValue({ value: 'a' })
    const b = createValue()
    const sub = a.value$.pipe(
      b.tapSet(({ value }) => value)
    ).subscribe()
    expect(b.value()).to.equal('a')
    sub.unsubscribe()
  })

  it('`update()`: re-emits the current value', () => {
    const { value$, update } = createValue('a')
    const out = []
    const sub = value$.subscribe((v) => out.push(v))
    update()
    expect(out.join('-')).to.equal('a-a')
    sub.unsubscribe()
  })
})
