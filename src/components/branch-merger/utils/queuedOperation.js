import { RATE_LIMIT_DELAY } from '../constants';

/**
 * Creates a queued and rate-limited operation executor.
 * Ensures operations:
 * 1. Execute in order they were called
 * 2. Maintain minimum delay between them
 * 3. All get executed eventually
 */
export function createQueuedOperation() {
  let queue = Promise.resolve();
  let lastCallTime = 0;

  return async function executeOperation(operation) {
    const task = async () => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTime;
      
      if (timeSinceLastCall < RATE_LIMIT_DELAY) {
        await new Promise(resolve => 
          setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastCall)
        );
      }
      
      lastCallTime = Date.now();
      return operation();
    };

    queue = queue.then(task);
    return queue;
  };
} 