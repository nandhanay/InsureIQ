import { useQuery } from '@tanstack/react-query'
import { watchlistAPI } from '../services/api'
import { useWatchlistStore } from '../stores/watchlistStore'
import { useEffect } from 'react'

export function useWatchlist() {
  const setWatchlistIds = useWatchlistStore((state) => state.setWatchlistIds)

  const query = useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistAPI.getWatchlist,
  })

  useEffect(() => {
    if (query.data && query.data.plans) {
      const ids = query.data.plans.map((p: any) => p.id)
      setWatchlistIds(ids)
    }
  }, [query.data, setWatchlistIds])

  return query
}
