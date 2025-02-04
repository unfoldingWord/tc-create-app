import { RETRY_ATTEMPTS, RETRY_DELAY } from '../constants';

/**
 * Wraps an operation with retry logic.
 * Will retry failed operations up to RETRY_ATTEMPTS times.
 */
export async function withRetry(operation) {
  for (let i = 0; i < RETRY_ATTEMPTS; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === RETRY_ATTEMPTS - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
} 