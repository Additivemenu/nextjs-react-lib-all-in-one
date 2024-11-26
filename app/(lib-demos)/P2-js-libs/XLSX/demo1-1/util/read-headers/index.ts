// index.ts

/**
 * Interface for the cached header data structure
 */
interface CachedFileHeaders {
  timestamp: number;
  headers: string[][]; // Array of header rows (1-100)
  fileHash: string;
}

/**
 * Cache duration in milliseconds (e.g., 1 hour)
 */
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Maximum header row to cache
 */
const MAX_CACHED_ROW = 100;

/**
 * Calculate a hash for the file
 */
async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Get cache key from file hash
 */
const getCacheKey = (fileHash: string): string => {
  return `excel_headers_${fileHash}`;
};

/**
 * Retrieves headers from cache if available
 */
const getFromCache = (fileHash: string): string[][] | null => {
  try {
    const cacheKey = getCacheKey(fileHash);
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const parsedCache: CachedFileHeaders = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (
      now - parsedCache.timestamp <= CACHE_DURATION &&
      parsedCache.fileHash === fileHash
    ) {
      return parsedCache.headers;
    }

    // Remove expired cache
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.warn("Error reading from cache:", error);
    return null;
  }
};

/**
 * Saves headers to cache
 */
const saveToCache = (fileHash: string, headers: string[][]): void => {
  try {
    const cacheData: CachedFileHeaders = {
      timestamp: Date.now(),
      headers,
      fileHash,
    };
    const cacheKey = getCacheKey(fileHash);
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Error saving to cache:", error);
  }
};

/**
 * This function reads the file in a web worker to avoid blocking the main thread.
 * For header rows <= 100, it attempts to retrieve from cache first.
 *
 * @param file
 * @param headerRow
 * @returns Promise<string[]> a promise that resolves with the headers array
 */
export const readHeaderValuesAsync = async (
  file: File,
  headerRow: number,
): Promise<string[]> => {
  // Calculate file hash
  const fileHash = await calculateFileHash(file);

  // Check if headerRow is within caching range
  if (headerRow <= MAX_CACHED_ROW) {
    const cachedHeaders = getFromCache(fileHash);
    if (cachedHeaders) {
      // Return the specific row from cache (adjust for 0-based index)
      return cachedHeaders[headerRow - 1];
    }

    // If not in cache, read first 100 rows
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });

      worker.onmessage = (e: MessageEvent) => {
        const { headers, error } = e.data;
        worker.terminate();

        if (error) {
          reject(new Error(error));
        } else {
          // Cache all headers
          saveToCache(fileHash, headers);
          // Return the requested row
          resolve(headers[headerRow - 1]);
        }
      };

      worker.onerror = (error) => {
        worker.terminate();
        reject(error);
      };

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        worker.postMessage({
          file: e.target?.result,
          readFirstNRows: MAX_CACHED_ROW,
        });
      };
      reader.onerror = (error) => {
        worker.terminate();
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // For rows > 100, use the original single-row reading logic
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (e: MessageEvent) => {
      const { headers, error } = e.data;
      worker.terminate();

      if (error) {
        reject(new Error(error));
      } else {
        resolve(headers);
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      worker.postMessage({
        file: e.target?.result,
        headerRow,
      });
    };
    reader.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
