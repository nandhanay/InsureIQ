import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsAPI } from '../services/api'

export function useDocuments() {
  const queryClient = useQueryClient()

  // Query to list all documents
  const listQuery = useQuery({
    queryKey: ['documents'],
    queryFn: documentsAPI.listDocuments,
    staleTime: 5 * 60 * 1000,
  })

  // Mutation to upload a new document
  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentsAPI.uploadDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      queryClient.invalidateQueries({ queryKey: ['forecasts'] })
    },
  })

  // Mutation to delete a document
  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentsAPI.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      queryClient.invalidateQueries({ queryKey: ['forecasts'] })
    },
  })

  // Mutation to replace/update a document
  const replaceMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      documentsAPI.replaceDocument(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      queryClient.invalidateQueries({ queryKey: ['forecasts'] })
    },
  })

  return {
    documents: listQuery.data || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,
    uploadDocument: uploadMutation,
    deleteDocument: deleteMutation,
    replaceDocument: replaceMutation,
  }
}
