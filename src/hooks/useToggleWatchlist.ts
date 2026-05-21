import { useMutation, useQueryClient } from '@tanstack/react-query'
import { watchlistAPI } from '../services/api'
import { useWatchlistStore } from '../stores/watchlistStore'

export function useToggleWatchlist() {
  const queryClient = useQueryClient()
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist)
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist)
  const watchlistPlanIds = useWatchlistStore((state) => state.watchlistPlanIds)

  return useMutation({
    mutationFn: (planId: string) => watchlistAPI.toggleWatchlist(planId),
    onMutate: async (planId) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['watchlist'] })
      await queryClient.cancelQueries({ queryKey: ['recommendations'] })

      // Snapshot previous states
      const prevWatchlist = queryClient.getQueryData(['watchlist'])
      const prevRecommendations = queryClient.getQueryData(['recommendations'])

      const currentlyWatchlisted = watchlistPlanIds.includes(planId)

      // Optimistically update Zustand store
      if (currentlyWatchlisted) {
        removeFromWatchlist(planId)
      } else {
        addToWatchlist(planId)
      }

      // Optimistically update React Query cache for watchlist
      if (prevWatchlist) {
        queryClient.setQueryData(['watchlist'], (old: any) => {
          if (!old) return old
          if (currentlyWatchlisted) {
            return {
              ...old,
              plans: old.plans.filter((p: any) => p.id !== planId),
            }
          } else {
            // Placeholder plan while loading
            return {
              ...old,
              plans: [...old.plans, { id: planId, name: 'Updating...', insurer: '' }],
            }
          }
        })
      }

      // Optimistically update React Query cache for recommendations
      if (prevRecommendations) {
        queryClient.setQueryData(['recommendations'], (old: any) => {
          if (!old || !old.recommendations) return old
          return {
            ...old,
            recommendations: old.recommendations.map((r: any) => {
              if (r.id === planId) {
                return { ...r, isWatchlisted: !currentlyWatchlisted }
              }
              return r
            }),
          }
        })
      }

      return { prevWatchlist, prevRecommendations, planId, currentlyWatchlisted }
    },
    onError: (err, planId, context: any) => {
      // Rollback Zustand
      if (context?.currentlyWatchlisted) {
        addToWatchlist(planId)
      } else {
        removeFromWatchlist(planId)
      }

      // Rollback React Query cache
      if (context?.prevWatchlist) {
        queryClient.setQueryData(['watchlist'], context.prevWatchlist)
      }
      if (context?.prevRecommendations) {
        queryClient.setQueryData(['recommendations'], context.prevRecommendations)
      }
    },
    onSettled: () => {
      // Invalidate query to refetch actual data from database
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })
}
