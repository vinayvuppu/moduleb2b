import { deepEqual } from 'fast-equals';

export class RequestCache {
  timestamp = null;
  key = null;
  result = null;
  expiryDurationInSeconds = 5 * 60;
  get(key) {
    if (this.isValid(key)) {
      return this.result;
    }
    // Reset cache in case the cache was not valid
    // The cache contains big-ass objects (a few megabytes) so removing the
    // reference to them probably helps garbage collection a lot
    this.clear();
    return null;
  }
  set(key, result) {
    this.timestamp = Date.now();
    this.key = key;
    this.result = result;
  }
  setExpiryDurationInSeconds(duration) {
    this.expiryDurationInSeconds = duration;
  }
  isValid(key) {
    return (
      this.timestamp &&
      // keep cache valid for 5 minutes
      this.timestamp > Date.now() - this.expiryDurationInSeconds * 1000 &&
      deepEqual(this.key, key)
    );
  }
  clear() {
    this.timestamp = null;
    this.key = null;
    this.result = null;
  }
}

// Same as RequestCache but doesn't require any keys
export class NoOptionsRequestCache extends RequestCache {
  cacheKey = 'singular';
  get() {
    return super.get(this.cacheKey);
  }
  set(result) {
    return super.set(this.cacheKey, result);
  }
}

export default RequestCache;
