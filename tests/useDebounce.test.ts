import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from '../src/composables/useDebounce'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useDebounce', () => {
  it('invokes only once after the delay for rapid calls', () => {
    const spy = vi.fn()
    const debounced = useDebounce(spy, 300)
    debounced('a')
    debounced('b')
    debounced('c')
    expect(spy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('c')
  })
})
