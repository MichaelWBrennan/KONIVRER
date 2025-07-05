/**
 * KONIVRER Deck Database - Component Type Definitions
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { ReactNode, MouseEvent, ChangeEvent, FormEvent, CSSProperties } from 'react';
import { Card, Deck, Flag, CardFilter, DeckFilter } from './card';
import { User, Tournament, Message } from './api';
import { GameState, PlayerType, GameOptions } from './game';

/**
 * Common props for all components
 */
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  'data-testid'?: string;
}

/**
 * Card component props
 */
export interface CardComponentProps extends BaseComponentProps {
  card: Card;
  onClick?: (id: string) => void;
  onMouseEnter?: (card: Card) => void;
  onMouseLeave?: () => void;
  isSelected?: boolean;
  isRested?: boolean;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, card: Card) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * Deck component props
 */
export interface DeckComponentProps extends BaseComponentProps {
  deck: Deck;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  showStats?: boolean;
  compact?: boolean;
}

/**
 * Button component props
 */
export interface ButtonProps extends BaseComponentProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

/**
 * Input component props
 */
export interface InputProps extends BaseComponentProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  spellCheck?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Form component props
 */
export interface FormProps extends BaseComponentProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  method?: 'get' | 'post';
  action?: string;
  encType?: string;
  autoComplete?: string;
  noValidate?: boolean;
}

/**
 * Game board component props
 */
export interface GameBoardProps extends BaseComponentProps {
  onExit: () => void;
  initialState?: Partial<GameState>;
  options?: GameOptions;
}

/**
 * Profile component props
 */
export interface ProfileProps extends BaseComponentProps {
  user: User;
  isCurrentUser: boolean;
  onEdit?: () => void;
  decks?: Deck[];
  tournaments?: Tournament[];
  stats?: {
    totalGames: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    favoriteCards: { card: Card; count: number }[];
  };
}

/**
 * Tournament card component props
 */
export interface TournamentCardProps extends BaseComponentProps {
  tournament: Tournament;
  onClick?: (id: string) => void;
  onRegister?: (id: string) => void;
  isRegistered?: boolean;
  showDetails?: boolean;
}

/**
 * Search component props
 */
export interface SearchComponentProps extends BaseComponentProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  debounceTime?: number;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

/**
 * Card search component props
 */
export interface CardSearchProps extends BaseComponentProps {
  onSearch: (filter: CardFilter) => void;
  initialFilter?: Partial<CardFilter>;
  onCardSelect?: (card: Card) => void;
  showAdvanced?: boolean;
  loading?: boolean;
  results?: Card[];
}

/**
 * Deck search component props
 */
export interface DeckSearchProps extends BaseComponentProps {
  onSearch: (filter: DeckFilter) => void;
  initialFilter?: Partial<DeckFilter>;
  onDeckSelect?: (deck: Deck) => void;
  showAdvanced?: boolean;
  loading?: boolean;
  results?: Deck[];
}

/**
 * Messaging component props
 */
export interface MessagingProps extends BaseComponentProps {
  messages: Message[];
  currentUser: User;
  onSendMessage: (recipientId: string, content: string) => void;
  onMarkAsRead: (messageId: string) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Notification component props
 */
export interface NotificationProps extends BaseComponentProps {
  notifications: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
    link?: string;
  }[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  loading?: boolean;
}

/**
 * Modal component props
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

/**
 * Tabs component props
 */
export interface TabsProps extends BaseComponentProps {
  tabs: {
    id: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
  }[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Dropdown component props
 */
export interface DropdownProps extends BaseComponentProps {
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

/**
 * Toast component props
 */
export interface ToastProps extends BaseComponentProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

/**
 * Pagination component props
 */
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

/**
 * Loading spinner component props
 */
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

/**
 * Error boundary component props
 */
export interface ErrorBoundaryProps extends BaseComponentProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Card grid component props
 */
export interface CardGridProps extends BaseComponentProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  loading?: boolean;
  emptyMessage?: string;
  columns?: number;
  gap?: number;
}

/**
 * Deck builder component props
 */
export interface DeckBuilderProps extends BaseComponentProps {
  initialDeck?: Deck;
  onSave?: (deck: Deck) => void;
  cardPool?: Card[];
  loading?: boolean;
  error?: string;
}

/**
 * Tournament bracket component props
 */
export interface TournamentBracketProps extends BaseComponentProps {
  tournament: Tournament;
  onMatchClick?: (matchId: string) => void;
  highlightPlayer?: string;
  showCompleted?: boolean;
}

/**
 * Flag selector component props
 */
export interface FlagSelectorProps extends BaseComponentProps {
  flags: Flag[];
  selectedFlag?: Flag;
  onFlagSelect: (flag: Flag) => void;
  disabled?: boolean;
}

/**
 * Card preview component props
 */
export interface CardPreviewProps extends BaseComponentProps {
  card: Card;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClose?: () => void;
}

/**
 * Game log component props
 */
export interface GameLogProps extends BaseComponentProps {
  events: {
    id: string;
    message: string;
    timestamp: Date;
    player?: PlayerType;
    type?: string;
  }[];
  maxHeight?: string | number;
  autoScroll?: boolean;
}