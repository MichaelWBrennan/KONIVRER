import {
  User,
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Shield,
  Target,
  BookOpen,
  Settings,
  Edit,
  Save,
  X,
  Award,
  Users,
  Gavel,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, applyForJudge, applyForOrganizer } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (user) {
      setEditForm({
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleApplyForJudge = (level) => {
    applyForJudge(level);
  };

  const handleApplyForOrganizer = (level) => {
    applyForOrganizer(level);
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="container text-center">
          <User size={64} className="text-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Please Login</h1>
          <p className="text-secondary mb-4">You need to be logged in to view your profile.</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'decks', label: 'My Decks', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'applications', label: 'Applications', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-24 h-24 rounded-full bg-tertiary"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    className="input text-xl font-bold"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{user.displayName}</h1>
                )}
                <p className="text-secondary">@{user.username}</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveProfile} className="btn btn-primary btn-sm">
                      <Save size={16} />
                      Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                      <X size={16} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                    <Edit size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {user.roles.map(role => (
                <span
                  key={role}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    role === 'judge' ? 'bg-blue-600 text-white' :
                    role === 'organizer' ? 'bg-purple-600 text-white' :
                    'bg-green-600 text-white'
                  }`}
                >
                  {role === 'judge' && user.judgeLevel > 0 && `Level ${user.judgeLevel} `}
                  {role === 'organizer' && user.organizerLevel > 0 && `Level ${user.organizerLevel} `}
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-muted" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-muted" />
                <span>{user.location || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-muted" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} className="text-muted" />
                <span>{user.achievements.filter(a => a.earned).length} Achievements</span>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="input"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="City, State/Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    className="input resize-none h-20"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            ) : (
              <p className="text-secondary">{user.bio || 'No bio provided.'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Trophy size={24} className="text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">{user.stats.tournamentsWon}</div>
          <div className="text-sm text-secondary">Tournaments Won</div>
        </div>
        <div className="card text-center">
          <Users size={24} className="text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">{user.stats.tournamentsPlayed}</div>
          <div className="text-sm text-secondary">Tournaments Played</div>
        </div>
        <div className="card text-center">
          <BookOpen size={24} className="text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">{user.stats.decksCreated}</div>
          <div className="text-sm text-secondary">Decks Created</div>
        </div>
        <div className="card text-center">
          <Gavel size={24} className="text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">{user.stats.judgeEvents}</div>
          <div className="text-sm text-secondary">Events Judged</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-secondary rounded">
            <Trophy size={16} className="text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm">Won Friday Night KONIVRER tournament</p>
              <p className="text-xs text-muted">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded">
            <BookOpen size={16} className="text-green-400" />
            <div className="flex-1">
              <p className="text-sm">Created new deck: "Elemental Storm"</p>
              <p className="text-xs text-muted">5 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded">
            <Shield size={16} className="text-blue-400" />
            <div className="flex-1">
              <p className="text-sm">Judged Regional Qualifier event</p>
              <p className="text-xs text-muted">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Registered Tournaments */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Registered Tournaments</h3>
          <div className="space-y-3">
            {user.registeredTournaments.length > 0 ? (
              user.registeredTournaments.map(tournamentId => (
                <div key={tournamentId} className="p-3 bg-secondary rounded">
                  <h4 className="font-medium">Friday Night KONIVRER</h4>
                  <p className="text-sm text-secondary">Tonight at 7:00 PM</p>
                  <div className="flex gap-2 mt-2">
                    <Link to={`/tournaments/${tournamentId}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary text-center py-4">No registered tournaments</p>
            )}
          </div>
        </div>

        {/* Organized Tournaments */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Organized Tournaments</h3>
          <div className="space-y-3">
            {user.organizedTournaments.length > 0 ? (
              user.organizedTournaments.map(tournamentId => (
                <div key={tournamentId} className="p-3 bg-secondary rounded">
                  <h4 className="font-medium">Local Championship</h4>
                  <p className="text-sm text-secondary">Next Saturday</p>
                  <div className="flex gap-2 mt-2">
                    <Link to={`/tournaments/${tournamentId}`} className="btn btn-sm btn-primary">
                      Manage
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary text-center py-4">No organized tournaments</p>
            )}
          </div>
        </div>
      </div>

      {/* Tournament History */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Tournament History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-color">
                <th className="text-left p-3">Tournament</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Format</th>
                <th className="text-left p-3">Placement</th>
                <th className="text-left p-3">Record</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-color">
                <td className="p-3">Friday Night KONIVRER</td>
                <td className="p-3">2024-06-05</td>
                <td className="p-3">Standard</td>
                <td className="p-3 text-yellow-400">1st</td>
                <td className="p-3">4-0</td>
              </tr>
              <tr className="border-b border-color">
                <td className="p-3">Regional Qualifier</td>
                <td className="p-3">2024-05-28</td>
                <td className="p-3">Standard</td>
                <td className="p-3">5th</td>
                <td className="p-3">5-2</td>
              </tr>
              <tr className="border-b border-color">
                <td className="p-3">Draft Night</td>
                <td className="p-3">2024-05-20</td>
                <td className="p-3">Draft</td>
                <td className="p-3">3rd</td>
                <td className="p-3">3-1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDecks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Decks</h3>
        <Link to="/deckbuilder" className="btn btn-primary">
          <BookOpen size={16} />
          Create New Deck
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.savedDecks.map(deckId => (
          <div key={deckId} className="card">
            <h4 className="font-semibold mb-2">Elemental Storm</h4>
            <p className="text-sm text-secondary mb-3">Standard • Fire/Water</p>
            <div className="flex items-center justify-between text-sm mb-3">
              <span>60 cards</span>
              <span className="text-green-400">Legal</span>
            </div>
            <div className="flex gap-2">
              <Link to={`/deckbuilder/${deckId}`} className="btn btn-sm btn-primary flex-1">
                Edit
              </Link>
              <button className="btn btn-sm btn-secondary">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`card ${achievement.earned ? 'border-yellow-500 bg-yellow-900/10' : 'opacity-50'}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                achievement.earned ? 'bg-yellow-500 text-black' : 'bg-tertiary text-muted'
              }`}>
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-semibold">{achievement.name}</h4>
                <p className="text-sm text-secondary">{achievement.description}</p>
              </div>
            </div>
            {achievement.earned && (
              <div className="text-xs text-yellow-400">
                ✓ Earned
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      {/* Judge Application */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Judge Certification</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map(level => (
            <div key={level} className={`p-4 rounded-lg border ${
              user.judgeLevel >= level ? 'border-blue-500 bg-blue-900/20' : 'border-color'
            }`}>
              <div className="text-center">
                <Shield size={32} className={`mx-auto mb-2 ${
                  user.judgeLevel >= level ? 'text-blue-400' : 'text-muted'
                }`} />
                <h4 className="font-semibold">Level {level} Judge</h4>
                <p className="text-sm text-secondary mb-3">
                  {level === 1 && 'Local store events'}
                  {level === 2 && 'Regional tournaments'}
                  {level === 3 && 'Premier events'}
                </p>
                {user.judgeLevel >= level ? (
                  <span className="text-sm text-blue-400 font-medium">Certified</span>
                ) : (
                  <button
                    onClick={() => handleApplyForJudge(level)}
                    className="btn btn-sm btn-primary"
                    disabled={level > user.judgeLevel + 1}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organizer Application */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Tournament Organizer</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map(level => (
            <div key={level} className={`p-4 rounded-lg border ${
              user.organizerLevel >= level ? 'border-purple-500 bg-purple-900/20' : 'border-color'
            }`}>
              <div className="text-center">
                <Target size={32} className={`mx-auto mb-2 ${
                  user.organizerLevel >= level ? 'text-purple-400' : 'text-muted'
                }`} />
                <h4 className="font-semibold">Level {level} Organizer</h4>
                <p className="text-sm text-secondary mb-3">
                  {level === 1 && 'Local events (up to 32 players)'}
                  {level === 2 && 'Regional events (up to 128 players)'}
                  {level === 3 && 'Premier events (unlimited)'}
                </p>
                {user.organizerLevel >= level ? (
                  <span className="text-sm text-purple-400 font-medium">Certified</span>
                ) : (
                  <button
                    onClick={() => handleApplyForOrganizer(level)}
                    className="btn btn-sm btn-primary"
                    disabled={level > user.organizerLevel + 1}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-secondary">Receive updates about tournaments and events</p>
            </div>
            <input
              type="checkbox"
              checked={user.preferences.emailNotifications}
              onChange={(e) => updateProfile({
                preferences: { ...user.preferences, emailNotifications: e.target.checked }
              })}
              className="w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Tournament Reminders</h4>
              <p className="text-sm text-secondary">Get reminded about upcoming tournaments</p>
            </div>
            <input
              type="checkbox"
              checked={user.preferences.tournamentReminders}
              onChange={(e) => updateProfile({
                preferences: { ...user.preferences, tournamentReminders: e.target.checked }
              })}
              className="w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Deck Sharing</h4>
              <p className="text-sm text-secondary">Default visibility for your decks</p>
            </div>
            <select
              value={user.preferences.deckSharing}
              onChange={(e) => updateProfile({
                preferences: { ...user.preferences, deckSharing: e.target.value }
              })}
              className="input w-32"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Profile Visibility</h4>
              <p className="text-sm text-secondary">Who can see your profile</p>
            </div>
            <select
              value={user.preferences.profileVisibility}
              onChange={(e) => updateProfile({
                preferences: { ...user.preferences, profileVisibility: e.target.value }
              })}
              className="input w-32"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-color">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tournaments' && renderTournaments()}
        {activeTab === 'decks' && renderDecks()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export { Profile };
export default Profile;