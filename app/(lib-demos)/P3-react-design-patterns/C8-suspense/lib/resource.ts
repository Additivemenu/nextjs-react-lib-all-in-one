// Simple cache for demonstration
const cache = new Map<string, any>();

// Simple function to wrap promises for Suspense
export function wrapPromise<T>(promise: Promise<T>, cacheKey: string): () => T {
  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    
    if (cached.status === 'fulfilled') {
      return () => cached.data;
    }
    
    if (cached.status === 'rejected') {
      throw cached.error;
    }
    
    // Still pending, throw the promise
    throw cached.promise;
  }

  // Create and cache the promise
  const wrappedPromise = promise
    .then((data) => {
      cache.set(cacheKey, { status: 'fulfilled', data });
      return data;
    })
    .catch((error) => {
      cache.set(cacheKey, { status: 'rejected', error });
      throw error;
    });

  cache.set(cacheKey, { status: 'pending', promise: wrappedPromise });
  
  // Throw the promise to suspend
  throw wrappedPromise;
}

// Clear cache for refresh
export function clearCache(cacheKey?: string) {
  if (cacheKey) {
    cache.delete(cacheKey);
  } else {
    cache.clear();
  }
}
