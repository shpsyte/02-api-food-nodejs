import { describe, expect, it } from 'vitest'

describe('exemples', () => {
  it('should pass', () => {
    const expectValue = 1
    const actualValue = 1

    expect(
      expectValue,
      `Expected the value to be ${expectValue} but got ${actualValue} `,
    ).toBe(actualValue)
  })
})
