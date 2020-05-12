/* eslint-env mocha */
import { expect } from 'chai'
import { useBoolean } from '../public/util/use/useBoolean.js'

describe('useBoolean', () => {
  it('defaults to false', () => {
    expect(useBoolean().value()).to.equal(false)
  })

  it('sets to true', () => {
    const bool = useBoolean(false)
    bool.toTrue()
    expect(bool.value()).to.equal(true)
  })

  it('sets to false', () => {
    const bool = useBoolean(true)
    bool.toFalse()
    expect(bool.value()).to.equal(false)
  })

  it('toggles', () => {
    const bool = useBoolean(false)
    bool.toggle()
    expect(bool.value()).to.equal(true)
    bool.toggle()
    expect(bool.value()).to.equal(false)
  })
})
