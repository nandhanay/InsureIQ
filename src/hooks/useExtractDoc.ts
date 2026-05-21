import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsAPI } from '../services/api'

export function useExtractDoc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => documentsAPI.extractDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
