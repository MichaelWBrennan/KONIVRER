export interface TournamentProfileDto {
  id: string;
  userId: string;
  currentPoints: number;
  regionalPoints: number;
  globalPoints: number;
  formatSpecificPoints?: Record<string, number>;
  qualificationStatus?: Record<string, any>;
  lastPointUpdate: string;
  preferences?: Record<string, any>;
}

export const ProgressionService = {
  async getProfile(userId: string): Promise<TournamentProfileDto> {
    const res = await fetch(`/api/v1/progression/${userId}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    if (!res.ok) throw new Error("Failed to load tournament profile");
    return res.json();
  },
  async updatePreferences(userId: string, preferences: Record<string, any>) {
    const res = await fetch(`/api/v1/progression/${userId}/preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ preferences }),
    });
    if (!res.ok) throw new Error("Failed to update preferences");
    return res.json();
  },
};

