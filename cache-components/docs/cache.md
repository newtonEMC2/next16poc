# CacheLife User Timeline Examples

This document explains how Next.js `cacheLife({ stale, revalidate, expire })` behaves when users access the website at different times.

---

## CacheLife Config Example

```ts
cacheLife({ stale: 60, revalidate: 300, expire: 1800 });
```

* **stale:** 60s
* **revalidate:** 300s
* **expire:** 1800s

---

## Status Table

| Status      | Meaning            | When it happens                            |
| ----------- | ------------------ | ------------------------------------------ |
| **Fresh**   | Safe to serve      | `age < revalidate`                         |
| **Stale**   | Old, but allowed   | `revalidate <= age < (revalidate + stale)` |
| **Expired** | Deleted from cache | `age >= expire`                            |

---

## User Entry Timeline

| User Access Time (s) | Age of Cached Data (s) | Status  | Behavior / What the User Sees                                                        |
| -------------------- | ---------------------- | ------- | ------------------------------------------------------------------------------------ |
| 0                    | 0                      | Fresh   | First request, cache created, served instantly                                       |
| 100                  | 100                    | Fresh   | Cache still fresh, served instantly                                                  |
| 300                  | 300                    | Stale   | Cache eligible for regeneration, served instantly; background regeneration starts    |
| 320                  | 320                    | Stale   | Old data served instantly, regeneration in background continues                      |
| 360                  | 360                    | Fresh   | Regeneration completed, new cache available                                          |
| 900                  | 900                    | Fresh   | Cache is fresh after multiple regeneration cycles, served instantly                  |
| 1800                 | 1800                   | Expired | Cache deleted, next request recomputes fully, user waits for computation to complete |
| 1820                 | 20                     | Fresh   | New cache being generated, user waits until recomputation completes                  |

---

## Notes

1. **Fresh**: Users always get an instantaneous response if cache exists and is within the fresh period.
2. **Stale**: Users get the old cached data instantly; regeneration happens in the background.
3. **Expired**: No cache exists; the function executes fully, which may introduce latency. Users must wait for computation.

---
