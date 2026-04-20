import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('slugifies a simple lowercase word', () => {
    expect(slugify('hello')).toBe('hello')
  })

  it('lowercases mixed-case input', () => {
    expect(slugify('HelloWorld')).toBe('helloworld')
  })

  it('replaces punctuation runs with a single hyphen', () => {
    expect(slugify("What's up, world?!")).toBe('what-s-up-world')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('hello    world')).toBe('hello-world')
  })

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('replaces non-ASCII characters with hyphens', () => {
    expect(slugify('Café déjà vu')).toBe('caf-d-j-vu')
  })

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })

  it('returns an empty string when input has no alphanumeric characters', () => {
    expect(slugify('!!!---???')).toBe('')
  })
})
