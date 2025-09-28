import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardApi } from "../services/api";
import type { Card } from "../types";

export interface UseCardsOptions {
  search?: string;
  filters?: Record<string, unknown>;
  enabled?: boolean;
}

export function useCards(options: UseCardsOptions = {}) {
  const { search, filters, enabled = true } = options;
  const queryClient = useQueryClient();

  const {
    data: cardsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cards", search, filters],
    queryFn: () => cardApi.getAll({ search, ...filters }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createCardMutation = useMutation({
    mutationFn: cardApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Card> }) =>
      cardApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: cardApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: cardApi.bulkCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return {
    cards: cardsData?.data || [],
    total: cardsData?.data?.total || 0,
    isLoading,
    error: error?.message || null,
    refetch,
    createCard: createCardMutation.mutateAsync,
    updateCard: updateCardMutation.mutateAsync,
    deleteCard: deleteCardMutation.mutateAsync,
    bulkCreateCards: bulkCreateMutation.mutateAsync,
    isCreating: createCardMutation.isPending,
    isUpdating: updateCardMutation.isPending,
    isDeleting: deleteCardMutation.isPending,
    isBulkCreating: bulkCreateMutation.isPending,
  };
}

export function useCard(id: string, enabled: boolean = true) {
  const queryClient = useQueryClient();

  const {
    data: card,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["card", id],
    queryFn: () => cardApi.getById(id),
    enabled: enabled && !!id,
  });

  const updateCardMutation = useMutation({
    mutationFn: (data: Partial<Card>) => cardApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", id] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: () => cardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return {
    card: card?.data,
    isLoading,
    error: error?.message || null,
    updateCard: updateCardMutation.mutateAsync,
    deleteCard: deleteCardMutation.mutateAsync,
    isUpdating: updateCardMutation.isPending,
    isDeleting: deleteCardMutation.isPending,
  };
}

export function useCardSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const { cards, total, isLoading, error } = useCards({
    search: searchQuery,
    filters,
  });

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const updateFilters = useCallback((newFilters: Record<string, unknown>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
  }, []);

  return {
    cards,
    total,
    isLoading,
    error,
    searchQuery,
    filters,
    search,
    updateFilters,
    clearFilters,
  };
}