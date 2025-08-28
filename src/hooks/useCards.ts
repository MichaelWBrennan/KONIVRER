import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardApi, migrationApi } from "../services/api";
import { Card, CardSearchFilters } from "../stores/appStore";

export const CARD_QUERY_KEYS = {
  all: ["cards"] as const,
  lists: () => [...CARD_QUERY_KEYS.all, "list"] as const,
  list: (filters: CardSearchFilters) =>
    [...CARD_QUERY_KEYS.lists(), filters] as const,
  details: () => [...CARD_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CARD_QUERY_KEYS.details(), id] as const,
  statistics: () => [...CARD_QUERY_KEYS.all, "statistics"] as const,
};

// Get paginated cards with filters
export function useCards(filters: CardSearchFilters): any {
  return useQuery({
    queryKey: CARD_QUERY_KEYS.list(filters),
    queryFn: async () => {
      const response = await cardApi.getAll(filters);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single card by ID
export function useCard(id: string): any {
  return useQuery({
    queryKey: CARD_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await cardApi.getById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get card by name
export function useCardByName(name: string): any {
  return useQuery({
    queryKey: [...CARD_QUERY_KEYS.details(), "name", name],
    queryFn: async () => {
      const response = await cardApi.getByName(name);
      return response.data;
    },
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
  });
}

// Get card statistics
export function useCardStatistics(): any {
  return useQuery({
    queryKey: CARD_QUERY_KEYS.statistics(),
    queryFn: async () => {
      const response = await cardApi.getStatistics();
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Create card mutation
export function useCreateCard(): any {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardApi.create,
    onSuccess: () => {
      // Invalidate and refetch card lists
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.statistics(),
      });
    },
  });
}

// Update card mutation
export function useUpdateCard(): any {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Card> }) =>
      cardApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.detail(id),
      });
    },
  });
}

// Delete card mutation
export function useDeleteCard(): any {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.statistics(),
      });
    },
  });
}

// Bulk create cards mutation
export function useBulkCreateCards(): any {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardApi.bulkCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.all,
      });
    },
  });
}

// Seed KONIVRER cards mutation
export function useSeedKonivrrerCards(): any {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migrationApi.seedKonivrrerCards,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CARD_QUERY_KEYS.all,
      });
    },
  });
}
