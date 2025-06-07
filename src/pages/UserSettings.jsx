import { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Trophy, 
  Star, 
  Bell, 
  Lock, 
  Mail, 
  MapPin, 
  Calendar,
  Save,
  Upload,
  Camera,
  Edit,
  Check,
  X,
  Award,
  Target,
  Users,
  FileText,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { analytics } from '../utils/analytics';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Profile
    displayName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    timezone: '',
    avatar: '',
    
    // Preferences
    emailNotifications: true,
    pushNotifications: true,
    tournamentReminders: true,
    matchNotifications: true,
    publicProfile: true,
    showRealName: true,
    showLocation: true,
    showStats: true,
    
    // Judge Application
    judgeLevel: 'none',
    judgeExperience: '',
    judgeReferences: '',
    judgeMotivation: '',
    
    // Tournament Organizer
    organizerStatus: 'none',
    organizerExperience: '',
    organizerVenue: '',
    organizerCapacity: '',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Mock user data
    const mockUser = {
      id: 1,
      displayName: 'Alex Chen',
      username: 'DragonMaster2024',
      email: 'alex.chen@example.com',
      bio: 'Competitive KONIVRER player with a passion for elemental synergies.',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      avatar: '/api/placeholder/100/100',
      joinDate: '2023-03-15',
      level: 42,
      
      // Roles and Status
      roles: ['player', 'judge_l1'],
      judgeLevel: 'level1',
      organizerStatus: 'approved',
      
      // Preferences
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        tournamentReminders: true,
        matchNotifications: true,
        publicProfile: true,
        showRealName: true,
        showLocation: true,
        showStats: true
      },
      
      // Statistics
      stats: {
        savedDecks: 12,
        tournamentsJudged: 8,
        tournamentsOrganized: 3,
        eventsRegistered: 23
      }
    };

    setTimeout(() => {
      setUser(mockUser);
      setFormData({
        ...formData,
        displayName: mockUser.displayName,
        username: mockUser.username,
        email: mockUser.email,
        bio: mockUser.bio,
        location: mockUser.location,
        timezone: mockUser.timezone,
        avatar: mockUser.avatar,
        judgeLevel: mockUser.judgeLevel,
        organizerStatus: mockUser.organizerStatus,
        ...mockUser.preferences
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    analytics.buttonClick('settings_tab', tab);
  };

  const handleSave = async (section) => {
    setSaving(true);
    analytics.buttonClick('settings_save', section);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would save to the backend
      console.log('Saving settings:', section, formData);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleJudgeApplication = async () => {
    analytics.buttonClick('judge_application_submit');
    
    if (!formData.judgeExperience || !formData.judgeMotivation) {
      alert('Please fill in all required fields for judge application.');
      return;
    }
    
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Judge application submitted! You will receive an email with next steps.');
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOrganizerApplication = async () => {
    analytics.buttonClick('organizer_application_submit');
    
    if (!formData.organizerExperience || !formData.organizerVenue) {
      alert('Please fill in all required fields for organizer application.');
      return;
    }
    
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Tournament organizer application submitted! You will be contacted within 3-5 business days.');
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-tertiary rounded-lg mx-auto mb-4"></div>
              <div className="h-4 bg-tertiary rounded w-32 mx-auto"></div>
            </div>
            <p className="text-muted mt-4">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
        <p className="text-secondary text-lg">
          Manage your profile, preferences, and account settings
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'preferences', label: 'Preferences', icon: Settings },
                { id: 'judge', label: 'Judge Center', icon: Shield },
                { id: 'organizer', label: 'Tournament Organizer', icon: Trophy },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent-primary text-white'
                        : 'text-secondary hover:text-primary hover:bg-tertiary'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Stats */}
          <div className="card mt-6">
            <h3 className="font-semibold mb-4">Your Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Saved Decks:</span>
                <span className="font-medium">{user.stats.savedDecks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tournaments Judged:</span>
                <span className="font-medium">{user.stats.tournamentsJudged}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Events Organized:</span>
                <span className="font-medium">{user.stats.tournamentsOrganized}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Events Registered:</span>
                <span className="font-medium">{user.stats.eventsRegistered}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-lg bg-tertiary"
                    />
                    <button className="absolute -bottom-2 -right-2 btn btn-sm btn-primary rounded-full p-2">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{formData.displayName}</h3>
                    <p className="text-secondary text-sm mb-3">@{formData.username}</p>
                    <button className="btn btn-secondary btn-sm">
                      <Upload size={14} />
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="City, State/Country"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="input resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="Europe/London">GMT</option>
                      <option value="Europe/Paris">CET</option>
                      <option value="Asia/Tokyo">JST</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSave('profile')}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Public Profile</div>
                      <div className="text-sm text-secondary">Allow others to view your profile</div>
                    </div>
                    <input
                      type="checkbox"
                      name="publicProfile"
                      checked={formData.publicProfile}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show Real Name</div>
                      <div className="text-sm text-secondary">Display your real name on your profile</div>
                    </div>
                    <input
                      type="checkbox"
                      name="showRealName"
                      checked={formData.showRealName}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show Location</div>
                      <div className="text-sm text-secondary">Display your location on your profile</div>
                    </div>
                    <input
                      type="checkbox"
                      name="showLocation"
                      checked={formData.showLocation}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show Statistics</div>
                      <div className="text-sm text-secondary">Display your game statistics publicly</div>
                    </div>
                    <input
                      type="checkbox"
                      name="showStats"
                      checked={formData.showStats}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSave('preferences')}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Judge Tab */}
          {activeTab === 'judge' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Judge Certification</h2>
                
                {user.roles.includes('judge_l1') ? (
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="text-green-400" size={20} />
                      <span className="font-semibold text-green-400">Level 1 Judge Certified</span>
                    </div>
                    <p className="text-sm text-secondary">
                      You are certified to judge local store events and FNM tournaments.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="text-yellow-400" size={20} />
                      <span className="font-semibold text-yellow-400">Apply to Become a Judge</span>
                    </div>
                    <p className="text-sm text-secondary">
                      Help organize and officiate KONIVRER tournaments in your area.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Judge Level</label>
                    <select
                      name="judgeLevel"
                      value={formData.judgeLevel}
                      onChange={handleInputChange}
                      className="input"
                      disabled={user.roles.includes('judge_l1')}
                    >
                      <option value="none">Not a Judge</option>
                      <option value="applying">Applying for Level 1</option>
                      <option value="level1">Level 1 - Store Judge</option>
                      <option value="level2">Level 2 - Regional Judge</option>
                      <option value="level3">Level 3 - Head Judge</option>
                    </select>
                  </div>

                  {!user.roles.includes('judge_l1') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Gaming Experience *</label>
                        <textarea
                          name="judgeExperience"
                          value={formData.judgeExperience}
                          onChange={handleInputChange}
                          className="input resize-none"
                          rows={3}
                          placeholder="Describe your experience with KONIVRER and other card games..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">References</label>
                        <textarea
                          name="judgeReferences"
                          value={formData.judgeReferences}
                          onChange={handleInputChange}
                          className="input resize-none"
                          rows={2}
                          placeholder="Names and contact info of current judges who can vouch for you..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Why do you want to become a judge? *</label>
                        <textarea
                          name="judgeMotivation"
                          value={formData.judgeMotivation}
                          onChange={handleInputChange}
                          className="input resize-none"
                          rows={3}
                          placeholder="Explain your motivation for becoming a certified judge..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleJudgeApplication}
                          disabled={saving}
                          className="btn btn-primary"
                        >
                          {saving ? 'Submitting...' : 'Submit Judge Application'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Organizer Tab */}
          {activeTab === 'organizer' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Tournament Organizer</h2>
                
                {user.organizerStatus === 'approved' ? (
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="text-green-400" size={20} />
                      <span className="font-semibold text-green-400">Approved Tournament Organizer</span>
                    </div>
                    <p className="text-sm text-secondary">
                      You are authorized to create and manage official KONIVRER tournaments.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="text-blue-400" size={20} />
                      <span className="font-semibold text-blue-400">Apply to Organize Tournaments</span>
                    </div>
                    <p className="text-sm text-secondary">
                      Host official KONIVRER events at your venue or online.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organizer Status</label>
                    <select
                      name="organizerStatus"
                      value={formData.organizerStatus}
                      onChange={handleInputChange}
                      className="input"
                      disabled={user.organizerStatus === 'approved'}
                    >
                      <option value="none">Not an Organizer</option>
                      <option value="applying">Application Pending</option>
                      <option value="approved">Approved Organizer</option>
                    </select>
                  </div>

                  {user.organizerStatus !== 'approved' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Event Organization Experience *</label>
                        <textarea
                          name="organizerExperience"
                          value={formData.organizerExperience}
                          onChange={handleInputChange}
                          className="input resize-none"
                          rows={3}
                          placeholder="Describe your experience organizing gaming events or tournaments..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Venue Information *</label>
                        <textarea
                          name="organizerVenue"
                          value={formData.organizerVenue}
                          onChange={handleInputChange}
                          className="input resize-none"
                          rows={2}
                          placeholder="Describe your venue (game store, community center, online platform, etc.)..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Expected Event Capacity</label>
                        <input
                          type="number"
                          name="organizerCapacity"
                          value={formData.organizerCapacity}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="Maximum number of players you can accommodate"
                          min="4"
                          max="512"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleOrganizerApplication}
                          disabled={saving}
                          className="btn btn-primary"
                        >
                          {saving ? 'Submitting...' : 'Submit Organizer Application'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <button
                    onClick={() => handleSave('security')}
                    disabled={saving || !formData.currentPassword || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
                    className="btn btn-primary"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Account Security</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-color rounded-lg">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-secondary">Add an extra layer of security to your account</div>
                    </div>
                    <button className="btn btn-secondary">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-color rounded-lg">
                    <div>
                      <div className="font-medium">Login Sessions</div>
                      <div className="text-sm text-secondary">Manage your active login sessions</div>
                    </div>
                    <button className="btn btn-secondary">
                      View Sessions
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-color rounded-lg">
                    <div>
                      <div className="font-medium">Download Data</div>
                      <div className="text-sm text-secondary">Download a copy of your account data</div>
                    </div>
                    <button className="btn btn-secondary">
                      Request Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Tournament Reminders</div>
                          <div className="text-sm text-secondary">Get reminded about upcoming tournaments</div>
                        </div>
                        <input
                          type="checkbox"
                          name="tournamentReminders"
                          checked={formData.tournamentReminders}
                          onChange={handleInputChange}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Match Notifications</div>
                          <div className="text-sm text-secondary">Get notified about match results and pairings</div>
                        </div>
                        <input
                          type="checkbox"
                          name="matchNotifications"
                          checked={formData.matchNotifications}
                          onChange={handleInputChange}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">General Updates</div>
                          <div className="text-sm text-secondary">Receive news and updates about KONIVRER</div>
                        </div>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleInputChange}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Browser Notifications</div>
                          <div className="text-sm text-secondary">Receive notifications in your browser</div>
                        </div>
                        <input
                          type="checkbox"
                          name="pushNotifications"
                          checked={formData.pushNotifications}
                          onChange={handleInputChange}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSave('notifications')}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;