import {
  Shield,
  BookOpen,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Award,
  Target,
  Gavel,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Scale,
  Book,
  Calendar,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const JudgeCenter = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Check if user has judge access
  const hasJudgeAccess = () => {
    return (
      isAuthenticated && user?.roles?.includes('judge') && user?.judgeLevel >= 1
    );
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not a judge
  if (!hasJudgeAccess()) {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState('dashboard');
  const judgeLevel = user?.judgeLevel || 1;
  const [activeCalls, setActiveCalls] = useState([]);
  const [recentRulings, setRecentRulings] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedRuleSection, setSelectedRuleSection] =
    useState('comprehensive');

  // Mock data
  useEffect(() => {
    setActiveCalls([
      {
        id: 1,
        tournament: 'Friday Night KONIVRER',
        table: 5,
        player1: 'Alex Chen',
        player2: 'Sarah Wilson',
        issue: 'Card interaction dispute',
        priority: 'medium',
        time: '2 minutes ago',
        status: 'pending',
      },
      {
        id: 2,
        tournament: 'Regional Qualifier',
        table: 12,
        player1: 'Mike Johnson',
        player2: 'Emma Davis',
        issue: 'Timing window question',
        priority: 'low',
        time: '5 minutes ago',
        status: 'investigating',
      },
    ]);

    setRecentRulings([
      {
        id: 1,
        case: 'Elemental Fusion timing',
        ruling: "Player may activate in response to opponent's spell",
        judge: 'You',
        time: '1 hour ago',
        tournament: 'Friday Night KONIVRER',
      },
      {
        id: 2,
        case: 'Deck registration error',
        ruling: 'Game loss penalty applied, deck corrected',
        judge: 'Head Judge Sarah',
        time: '3 hours ago',
        tournament: 'Regional Qualifier',
      },
    ]);

    setTournaments([
      {
        id: 1,
        name: 'Friday Night KONIVRER',
        status: 'active',
        round: 3,
        totalRounds: 5,
        players: 24,
        role: 'Floor Judge',
        startTime: '7:00 PM',
      },
      {
        id: 2,
        name: 'Regional Qualifier - East Coast',
        status: 'upcoming',
        round: 0,
        totalRounds: 7,
        players: 64,
        role: 'Head Judge',
        startTime: '9:00 AM',
        date: '2024-06-20',
      },
    ]);
  }, []);

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'bg-red-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'investigating':
        return 'text-blue-400';
      case 'resolved':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Shield size={24} className="text-accent-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">Level {judgeLevel}</div>
          <div className="text-sm text-secondary">Judge Certification</div>
        </div>
        <div className="card text-center">
          <Users size={24} className="text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">{activeCalls.length}</div>
          <div className="text-sm text-secondary">Active Calls</div>
        </div>
        <div className="card text-center">
          <CheckCircle size={24} className="text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">47</div>
          <div className="text-sm text-secondary">Rulings Today</div>
        </div>
        <div className="card text-center">
          <Award size={24} className="text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-secondary">Events Judged</div>
        </div>
      </div>

      {/* Active Judge Calls */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Judge Calls</h3>
          <button className="btn btn-sm btn-primary">
            <Plus size={14} />
            New Call
          </button>
        </div>
        {activeCalls.length > 0 ? (
          <div className="space-y-3">
            {activeCalls.map(call => (
              <div
                key={call.id}
                className="p-4 bg-secondary rounded-lg border border-color"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(call.priority)}`}
                    >
                      {call.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-secondary">
                      Table {call.table}
                    </span>
                  </div>
                  <span className={`text-sm ${getStatusColor(call.status)}`}>
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </span>
                </div>
                <h4 className="font-medium mb-1">{call.issue}</h4>
                <p className="text-sm text-secondary mb-2">
                  {call.player1} vs {call.player2} • {call.tournament}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{call.time}</span>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-secondary">
                      <Eye size={14} />
                      View
                    </button>
                    <button className="btn btn-sm btn-primary">Respond</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <p className="text-secondary">No active judge calls</p>
          </div>
        )}
      </div>

      {/* Recent Rulings */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Rulings</h3>
        <div className="space-y-3">
          {recentRulings.map(ruling => (
            <div
              key={ruling.id}
              className="p-3 bg-tertiary rounded border border-color"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{ruling.case}</h4>
                <span className="text-xs text-muted">{ruling.time}</span>
              </div>
              <p className="text-sm text-secondary mb-2">{ruling.ruling}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Judge: {ruling.judge}</span>
                <span className="text-muted">{ruling.tournament}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Tournaments</h2>
        <Link to="/tournaments/create" className="btn btn-primary">
          <Plus size={16} />
          Create Tournament
        </Link>
      </div>

      <div className="grid gap-4">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{tournament.name}</h3>
                <p className="text-sm text-secondary">
                  Role: {tournament.role}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    tournament.status === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {tournament.status.charAt(0).toUpperCase() +
                    tournament.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {tournament.players}
                </div>
                <div className="text-xs text-secondary">Players</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {tournament.round}/{tournament.totalRounds}
                </div>
                <div className="text-xs text-secondary">Rounds</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {tournament.startTime}
                </div>
                <div className="text-xs text-secondary">Start Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {tournament.date || 'Today'}
                </div>
                <div className="text-xs text-secondary">Date</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/tournaments/${tournament.id}/judge`}
                className="btn btn-primary flex-1"
              >
                <Gavel size={16} />
                Judge Panel
              </Link>
              <Link
                to={`/tournaments/${tournament.id}`}
                className="btn btn-secondary"
              >
                <Eye size={16} />
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Rules data from RulesCenter
  const rulesData = {
    comprehensive: {
      title: 'Comprehensive Rules',
      version: '3.2.1',
      lastUpdated: '2025-06-01',
      description:
        'The complete and authoritative rules for KONIVRER, covering all game mechanics, interactions, and edge cases.',
      sections: [
        {
          id: '1',
          title: 'Game Concepts',
          subsections: [
            '1.1 The Golden Rules',
            '1.2 Game Zones',
            '1.3 Card Types',
            '1.4 Game Actions',
          ],
        },
        {
          id: '2',
          title: 'Turn Structure',
          subsections: [
            '2.1 Beginning Phase',
            '2.2 Action Phase',
            '2.3 End Phase',
            '2.4 Cleanup',
          ],
        },
        {
          id: '3',
          title: 'Combat System',
          subsections: [
            '3.1 Attack Declaration',
            '3.2 Defense Assignment',
            '3.3 Damage Resolution',
            '3.4 Combat Modifiers',
          ],
        },
        {
          id: '4',
          title: 'Card Abilities',
          subsections: [
            '4.1 Triggered Abilities',
            '4.2 Activated Abilities',
            '4.3 Static Abilities',
            '4.4 Replacement Effects',
          ],
        },
      ],
    },
    tournament: {
      title: 'Tournament Rules & Policy',
      version: '2.1.0',
      lastUpdated: '2025-05-15',
      description:
        'Official tournament rules, policies, and procedures for competitive KONIVRER play.',
      sections: [
        {
          id: '1',
          title: 'Tournament Structure',
          subsections: [
            '1.1 Tournament Types',
            '1.2 Round Structure',
            '1.3 Pairing Procedures',
            '1.4 Time Limits',
          ],
        },
        {
          id: '2',
          title: 'Deck Construction',
          subsections: [
            '2.1 Format Requirements',
            '2.2 Card Legality',
            '2.3 Deck Registration',
            '2.4 Sideboard Rules',
          ],
        },
        {
          id: '3',
          title: 'Player Conduct',
          subsections: [
            '3.1 Sportsmanship',
            '3.2 Communication',
            '3.3 Penalties',
            '3.4 Appeals Process',
          ],
        },
      ],
    },
    penalties: {
      title: 'Penalty Guidelines',
      version: '1.8.2',
      lastUpdated: '2025-05-20',
      description:
        'Guidelines for judges on issuing penalties and handling infractions during tournaments.',
      sections: [
        {
          id: '1',
          title: 'Infraction Categories',
          subsections: [
            '1.1 Game Rule Violations',
            '1.2 Tournament Errors',
            '1.3 Unsporting Conduct',
            '1.4 Cheating',
          ],
        },
        {
          id: '2',
          title: 'Penalty Types',
          subsections: [
            '2.1 Warning',
            '2.2 Game Loss',
            '2.3 Match Loss',
            '2.4 Disqualification',
          ],
        },
      ],
    },
    formats: {
      title: 'Gameplay Formats',
      version: 'Current',
      lastUpdated: '2025-06-10',
      description:
        'Official formats for KONIVRER play, including constructed and limited formats.',
      sections: [
        {
          id: '1',
          title: 'Constructed Formats',
          subsections: [
            '1.1 Classic Constructed',
            '1.2 Blitz',
            '1.3 Legacy',
            '1.4 Premium',
          ],
        },
        {
          id: '2',
          title: 'Limited Formats',
          subsections: [
            '2.1 Sealed Deck',
            '2.2 Booster Draft',
            '2.3 Team Draft',
            '2.4 Cube Draft',
          ],
        },
      ],
    },
  };

  const sections = [
    { id: 'comprehensive', name: 'Comprehensive Rules', icon: Book },
    { id: 'tournament', name: 'Tournament Policy', icon: Scale },
    { id: 'penalties', name: 'Penalty Guidelines', icon: AlertTriangle },
    { id: 'formats', name: 'Game Formats', icon: FileText },
  ];

  const recentUpdates = [
    {
      date: '2025-06-10',
      title: 'Format Update: Premium Constructed',
      description:
        'New Premium Constructed format added with unique deck building restrictions.',
      type: 'Format Addition',
    },
    {
      date: '2025-06-01',
      title: 'Comprehensive Rules 3.2.1',
      description: 'Clarifications on combat timing and ability interactions.',
      type: 'Rules Update',
    },
    {
      date: '2025-05-20',
      title: 'Penalty Guidelines Update',
      description: 'Revised guidelines for handling communication infractions.',
      type: 'Policy Update',
    },
  ];

  const currentSection = rulesData[selectedRuleSection];

  const renderRulesReference = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Rules & Policy Center</h2>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <Download size={16} />
            Download All PDFs
          </button>
          <button className="btn btn-secondary">
            <Search size={16} />
            Search Rules
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-color">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setSelectedRuleSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                selectedRuleSection === section.id
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              <Icon size={16} />
              {section.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Section Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {currentSection.title}
                </h3>
                <p className="text-secondary mb-4">
                  {currentSection.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>Version {currentSection.version}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Updated{' '}
                    {new Date(currentSection.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button className="btn btn-primary">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            {/* Table of Contents */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Table of Contents</h4>
              {currentSection.sections.map(section => (
                <div
                  key={section.id}
                  className="border border-color rounded-lg p-4 hover:border-accent-primary transition-colors"
                >
                  <h5 className="font-semibold mb-2">{section.title}</h5>
                  <ul className="space-y-1">
                    {section.subsections.map((subsection, index) => (
                      <li
                        key={index}
                        className="text-secondary hover:text-accent-primary cursor-pointer transition-colors text-sm"
                      >
                        {subsection}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="mt-6 pt-6 border-t border-color">
              <h4 className="font-semibold mb-4">Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Official FAQ</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Judge Resources</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Tournament Organizer Guide</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Player Education</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Updates */}
          <div className="card">
            <h4 className="font-semibold mb-4">Recent Updates</h4>
            <div className="space-y-4">
              {recentUpdates.map((update, index) => (
                <div
                  key={index}
                  className="border-l-4 border-accent-primary pl-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted">
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                    <span className="bg-accent-primary/20 text-accent-primary px-2 py-1 rounded text-xs">
                      {update.type}
                    </span>
                  </div>
                  <h5 className="font-semibold mb-1">{update.title}</h5>
                  <p className="text-secondary text-sm">{update.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Access */}
          <div className="card">
            <h4 className="font-semibold mb-4">Access</h4>
            <div className="space-y-3">
              <button className="w-full btn btn-primary text-left">
                Download All Rules (PDF)
              </button>
              <button className="w-full btn btn-secondary text-left">
                Judge Certification
              </button>
              <button className="w-full btn btn-secondary text-left">
                Tournament Organizer Kit
              </button>
              <button className="w-full btn btn-secondary text-left">
                Rules Questions Forum
              </button>
            </div>
          </div>

          {/* Judge Reference */}
          <div className="card">
            <h4 className="font-semibold mb-4">Judge Reference</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Common Penalties</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Deck Registration Error</span>
                    <span className="text-yellow-400">Game Loss</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marked Cards</span>
                    <span className="text-red-400">Disqualification</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slow Play</span>
                    <span className="text-yellow-400">Warning</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unsporting Conduct</span>
                    <span className="text-red-400">Match Loss</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium mb-2">Time Limits</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Match Time</span>
                    <span>50 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra Turns</span>
                    <span>5 turns</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deck Construction</span>
                    <span>30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Between Rounds</span>
                    <span>10 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCertification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield size={64} className="text-accent-primary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Judge Certification</h2>
        <p className="text-secondary">Current Level: {judgeLevel}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map(level => (
          <div
            key={level}
            className={`card ${judgeLevel >= level ? 'border-accent-primary bg-accent-primary/10' : ''}`}
          >
            <div className="text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  judgeLevel >= level
                    ? 'bg-accent-primary text-white'
                    : 'bg-tertiary text-muted'
                }`}
              >
                {judgeLevel >= level ? <CheckCircle size={24} /> : level}
              </div>
              <h3 className="font-semibold mb-2">Level {level} Judge</h3>
              <p className="text-sm text-secondary mb-4">
                {level === 1 && 'Local store events and casual tournaments'}
                {level === 2 && 'Regional events and competitive tournaments'}
                {level === 3 && 'National events and premier tournaments'}
              </p>
              {judgeLevel >= level ? (
                <span className="text-sm text-accent-primary font-medium">
                  Certified
                </span>
              ) : (
                <button className="btn btn-sm btn-primary">Start Exam</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Certification Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Rules Knowledge</span>
              <span>95%</span>
            </div>
            <div className="w-full bg-tertiary rounded-full h-2">
              <div
                className="bg-accent-primary h-2 rounded-full"
                style={{ width: '95%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Tournament Procedures</span>
              <span>88%</span>
            </div>
            <div className="w-full bg-tertiary rounded-full h-2">
              <div
                className="bg-accent-primary h-2 rounded-full"
                style={{ width: '88%' }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Penalty Guidelines</span>
              <span>92%</span>
            </div>
            <div className="w-full bg-tertiary rounded-full h-2">
              <div
                className="bg-accent-primary h-2 rounded-full"
                style={{ width: '92%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Target },
    { id: 'tournaments', label: 'My Tournaments', icon: Trophy },
    { id: 'rules', label: 'Rules Reference', icon: BookOpen },
    { id: 'certification', label: 'Certification', icon: Award },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Judge Center</h1>

        </div>

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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'tournaments' && renderTournaments()}
        {activeTab === 'rules' && renderRulesReference()}
        {activeTab === 'certification' && renderCertification()}
      </div>
    </div>
  );
};

export { JudgeCenter };
export default JudgeCenter;
