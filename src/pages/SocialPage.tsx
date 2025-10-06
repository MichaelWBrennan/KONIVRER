import React from 'react';
import { Container } from 'react-bootstrap';
import { SocialDashboard } from '../components/social/SocialDashboard';

export const SocialPage: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <SocialDashboard userId="current_user" />
    </Container>
  );
};