/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<Args extends unknown[], Result>(
  func: (...receivedArguments: Args) => Result,
  delay: number
): (...receivedArguments: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...receivedArguments: Args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...receivedArguments);
    }, delay);
  };
}

/**
 * Throttle function to limit how often a function can be called
 */
export function throttle<Args extends unknown[], Result>(
  func: (...receivedArguments: Args) => Result,
  delay: number
): (...receivedArguments: Args) => void {
  let lastInvocationTimestamp = 0;

  return (...receivedArguments: Args) => {
    const now = Date.now();
    if (now - lastInvocationTimestamp >= delay) {
      lastInvocationTimestamp = now;
      func(...receivedArguments);
    }
  };
}
