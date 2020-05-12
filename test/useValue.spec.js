/* eslint-env mocha */
import { expect } from 'chai'
import { BehaviorSubject, isObservable } from 'rxjs'
import { useValue } from '../public/util/use/useValue.js'

describe('useValue', () => {
  it('exports an Observable, not BehaviorSubject', () => {
    const { value$ } = useValue()
    expect(isObservable(value$)).to.equal(true)
    expect(value$ instanceof BehaviorSubject).to.equal(false)
  })

  it('gets the current value', () => {
    const { value } = useValue('a')
    expect(value()).to.equal('a')
  })

  it('sets a value', () => {
    const { set, value } = useValue('a')
    set('b')
    expect(value()).to.equal('b')
  })

  it('emits all values by default', () => {
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

  it('emits all values if `options.distinct` is `false`', () => {
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

  it('does not emit repetitive values if `options.distinct` is `true`', () => {
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

  it('emits the current value when calling `update()`', () => {
    const { value$, update } = useValue('a')
    const out = []
    const sub = value$.subscribe((v) => out.push(v))
    update()
    expect(out.join('-')).to.equal('a-a')
    sub.unsubscribe()
  })

  it('sets the value with `tapSet()`', () => {
    const a = useValue('a')
    const b = useValue()
    const sub = a.value$.pipe(
      b.tapSet()
    ).subscribe()
    expect(b.value()).to.equal('a')
    sub.unsubscribe()
  })

  it('sets the value with `tapSet()` and a selector function', () => {
    const a = useValue({ value: 'a' })
    const b = useValue()
    const sub = a.value$.pipe(
      b.tapSet(({ value }) => value)
    ).subscribe()
    expect(b.value()).to.equal('a')
    sub.unsubscribe()
  })

  it('allows only selector functions with `tapSet()`', () => {
    const { tapSet } = useValue()
    expect(() => tapSet()).to.not.throw()
    expect(() => tapSet((value) => value)).to.not.throw()
    expect(() => tapSet(1)).to.throw()
    expect(() => tapSet(true)).to.throw()
    expect(() => tapSet('a')).to.throw()
    expect(() => tapSet({})).to.throw()
    expect(() => tapSet([])).to.throw()
  })
})
