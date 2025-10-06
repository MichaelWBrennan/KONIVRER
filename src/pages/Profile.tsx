import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../components/profile/UserProfile';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setCurrentUserId(user.id);
    }
  }, [user]);

  if (!currentUserId) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return <UserProfile userId={currentUserId} />;
};