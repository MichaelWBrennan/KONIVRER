import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

interface Props {
  currentPoints?: number;
  targetPoints?: number;
}

export const QualificationTracker: React.FC<Props> = ({ currentPoints = 0, targetPoints = 1000 }) => {
  const percent = Math.min(100, Math.round((currentPoints / targetPoints) * 100));
  return (
    <Card className="border-0 bg-light mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Qualification Progress</h6>
          <div className="small text-muted">{percent}%</div>
        </div>
        <ProgressBar now={percent} />
        <div className="small text-muted mt-2">
          {currentPoints} / {targetPoints} points
        </div>
      </Card.Body>
    </Card>
  );
};

