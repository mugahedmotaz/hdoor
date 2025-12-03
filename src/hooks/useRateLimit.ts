import { useState, useCallback } from 'react';

interface RateLimitState {
 attempts: number;
 lastAttempt: number;
 isBlocked: boolean;
 remainingTime: number;
}

const useRateLimit = (maxAttempts: number = 5, windowMs: number = 60000) => {
 const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
  attempts: 0,
  lastAttempt: 0,
  isBlocked: false,
  remainingTime: 0,
 });

 const checkRateLimit = useCallback(() => {
  const now = Date.now();
  const timeSinceLastAttempt = now - rateLimitState.lastAttempt;

  // Reset window if enough time has passed
  if (timeSinceLastAttempt > windowMs) {
   setRateLimitState({
    attempts: 0,
    lastAttempt: 0,
    isBlocked: false,
    remainingTime: 0,
   });
   return { allowed: true, remainingTime: 0 };
  }

  // Check if blocked
  if (rateLimitState.attempts >= maxAttempts) {
   const remainingTime = windowMs - timeSinceLastAttempt;
   return { allowed: false, remainingTime };
  }

  return { allowed: true, remainingTime: 0 };
 }, [rateLimitState, maxAttempts, windowMs]);

 const recordAttempt = useCallback(() => {
  const now = Date.now();
  const timeSinceLastAttempt = now - rateLimitState.lastAttempt;

  // Reset window if enough time has passed
  if (timeSinceLastAttempt > windowMs) {
   setRateLimitState({
    attempts: 1,
    lastAttempt: now,
    isBlocked: false,
    remainingTime: 0,
   });
   return { allowed: true, remainingTime: 0 };
  }

  const newAttempts = rateLimitState.attempts + 1;
  const isBlocked = newAttempts >= maxAttempts;
  const remainingTime = isBlocked ? windowMs : 0;

  setRateLimitState({
   attempts: newAttempts,
   lastAttempt: now,
   isBlocked,
   remainingTime,
  });

  return { allowed: !isBlocked, remainingTime };
 }, [rateLimitState, maxAttempts, windowMs]);

 const resetRateLimit = useCallback(() => {
  setRateLimitState({
   attempts: 0,
   lastAttempt: 0,
   isBlocked: false,
   remainingTime: 0,
  });
 }, []);

 return {
  checkRateLimit,
  recordAttempt,
  resetRateLimit,
  isBlocked: rateLimitState.isBlocked,
  attempts: rateLimitState.attempts,
  remainingTime: rateLimitState.remainingTime,
 };
};

export default useRateLimit;
