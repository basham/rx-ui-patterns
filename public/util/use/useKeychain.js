export function useKeychain (prefix = 'key-') {
  let id = 0
  return () => `${prefix}${++id}`
}
