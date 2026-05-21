import { create } from 'zustand'

interface WatchlistState {
  watchlistPlanIds: string[]
  setWatchlistIds: (ids: string[]) => void
  addToWatchlist: (id: string) => void
  removeFromWatchlist: (id: string) => void
  isWatchlisted: (id: string) => boolean
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlistPlanIds: [],
  setWatchlistIds: (ids) => set({ watchlistPlanIds: ids }),
  addToWatchlist: (id) =>
    set((state) => ({
      watchlistPlanIds: state.watchlistPlanIds.includes(id)
        ? state.watchlistPlanIds
        : [...state.watchlistPlanIds, id],
    })),
  removeFromWatchlist: (id) =>
    set((state) => ({
      watchlistPlanIds: state.watchlistPlanIds.filter((pid) => pid !== id),
    })),
  isWatchlisted: (id) => get().watchlistPlanIds.includes(id),
}))
