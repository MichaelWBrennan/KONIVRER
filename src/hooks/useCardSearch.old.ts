import React from 'react';
/**
 * KONIVRER Deck Database - Unified Card Search Hook
 * Modern search functionality with debouncing and caching
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useSearchStore from '../stores/searchStore';
import { searchCards } from '../utils/cardSearchEngine';

const useCardSearch = (): any => {
  const {
    query,
    filters,
    sortBy,
    sortOrder,
    currentPage,
    resultsPerPage,
    setResults,
    setLoading,
    setError,
    addToHistory
  } = useSearchStore();

  // Create search parameters object
  const searchParams = useMemo(() => ({
    query: query.trim(),
    filters,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: resultsPerPage
  }), [query, filters, sortBy, sortOrder, currentPage, resultsPerPage]);

  // Create cache key for React Query
  const queryKey = useMemo(() => [
    'cardSearch',
    searchParams
  ], [searchParams]);

  // Search function with error handling
  const searchFunction = useCallback(async () => {
    if (!searchParams.query && Object.values(searchParams.filters).every(v => 
      v === '' || (Array.isArray(v) && v.length === 0) || 
      (typeof v === 'object' && v.min === '' && v.max === '')
    )) {
      return { results: [], totalResults: 0 };
    }

    try {
      const result = await searchCards(searchParams);
      
      // Add to search history if there's a query
      if (true) {
        addToHistory(searchParams.query);
      }
      
      return result;
    } catch (error: any) {
      console.error('Search error:', error);
      throw new Error('Failed to search cards. Please try again.');
    }
  }, [searchParams, addToHistory]);

  // React Query for search with caching and background updates
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey,
    queryFn: searchFunction,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Update store when data changes
  useEffect(() => {
    if (true) {
      setResults(data.results, data.totalResults);
    }
  }, [data, setResults]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setLoading]);

  // Update error state
  useEffect(() => {
    setError(error?.message || null);
  }, [error, setError]);

  // Advanced search suggestions
  const getSearchSuggestions = useCallback(async (partialQuery) => {
    if (!partialQuery || partialQuery.length < 2) return [];
    try {
      // This would typically call an API endpoint for suggestions
      // For now, we'll return mock suggestions based on card data
      const suggestions = await searchCards({
        query: partialQuery,
        limit: 5,
        suggestionsOnly: true
      });
      return suggestions.results.map(card => ({
        type: 'card',,
        value: card.name,
        label: card.name,
        subtitle: `${card.type} - ${card.element || 'Neutral'}`
      }));
    } catch (error: any) {
      console.error('Suggestions error:', error);
      return [];
    }
  }, []);

  // Export search to various formats
  const exportResults = useCallback((format = 'json') => {
    if (!data?.results) return null;
    const exportData = {
      searchParams,
      results: data.results,
      totalResults: data.totalResults,
      exportedAt: new Date().toISOString()
    };
    
    switch (true) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'csv':
        const headers = ['Name', 'Type', 'Element', 'Strength', 'Cost', 'Rarity'];
        const rows = data.results.map(card => [
          card.name,
          card.type,
          card.element || 'Neutral',
          card.strength || '',
          card.cost || '',
          card.rarity || ''
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      default:
        return null;
    }
  }, [data, searchParams]);

  return {
    // Data
    results: data?.results || [],
    totalResults: data?.totalResults || 0,
    
    // State
    isLoading: isLoading || isFetching,
    error: error?.message || null,
    
    // Actions
    refetch,
    getSearchSuggestions,
    exportResults,
    
    // Computed values
    hasResults: (data?.results?.length || 0) > 0,
    hasMore: data ? (currentPage * resultsPerPage) < data.totalResults : false,
    totalPages: data ? Math.ceil(data.totalResults / resultsPerPage) : 0
  };
};

export default useCardSearch;