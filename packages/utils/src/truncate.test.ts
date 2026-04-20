import { describe, it, expect } from 'vitest'
import { truncate } from './truncate'

describe('truncate', () => {
  it('returns strings shorter than maxLength unchanged', () => {
    expect(truncate('abc', 5)).toBe('abc')
  })

  it('returns strings equal to maxLength unchanged', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('truncates longer strings with an ellipsis, preserving total length', () => {
    const result = truncate('hello world', 5)
    expect(result).toBe('hell…')
    expect(result).toHaveLength(5)
  })

  it('returns an empty string unchanged', () => {
    expect(truncate('', 5)).toBe('')
  })

  it('throws when maxLength is zero', () => {
    expect(() => truncate('abc', 0)).toThrow(/maxLength must be greater than 0/)
  })

  it('throws when maxLength is negative', () => {
    expect(() => truncate('abc', -1)).toThrow(/maxLength must be greater than 0/)
  })
})
