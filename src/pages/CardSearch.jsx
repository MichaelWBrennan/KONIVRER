/**
 * KONIVRER Deck Database - Unified Card Search Page
 * Modern search interface replacing all separate search implementations
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import UnifiedCardSearch from '../components/unified/UnifiedCardSearch';
import '../styles/unified-card-search.css';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2
    }
  }
});

const CardSearch = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="card-search-page">
        <Helmet>
          <title>Card Search - KONIVRER Deck Database</title>
          <meta 
            name="description" 
            content="Search and explore KONIVRER cards with advanced filtering, sorting, and powerful search capabilities. Find the perfect cards for your deck." 
          />
          <meta name="keywords" content="KONIVRER, card search, deck building, card database, TCG, card game" />
          
          {/* Open Graph */}
          <meta property="og:title" content="Card Search - KONIVRER Deck Database" />
          <meta property="og:description" content="Search and explore KONIVRER cards with advanced filtering and powerful search capabilities." />
          <meta property="og:type" content="website" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Card Search - KONIVRER Deck Database" />
          <meta name="twitter:description" content="Search and explore KONIVRER cards with advanced filtering and powerful search capabilities." />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "KONIVRER Card Search",
              "description": "Advanced card search and database for the KONIVRER trading card game",
              "url": window.location.href,
              "applicationCategory": "Game",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })}
          </script>
        </Helmet>
        
        <div className="page-header">
          <div className="header-content">
            <h1>Card Search</h1>
            <p>
              Discover and explore the complete KONIVRER card database with powerful search 
              and filtering capabilities. Find cards by name, type, element, strength, and more.
            </p>
          </div>
        </div>
        
        <main className="search-content">
          <UnifiedCardSearch 
            showFilters={true}
            showExport={true}
            showHistory={true}
          />
        </main>
        
        <div className="search-tips">
          <h3>Search Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>🔍 Text Search</h4>
              <p>Search by card name, type, or text. Use quotes for exact phrases.</p>
            </div>
            <div className="tip-card">
              <h4>⚡ Quick Filters</h4>
              <p>Use the filter panel to narrow results by element, strength, cost, and more.</p>
            </div>
            <div className="tip-card">
              <h4>💾 Save Searches</h4>
              <p>Save your favorite search combinations for quick access later.</p>
            </div>
            <div className="tip-card">
              <h4>📊 Export Results</h4>
              <p>Export search results as JSON or CSV for external analysis.</p>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default CardSearch;