import React from 'react';
import { useSSO } from '../services/ssoService';
import { useKeycloak } from '../services/keycloakService';

// Role-based access control props
interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredAnyRole?: string[];
  requiredAllRoles?: string[];
  fallback?: React.ReactNode;
  provider?: string;
}

// Role-based access control component
const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requiredRoles = [],
  requiredAnyRole = [],
  requiredAllRoles = [],
  fallback = null,
  provider
}) => {
  const { getCurrentUser } = useSSO();
  const { hasRole, hasAnyRole, hasAllRoles } = useKeycloak();
  
  const currentUser = getCurrentUser();

  // If no user is logged in, deny access
  if (!currentUser) {
    return <>{fallback}</>;
  }

  // If provider is specified, check if user is from that provider
  if (provider && currentUser.provider !== provider) {
    return <>{fallback}</>;
  }

  // Check role requirements
  let hasAccess = true;

  // Check individual required roles (legacy support)
  if (requiredRoles.length > 0) {
    hasAccess = requiredRoles.every(role => hasRole(currentUser, role));
  }

  // Check if user has any of the specified roles
  if (requiredAnyRole.length > 0) {
    hasAccess = hasAccess && hasAnyRole(currentUser, requiredAnyRole);
  }

  // Check if user has all of the specified roles
  if (requiredAllRoles.length > 0) {
    hasAccess = hasAccess && hasAllRoles(currentUser, requiredAllRoles);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Higher-order component for role-based access
export const withRoleBasedAccess = <P extends object>(
  Component: React.ComponentType<P>,
  accessConfig: Omit<RoleBasedAccessProps, 'children'>
) => {
  return (props: P) => (
    <RoleBasedAccess {...accessConfig}>
      <Component {...props} />
    </RoleBasedAccess>
  );
};

// Hook for checking roles in components
export const useRoleAccess = () => {
  const { getCurrentUser } = useSSO();
  const { hasRole, hasAnyRole, hasAllRoles } = useKeycloak();
  
  const currentUser = getCurrentUser();

  return {
    user: currentUser,
    hasRole: (role: string) => currentUser ? hasRole(currentUser, role) : false,
    hasAnyRole: (roles: string[]) => currentUser ? hasAnyRole(currentUser, roles) : false,
    hasAllRoles: (roles: string[]) => currentUser ? hasAllRoles(currentUser, roles) : false,
    isAuthenticated: !!currentUser,
    isKeycloakUser: currentUser?.provider === 'keycloak',
    roles: currentUser?.roles || [],
    groups: currentUser?.groups || []
  };
};

// Admin panel access component
export const AdminAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Access denied. Admin privileges required.</div>
}) => (
  <RoleBasedAccess
    requiredAnyRole={['admin', 'super-admin', 'moderator']}
    fallback={fallback}
  >
    {children}
  </RoleBasedAccess>
);

// Moderator access component
export const ModeratorAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Access denied. Moderator privileges required.</div>
}) => (
  <RoleBasedAccess
    requiredAnyRole={['admin', 'super-admin', 'moderator']}
    fallback={fallback}
  >
    {children}
  </RoleBasedAccess>
);

// Premium user access component
export const PremiumAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Premium subscription required.</div>
}) => (
  <RoleBasedAccess
    requiredAnyRole={['premium', 'admin', 'super-admin']}
    fallback={fallback}
  >
    {children}
  </RoleBasedAccess>
);

// Deck builder access component
export const DeckBuilderAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Deck builder access required.</div>
}) => (
  <RoleBasedAccess
    requiredAnyRole={['deck-builder', 'premium', 'admin', 'super-admin']}
    fallback={fallback}
  >
    {children}
  </RoleBasedAccess>
);

// Tournament organizer access component
export const TournamentOrganizerAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Tournament organizer privileges required.</div>
}) => (
  <RoleBasedAccess
    requiredAnyRole={['tournament-organizer', 'admin', 'super-admin']}
    fallback={fallback}
  >
    {children}
  </RoleBasedAccess>
);

// Keycloak-only access component
export const KeycloakAccess: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = <div>Keycloak authentication required.</div>
}) => (
  <RoleBasedAccess
    provider="keycloak"
    fallback={fallback}
  >
    {children}
  </RoleBasedAccess>
);

export default RoleBasedAccess;