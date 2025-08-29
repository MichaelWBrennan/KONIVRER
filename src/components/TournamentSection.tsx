import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import {
  ProgressionService,
  TournamentProfileDto,
} from "../services/progressionService";

interface Props {
  userId: string;
}

export const TournamentSection: React.FC<Props> = ({ userId }) => {
  const [profile, setProfile] = React.useState<TournamentProfileDto | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    ProgressionService.getProfile(userId)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return null;
  if (!profile) return null;

  return (
    <Card className="border-0 bg-light mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Tournament Profile</h6>
          <Badge bg="primary">{profile.currentPoints} pts</Badge>
        </div>
        <div className="d-flex gap-3 small text-muted mb-2">
          <div>Regional: {profile.regionalPoints}</div>
          <div>Global: {profile.globalPoints}</div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">
            Preferences
          </Button>
          <Button variant="outline-secondary" size="sm">
            Discover Events
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
