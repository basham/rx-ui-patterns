/* eslint-env mocha */
import { expect } from 'chai'
import { useInt } from '../public/util/use/useInt.js'

describe('useInt', () => {
  it('defaults to 0', () => {
    expect(useInt().value()).to.equal(0)
  })

  it('allows only integers', () => {
    expect(() => useInt(1)).to.not.throw()
    expect(() => useInt(1.0)).to.not.throw()
    expect(() => useInt(1.5)).to.throw()
    expect(() => useInt('1')).to.throw()
    expect(() => useInt(true)).to.throw()
    expect(() => useInt(null)).to.throw()
    expect(() => useInt({})).to.throw()
    expect(() => useInt([])).to.throw()
    expect(() => useInt(() => {})).to.throw()
  })

  it('increments', () => {
    const int = useInt()
    expect(int.increment()).to.equal(1)
    expect(int.value()).to.equal(1)
    expect(int.increment()).to.equal(2)
    expect(int.value()).to.equal(2)
  })

  it('decrements', () => {
    const int = useInt()
    expect(int.decrement()).to.equal(-1)
    expect(int.value()).to.equal(-1)
    expect(int.decrement()).to.equal(-2)
    expect(int.value()).to.equal(-2)
  })
})
