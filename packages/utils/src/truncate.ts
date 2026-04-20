export function truncate(str: string, maxLength: number): string {
  if (maxLength <= 0) {
    throw new Error(`truncate: maxLength must be greater than 0 (received ${maxLength})`)
  }

  if (str.length <= maxLength) {
    return str
  }

  return str.slice(0, maxLength - 1) + '…'
}
