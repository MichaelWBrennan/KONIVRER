import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Settings,
  Info,
  Plus,
  Minus,
  Save,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TournamentCreate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    type: 'standard',
    format: 'standard',
    
    // Schedule
    date: '',
    time: '',
    registrationDeadline: '',
    
    // Location
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    isOnline: false,
    
    // Participants
    maxParticipants: 32,
    minParticipants: 8,
    registrationOpen: true,
    
    // Prizes and Fees
    entryFee: 0,
    prizePool: 0,
    prizeDistribution: 'standard',
    
    // Tournament Structure
    rounds: 'swiss',
    roundsCount: 0, // Auto-calculated
    topCut: 8,
    timeLimit: 50,
    
    // Judge Information
    headJudge: '',
    judgeLevel: 1,
    additionalJudges: [],
    
    // Advanced Settings
    decklistRequired: true,
    lateRegistration: false,
    spectators: true,
    streaming: false,
    
    // Rules and Policies
    specialRules: '',
    penaltyPolicy: 'standard',
    appealProcess: 'standard',
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateRounds = (participants) => {
    if (participants <= 8) return 3;
    if (participants <= 16) return 4;
    if (participants <= 32) return 5;
    if (participants <= 64) return 6;
    if (participants <= 128) return 7;
    return 8;
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Tournament Name *</label>
        <input
          type="text"
          className="input"
          placeholder="Enter tournament name"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="input resize-none h-24"
          placeholder="Describe your tournament..."
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tournament Type *</label>
          <select
            className="input"
            value={formData.type}
            onChange={(e) => updateFormData('type', e.target.value)}
          >
            <option value="standard">Standard Tournament</option>
            <option value="qualifier">Qualifier Event</option>
            <option value="championship">Championship</option>
            <option value="casual">Casual Event</option>
            <option value="draft">Draft Tournament</option>
            <option value="sealed">Sealed Event</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Format *</label>
          <select
            className="input"
            value={formData.format}
            onChange={(e) => updateFormData('format', e.target.value)}
          >
            <option value="standard">Standard</option>
            <option value="extended">Extended</option>
            <option value="draft">Draft</option>
            <option value="sealed">Sealed</option>
            <option value="legacy">Legacy</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderScheduleLocation = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date *</label>
          <input
            type="date"
            className="input"
            value={formData.date}
            onChange={(e) => updateFormData('date', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Start Time *</label>
          <input
            type="time"
            className="input"
            value={formData.time}
            onChange={(e) => updateFormData('time', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Registration Deadline</label>
        <input
          type="datetime-local"
          className="input"
          value={formData.registrationDeadline}
          onChange={(e) => updateFormData('registrationDeadline', e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          id="isOnline"
          checked={formData.isOnline}
          onChange={(e) => updateFormData('isOnline', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="isOnline" className="text-sm font-medium">Online Tournament</label>
      </div>

      {!formData.isOnline && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Venue Name *</label>
            <input
              type="text"
              className="input"
              placeholder="Tournament venue"
              value={formData.venue}
              onChange={(e) => updateFormData('venue', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <input
              type="text"
              className="input"
              placeholder="Street address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                className="input"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">State/Province</label>
              <input
                type="text"
                className="input"
                value={formData.state}
                onChange={(e) => updateFormData('state', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country *</label>
              <input
                type="text"
                className="input"
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderParticipantsStructure = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Maximum Participants *</label>
          <input
            type="number"
            className="input"
            min="4"
            max="512"
            value={formData.maxParticipants}
            onChange={(e) => updateFormData('maxParticipants', parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Minimum Participants</label>
          <input
            type="number"
            className="input"
            min="4"
            value={formData.minParticipants}
            onChange={(e) => updateFormData('minParticipants', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Entry Fee ($)</label>
          <input
            type="number"
            className="input"
            min="0"
            step="0.01"
            value={formData.entryFee}
            onChange={(e) => updateFormData('entryFee', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prize Pool ($)</label>
          <input
            type="number"
            className="input"
            min="0"
            step="0.01"
            value={formData.prizePool}
            onChange={(e) => updateFormData('prizePool', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tournament Structure</label>
        <select
          className="input"
          value={formData.rounds}
          onChange={(e) => updateFormData('rounds', e.target.value)}
        >
          <option value="swiss">Swiss Rounds</option>
          <option value="single-elimination">Single Elimination</option>
          <option value="double-elimination">Double Elimination</option>
          <option value="round-robin">Round Robin</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Top Cut Size</label>
          <select
            className="input"
            value={formData.topCut}
            onChange={(e) => updateFormData('topCut', parseInt(e.target.value))}
          >
            <option value={4}>Top 4</option>
            <option value={8}>Top 8</option>
            <option value={16}>Top 16</option>
            <option value={32}>Top 32</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
          <input
            type="number"
            className="input"
            min="30"
            max="90"
            value={formData.timeLimit}
            onChange={(e) => updateFormData('timeLimit', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="p-4 bg-secondary rounded-lg">
        <h4 className="font-medium mb-2">Estimated Tournament Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted">Swiss Rounds: </span>
            <span>{calculateRounds(formData.maxParticipants)}</span>
          </div>
          <div>
            <span className="text-muted">Estimated Duration: </span>
            <span>{Math.ceil((calculateRounds(formData.maxParticipants) * (formData.timeLimit + 10)) / 60)} hours</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJudgeSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Head Judge *</label>
        <input
          type="text"
          className="input"
          placeholder="Head judge name"
          value={formData.headJudge}
          onChange={(e) => updateFormData('headJudge', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Required Judge Level</label>
        <select
          className="input"
          value={formData.judgeLevel}
          onChange={(e) => updateFormData('judgeLevel', parseInt(e.target.value))}
        >
          <option value={1}>Level 1 (Local Events)</option>
          <option value={2}>Level 2 (Regional Events)</option>
          <option value={3}>Level 3 (Premier Events)</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="decklistRequired"
            checked={formData.decklistRequired}
            onChange={(e) => updateFormData('decklistRequired', e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="decklistRequired" className="text-sm font-medium">Decklist Required</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="lateRegistration"
            checked={formData.lateRegistration}
            onChange={(e) => updateFormData('lateRegistration', e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="lateRegistration" className="text-sm font-medium">Allow Late Registration</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="spectators"
            checked={formData.spectators}
            onChange={(e) => updateFormData('spectators', e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="spectators" className="text-sm font-medium">Allow Spectators</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="streaming"
            checked={formData.streaming}
            onChange={(e) => updateFormData('streaming', e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="streaming" className="text-sm font-medium">Live Streaming</label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Special Rules</label>
        <textarea
          className="input resize-none h-24"
          placeholder="Any special rules or modifications for this tournament..."
          value={formData.specialRules}
          onChange={(e) => updateFormData('specialRules', e.target.value)}
        />
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Tournament Summary</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted">Name:</span>
              <p className="font-medium">{formData.name || 'Untitled Tournament'}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Type:</span>
              <p className="font-medium capitalize">{formData.type}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Format:</span>
              <p className="font-medium capitalize">{formData.format}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Date & Time:</span>
              <p className="font-medium">{formData.date} at {formData.time}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted">Location:</span>
              <p className="font-medium">
                {formData.isOnline ? 'Online' : `${formData.venue}, ${formData.city}`}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted">Participants:</span>
              <p className="font-medium">{formData.minParticipants} - {formData.maxParticipants} players</p>
            </div>
            <div>
              <span className="text-sm text-muted">Entry Fee:</span>
              <p className="font-medium">${formData.entryFee}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Prize Pool:</span>
              <p className="font-medium">${formData.prizePool}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Tournament Structure</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted">Format:</span>
              <p className="font-medium capitalize">{formData.rounds}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Swiss Rounds:</span>
              <p className="font-medium">{calculateRounds(formData.maxParticipants)}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted">Top Cut:</span>
              <p className="font-medium">Top {formData.topCut}</p>
            </div>
            <div>
              <span className="text-sm text-muted">Time Limit:</span>
              <p className="font-medium">{formData.timeLimit} minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Judge Information</h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted">Head Judge:</span>
            <p className="font-medium">{formData.headJudge || 'Not specified'}</p>
          </div>
          <div>
            <span className="text-sm text-muted">Required Level:</span>
            <p className="font-medium">Level {formData.judgeLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    { id: 1, title: 'Basic Information', icon: Info },
    { id: 2, title: 'Schedule & Location', icon: Calendar },
    { id: 3, title: 'Participants & Structure', icon: Users },
    { id: 4, title: 'Judge & Settings', icon: Settings },
    { id: 5, title: 'Review & Create', icon: Eye },
  ];

  const handleSubmit = () => {
    // Here you would submit the tournament data
    console.log('Creating tournament:', formData);
    navigate('/tournaments');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Tournament</h1>
          <p className="text-secondary">Set up a new KONIVRER tournament</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isActive = step === stepItem.id;
            const isCompleted = step > stepItem.id;
            
            return (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-accent-primary text-white' : 
                  isCompleted ? 'bg-green-600 text-white' : 'bg-tertiary text-muted'
                }`}>
                  <Icon size={16} />
                  <span className="text-sm font-medium hidden sm:block">{stepItem.title}</span>
                  <span className="text-sm font-medium sm:hidden">{stepItem.id}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-tertiary'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="card mb-8">
          {step === 1 && renderBasicInfo()}
          {step === 2 && renderScheduleLocation()}
          {step === 3 && renderParticipantsStructure()}
          {step === 4 && renderJudgeSettings()}
          {step === 5 && renderReview()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/tournaments')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            
            {step < 5 ? (
              <button
                onClick={() => setStep(Math.min(5, step + 1))}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                <Save size={16} />
                Create Tournament
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TournamentCreate };
export default TournamentCreate;