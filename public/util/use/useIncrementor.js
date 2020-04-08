export function useIncrementor (initValue = 0) {
  let value = initValue
  return () => value++
}
