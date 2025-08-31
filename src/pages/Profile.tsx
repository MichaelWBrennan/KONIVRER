import React, { useEffect, useState } from "react";
import * as s from "./settings.css.ts";
import { useAuth } from "../hooks/useAuth";
import { TournamentSection } from "../components/TournamentSection";
import { QualificationTracker } from "../components/QualificationTracker";
import {
  ProgressionService,
  TournamentProfileDto,
} from "../services/progressionService";

export const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<TournamentProfileDto | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      ProgressionService.getProfile(user.id)
        .then(setProfile)
        .catch(() => setProfile(null));
    }
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className={s.root}>
        <section className={s.section}>
          <div className={s.sectionTitle}>Profile</div>
          <p>Please log in to view your profile.</p>
        </section>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <section className={s.section}>
        <div className={s.sectionTitle}>Profile</div>
        <div className="small text-muted">
          {user?.displayName || user?.username}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionTitle}>Tournament Points</div>
        <TournamentSection userId={user?.id || ""} />
        <QualificationTracker currentPoints={profile?.currentPoints || 0} />
      </section>
    </div>
  );
};
