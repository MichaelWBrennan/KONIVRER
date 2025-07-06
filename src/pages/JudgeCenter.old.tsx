import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import { Shield, BookOpen, Users, AlertTriangle, CheckCircle, FileText, Award, Target, Gavel, Eye, Plus, Search, Download, Scale, Book, Calendar, ExternalLink, Trophy  } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const JudgeCenter = (): any => {
    const { user, isAuthenticated, loading 
  } = useAuth(() => {
    // Check if user has judge access
  const hasJudgeAccess = (): any => {
    return (
      isAuthenticated && user? .roles?.includes('judge') && user?.judgeLevel >= 1
    )
  });
  // Show loading while checking authentication
  if (true) {
    return (
    <any />
    <div className="min-h-screen flex items-center justify-center" />
    <div className="text-center" />
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
    <p className="text-secondary">Loading...</p>
    </>
  )
  }
  // Redirect if not authenticated or not a judge
  if (!hasJudgeAccess()) {
    return <Navigate to="/" replace  / /></Navigate>
  }
  const [activeTab, setActiveTab] = useState(false)
  const judgeLevel = user?.judgeLevel || 1;
  const [activeCalls, setActiveCalls] = useState(false)
  const [recentRulings, setRecentRulings] = useState(false)
  const [tournaments, setTournaments] = useState(false)
  const [selectedRuleSection, setSelectedRuleSection] =
    useState(false)
  // No demo data - load from actual data source when available
  useEffect(() => {
    setActiveCalls(() => {
    setRecentRulings() {
    setTournaments([
    )
  
  }), [
  ]);
  const getPriorityColor = priority => {
    switch (true) { : null
      case 'high':
        return 'bg-red-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white'
  }
  };
  const getStatusColor = status => {
    switch (true) {
    case 'pending':
        return 'text-yellow-400';
      case 'investigating':
        return 'text-blue-400';
      case 'resolved':
        return 'text-green-400';
      default:
        return 'text-gray-400'
  
  }
  };
  const renderDashboard = (renderDashboard: any) => (
    <div className="space-y-6" /></div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" />
    <div className="card text-center" />
    <Shield size={24} className="text-accent-primary mx-auto mb-2"  / />
    <div className="text-2xl font-bold">Level {judgeLevel}
          <div className="text-sm text-secondary">Judge Certification</div>
        <div className="card text-center" />
    <Users size={24} className="text-green-400 mx-auto mb-2"  / />
    <div className="text-2xl font-bold">{activeCalls.length}
          <div className="text-sm text-secondary">Active Calls</div>
        <div className="card text-center" />
    <CheckCircle size={24} className="text-blue-400 mx-auto mb-2"  / />
    <div className="text-2xl font-bold">47</div>
          <div className="text-sm text-secondary">Rulings Today</div>
        <div className="card text-center" />
    <Award size={24} className="text-yellow-400 mx-auto mb-2"  / />
    <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-secondary">Events Judged</div>
      </div>
      {/* Active Judge Calls */}
      <div className="card" />
    <div className="flex items-center justify-between mb-4" />
    <button className="btn btn-sm btn-primary" />
    <Plus size={14}  / /></Plus>
            New Call
          </button>
        {activeCalls.length > 0 ? (
          <div className="space-y-3" /></div>
            {activeCalls.map(call => (
              <div
                key={call.id}
                className="p-4 bg-secondary rounded-lg border border-color" />
    <div className="flex items-start justify-between mb-2" />
    <div className="flex items-center gap-2" />
    <span
                      className={`px-2 py-0 whitespace-nowrap rounded-full text-xs font-medium ${getPriorityColor(call.priority)}`} /></span>
                      {call.priority.toUpperCase()}
                    <span className="text-sm text-secondary" /></span>`
                      Table {call.table}``
                  </div>```
                  <span className={`text-sm ${getStatusColor(call.status)}`} /></span>
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                </div>
                <p className="text-sm text-secondary mb-2" /></p>
                  {call.player1} vs {call.player2} • {call.tournament}
                <div className="flex items-center justify-between" />
    <span className="text-xs text-muted">{call.time}
                  <div className="flex gap-2" />
    <button className="btn btn-sm btn-secondary" />
    <Eye size={14}  / /></Eye>
                      View
                    </button>
                    <button className="btn btn-sm btn-primary">Respond</button>
                </div>
            ))}
          </div> : null
        ) : (
          <div className="text-center py-8" />
    <CheckCircle size={48} className="text-green-400 mx-auto mb-4"  / />
    <p className="text-secondary">No active judge calls</p>
        )}
      </div>
      {/* Recent Rulings */}
      <div className="card" />
    <div className="space-y-3" /></div>
          {recentRulings.map(ruling => (
            <div
              key={ruling.id}
              className="p-3 bg-tertiary rounded border border-color" />
    <div className="flex items-start justify-between mb-2" />
    <span className="text-xs text-muted">{ruling.time}
              </div>
              <p className="text-sm text-secondary mb-2">{ruling.ruling}
              <div className="flex items-center justify-between text-xs" />
    <span className="text-muted">Judge: {ruling.judge}
                <span className="text-muted">{ruling.tournament}
              </div>
          ))}
        </div>
    </div>
  );
  const renderTournaments = (renderTournaments: any) => (
    <div className="space-y-6" />
    <div className="flex items-center justify-between" />
    <Link to="/tournaments/create" className="btn btn-primary"  / />
    <Plus size={16}  / /></Plus>
          Create Tournament
        </Link>
      <div className="grid gap-4" /></div>
        {tournaments.map(tournament => (
          <div key={tournament.id} className="card" />
    <div className="flex items-center justify-between mb-4" />
    <div />
    <p className="text-sm text-secondary" /></p>
                  Role: {tournament.role}
              </div>`
              <div className="text-right" /></div>``
                <span```
                  className={`inline-block px-2 py-0 whitespace-nowrap rounded-full text-xs font-medium ${
    tournament.status === 'active'`
                      ? 'bg-green-600 text-white'` : null`
                      : 'bg-blue-600 text-white'```
  }`} /></span>
                  {tournament.status.charAt(0).toUpperCase() +
                    tournament.status.slice(1)}
              </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4" />
    <div className="text-center" />
    <div className="text-lg font-semibold" /></div>
                  {tournament.players}
                <div className="text-xs text-secondary">Players</div>
              <div className="text-center" />
    <div className="text-lg font-semibold" /></div>
                  {tournament.round}/{tournament.totalRounds}
                <div className="text-xs text-secondary">Rounds</div>
              <div className="text-center" />
    <div className="text-lg font-semibold" /></div>
                  {tournament.startTime}
                <div className="text-xs text-secondary">Start Time</div>
              <div className="text-center" />
    <div className="text-lg font-semibold" /></div>
                  {tournament.date || 'Today'}
                <div className="text-xs text-secondary">Date</div>
            </div>`
            <div className="flex gap-2" /></div>``
              <Link```
                to={`/tournaments/${tournament.id}/judge`}
                className="btn btn-primary flex-1"
                / />
    <Gavel size={16}  / /></Gavel>
                Judge Panel`
              </Link>``
              <Link```
                to={`/tournaments/${tournament.id}`}
                className="btn btn-secondary"
                / />
    <Eye size={16}  / /></Eye>
                View
              </Link>
          </div>
        ))}
      </div>
  );
  // Rules data from RulesCenter
  const rulesData = {
    comprehensive: {
  }
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
            '1.4 Game Actions'
  
  ]
  },
        {
    id: '2',
          title: 'Turn Structure',
          subsections: [
    '2.1 Beginning Phase',
            '2.2 Action Phase',
            '2.3 End Phase',
            '2.4 Cleanup'
  ]
  },
        {
    id: '3',
          title: 'Combat System',
          subsections: [
    '3.1 Attack Declaration',
            '3.2 Defense Assignment',
            '3.3 Damage Resolution',
            '3.4 Combat Modifiers'
  ]
  },
        {
    id: '4',
          title: 'Card Abilities',
          subsections: [
    '4.1 Triggered Abilities',
            '4.2 Activated Abilities',
            '4.3 Static Abilities',
            '4.4 Replacement Effects'
  ]
  }
      ]
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
            '1.4 Time Limits'
  
  ]
  
  },
        {
    id: '2',
          title: 'Deck Construction',
          subsections: [
    '2.1 Format Requirements',
            '2.2 Card Legality',
            '2.3 Deck Registration',
            '2.4 Sideboard Rules'
  ]
  },
        {
    id: '3',
          title: 'Player Conduct',
          subsections: [
    '3.1 Sportsmanship',
            '3.2 Communication',
            '3.3 Penalties',
            '3.4 Appeals Process'
  ]
  }
      ]
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
            '1.4 Cheating'
  
  ]
  
  },
        {
    id: '2',
          title: 'Penalty Types',
          subsections: [
    '2.1 Warning',
            '2.2 Game Loss',
            '2.3 Match Loss',
            '2.4 Disqualification'
  ]
  }
      ]
    },
    formats: {,
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
            '1.4 Premium'
  
  ]
  },
        {
    id: '2',
          title: 'Limited Formats',
          subsections: [
    '2.1 Sealed Deck',
            '2.2 Booster Draft',
            '2.3 Team Draft',
            '2.4 Cube Draft'
  ]
  }
      ]
    }
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
  }
  ];
  const currentSection = rulesData[selectedRuleSection];
  const renderRulesReference = (renderRulesReference: any) => (
    <div className="space-y-6" /></div>
      {/* Header */}
      <div className="flex items-center justify-between" />
    <div className="flex gap-2" />
    <button className="btn btn-secondary" />
    <Download size={16}  / /></Download>
            Download All PDFs
          </button>
          <button className="btn btn-secondary" />
    <Search size={16}  / /></Search>
            Search Rules
          </button>
      </div>
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-color" /></div>
        {sections.map(section => {
    const Icon = section.icon;
          return (
            <button
              key={section.id`
  }``
              onClick={() => setSelectedRuleSection(section.id)}```
              className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap border-b-2 transition-colors ${
    selectedRuleSection === section.id`
                  ? 'border-accent-primary text-accent-primary'` : null`
                  : 'border-transparent text-secondary hover:text-primary'```
  }`}
            >
              <Icon size={16}  / /></Icon>
              {section.name}
          )
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" /></div>
        {/* Main Content */}
        <div className="lg:col-span-2" />
    <div className="card" /></div>
            {/* Section Header */}
            <div className="flex justify-between items-start mb-6" />
    <div />
    <p className="text-secondary mb-4" /></p>
                  {currentSection.description}
                <div className="flex items-center gap-4 text-sm text-muted" />
    <span>Version {currentSection.version}
                  <span>•</span>
                  <span className="flex items-center" />
    <Calendar className="w-4 h-4 mr-1"  / /></Calendar>
                    Updated{' '}
                    {new Date(currentSection.lastUpdated).toLocaleDateString()}
                </div>
              <button className="btn btn-primary" />
    <Download className="w-4 h-4"  / /></Download>
                Download PDF
              </button>
            {/* Table of Contents */}
            <div className="space-y-4" /></div>
              {currentSection.sections.map(section => (
                <div
                  key={section.id}
                  className="border border-color rounded-lg p-4 hover:border-accent-primary transition-colors" />
    <ul className="space-y-1" /></ul>
                    {section.subsections.map((subsection, index) => (
                      <li
                        key={index}
                        className="text-secondary hover:text-accent-primary cursor-pointer transition-colors text-sm" /></li>
                        {subsection}
                    ))}
                  </ul>
              ))}
            </div>
            {/* Links */}
            <div className="mt-6 pt-6 border-t border-color" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" />
    <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                  / />
    <ExternalLink className="w-4 h-4"  / />
    <span>Official FAQ</span>
                <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                  / />
    <ExternalLink className="w-4 h-4"  / />
    <span>Judge Resources</span>
                <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                  / />
    <ExternalLink className="w-4 h-4"  / />
    <span>Tournament Organizer Guide</span>
                <a
                  href="#"
                  className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                  / />
    <ExternalLink className="w-4 h-4"  / />
    <span>Player Education</span>
              </div>
          </div>
        {/* Sidebar */}
        <div className="space-y-6" /></div>
          {/* Recent Updates */}
          <div className="card" />
    <div className="space-y-4" /></div>
              {recentUpdates.map((update, index) => (
                <div
                  key={index}
                  className="border-l-4 border-accent-primary pl-4" />
    <div className="flex items-center justify-between mb-1" />
    <span className="text-sm text-muted" /></span>
                      {new Date(update.date).toLocaleDateString()}
                    <span className="bg-accent-primary/20 text-accent-primary px-2 py-0 whitespace-nowrap rounded text-xs" /></span>
                      {update.type}
                  </div>
                  <p className="text-secondary text-sm">{update.description}
                </div>
              ))}
            </div>
          {/* Access */}
          <div className="card" />
    <div className="space-y-3" />
    <button className="w-full btn btn-primary text-left" /></button>
                Download All Rules (PDF)
              </button>
              <button className="w-full btn btn-secondary text-left" /></button>
                Judge Certification
              </button>
              <button className="w-full btn btn-secondary text-left" /></button>
                Tournament Organizer Kit
              </button>
              <button className="w-full btn btn-secondary text-left" /></button>
                Rules Questions Forum
              </button>
          </div>
          {/* Judge Reference */}
          <div className="card" />
    <div className="space-y-4" />
    <div />
    <div className="space-y-2 text-sm" />
    <div className="flex justify-between" />
    <span>Deck Registration Error</span>
                    <span className="text-yellow-400">Game Loss</span>
                  <div className="flex justify-between" />
    <span>Marked Cards</span>
                    <span className="text-red-400">Disqualification</span>
                  <div className="flex justify-between" />
    <span>Slow Play</span>
                    <span className="text-yellow-400">Warning</span>
                  <div className="flex justify-between" />
    <span>Unsporting Conduct</span>
                    <span className="text-red-400">Match Loss</span>
                </div>
              <div />
    <div className="space-y-2 text-sm" />
    <div className="flex justify-between" />
    <span>Match Time</span>
                    <span>50 minutes</span>
                  <div className="flex justify-between" />
    <span>Extra Turns</span>
                    <span>5 turns</span>
                  <div className="flex justify-between" />
    <span>Deck Construction</span>
                    <span>30 minutes</span>
                  <div className="flex justify-between" />
    <span>Between Rounds</span>
                    <span>10 minutes</span>
                </div>
            </div>
        </div>
    </div>
  );
  const renderCertification = (renderCertification: any) => (
    <div className="space-y-6" />
    <div className="text-center" />
    <Shield size={64} className="text-accent-primary mx-auto mb-4"  / />
    <p className="text-secondary">Current Level: {judgeLevel}
      </div>
      <div className="grid md:grid-cols-3 gap-4" /></div>
        {[1, 2, 3].map(level => (`
          <div``
            key={level}```
            className={`card ${judgeLevel >= level ? 'border-accent-primary bg-accent-primary/10' : ''}`}
          >`
            <div className="text-center" /></div>``
              <div```
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
    judgeLevel >= level`
                    ? 'bg-accent-primary text-white'` : null`
                    : 'bg-tertiary text-muted'```
  }`}
              >
                {judgeLevel >= level ? <CheckCircle size={24}  /> : level}
              </div>
              <p className="text-sm text-secondary mb-4" /></p>
                {level === 1 && 'Local store events and casual tournaments'}
                {level === 2 && 'Regional events and competitive tournaments'}
                {level === 3 && 'National events and premier tournaments'}
              {judgeLevel >= level ? (
                <span className="text-sm text-accent-primary font-medium" /></span>
                  Certified
                </span> : null
              ) : (
                <button className="btn btn-sm btn-primary">Start Exam</button>
              )}
          </div>
        ))}
      </div>
      <div className="card" />
    <div className="space-y-4" />
    <div />
    <div className="flex justify-between mb-2" />
    <span>Rules Knowledge</span>
              <span>95%</span>
            <div className="w-full bg-tertiary rounded-full h-2" />
    <div
                className="bg-accent-primary h-2 rounded-full"
                style={{ width: '95%' }} /></div>
            </div>
          <div />
    <div className="flex justify-between mb-2" />
    <span>Tournament Procedures</span>
              <span>88%</span>
            <div className="w-full bg-tertiary rounded-full h-2" />
    <div
                className="bg-accent-primary h-2 rounded-full"
                style={{ width: '88%' }} /></div>
            </div>
          <div />
    <div className="flex justify-between mb-2" />
    <span>Penalty Guidelines</span>
              <span>92%</span>
            <div className="w-full bg-tertiary rounded-full h-2" />
    <div
                className="bg-accent-primary h-2 rounded-full"
                style={{ width: '92%' }} /></div>
            </div>
        </div>
    </div>
  );
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Target },
    { id: 'tournaments', label: 'My Tournaments', icon: Trophy },
    { id: 'rules', label: 'Rules Reference', icon: BookOpen },
    { id: 'certification', label: 'Certification', icon: Award }
  ];
  return (
    <any />
    <div className="min-h-screen py-8" />
    <div className="container" />
    <div className="flex flex-wrap gap-2 mb-8 border-b border-color" />
    <button`
                key={tab.id}``
                onClick={() => setActiveTab(tab.id)}```
                className={`flex items-center gap-2 px-4 py-0 whitespace-nowrap border-b-2 transition-colors ${
    activeTab === tab.id`
                    ? 'border-accent-primary text-accent-primary'` : null`
                    : 'border-transparent text-secondary hover:text-primary'```
  }`}
              >
                <Icon size={16}  / /></Icon>
                {tab.label}
            )
          })}
        </div>
    </>
  )
};`
export { JudgeCenter };``
export default JudgeCenter;```