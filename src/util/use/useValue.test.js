/* eslint-env mocha */
import { expect } from '@esm-bundle/chai'
import { BehaviorSubject, isObservable } from 'rxjs'
import { useValue } from './useValue.js'

describe('useValue', () => {
  it('`value$`: exports an Observable, not BehaviorSubject', () => {
    const { value$ } = useValue()
    expect(isObservable(value$)).to.equal(true)
    expect(value$ instanceof BehaviorSubject).to.equal(false)
  })

  it('`value()`: gets the current value', () => {
    const { value } = useValue('a')
    expect(value()).to.equal('a')
  })

  it('`set()`: sets a value', () => {
    const { set, value } = useValue('a')
    set('b')
    expect(value()).to.equal('b')
  })

  it('`options.distinct = false (default)`: emits all values', () => {
    const { value$, set } = useValue('a')
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
    const { value$, set } = useValue('a', { distinct: false })
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
    const { value$, set } = useValue('a', { distinct: true })
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
    expect(() => useValue()).to.not.throw()
    expect(() => useValue('a')).to.not.throw()
    expect(() => useValue('a', { parseValue: () => {} })).to.not.throw()
    expect(() => useValue('a', { parseValue: true })).to.throw()
    expect(() => useValue('a', { parseValue: 1 })).to.throw()
    expect(() => useValue('a', { parseValue: 'a' })).to.throw()
    expect(() => useValue('a', { parseValue: {} })).to.throw()
    expect(() => useValue('a', { parseValue: [] })).to.throw()
  })

  it('`tapSet()`: sets the value based on another Observable value', () => {
    const a = useValue('a')
    const b = useValue()
    const sub = a.value$.pipe(
      b.tapSet()
    ).subscribe()
    expect(b.value()).to.equal('a')
    sub.unsubscribe()
  })

  it('`tapSet() first argument`: must be a function', () => {
    const { tapSet } = useValue()
    expect(() => tapSet()).to.not.throw()
    expect(() => tapSet((value) => value)).to.not.throw()
    expect(() => tapSet(true)).to.throw()
    expect(() => tapSet(1)).to.throw()
    expect(() => tapSet('a')).to.throw()
    expect(() => tapSet({})).to.throw()
    expect(() => tapSet([])).to.throw()
  })

  it('`tapSet()`: selects and sets the value based on another Observable value', () => {
    const a = useValue({ value: 'a' })
    const b = useValue()
    const sub = a.value$.pipe(
      b.tapSet(({ value }) => value)
    ).subscribe()
    expect(b.value()).to.equal('a')
    sub.unsubscribe()
  })

  it('`update()`: re-emits the current value', () => {
    const { value$, update } = useValue('a')
    const out = []
    const sub = value$.subscribe((v) => out.push(v))
    update()
    expect(out.join('-')).to.equal('a-a')
    sub.unsubscribe()
  })
})
