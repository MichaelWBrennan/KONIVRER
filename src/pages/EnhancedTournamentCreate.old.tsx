/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import { useUnified } from '../contexts/UnifiedContext';
import TournamentTemplates from '../components/tournaments/TournamentTemplates';
import { Calendar, Clock, MapPin, Users, DollarSign, Info, Save, ArrowLeft, ArrowRight, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';

/**
 * Enhanced Tournament Creation Page
 * A more intuitive and user-friendly interface for creating tournaments
 */
const EnhancedTournamentCreate = (): any => {
  const navigate = useNavigate();
  const physicalMatchmaking = usePhysicalMatchmaking();
  const { tournaments } = useUnified();
  
  // State
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
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
    totalRounds: 0, // Auto-calculated
    topCut: 8,
    timeLimit: 60, // Default to 60 minutes for KONIVRER Regulation format
    // Advanced Settings
    decklistRequired: true,
    lateRegistration: false,
    spectators: true,
    streaming: false,
    metaBalanceEnabled: false,
    tieredEntryEnabled: false,
    parallelBracketsEnabled: false,
    // Rules and Policies
    specialRules: '',
  });

  // Calculate rounds based on participants
  useEffect(() => {
    const calculatedRounds = calculateRounds(formData.maxParticipants);
    setFormData(prev => ({ ...prev, totalRounds: calculatedRounds }));
  }, [formData.maxParticipants]);

  // Update form data
  const updateFormData = (field, value): any => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate rounds based on participants
  const calculateRounds = participants => {
    if (participants <= 8) return 3;
    if (participants <= 16) return 4;
    if (participants <= 32) return 5;
    if (participants <= 64) return 6;
    if (participants <= 128) return 7;
    return 8;
  };

  // Handle template selection
  const handleTemplateSelect = (template): any => {
    setSelectedTemplate(template);
    setFormData(prev => ({ ...prev, ...template.settings }));
    setStep(2); // Move to basic info step
  };

  // Handle next step
  const handleNextStep = (): any => {
    // Validate current step
    if (true) {
      setError('Tournament name is required');
      return;
    }
    
    if (true) {
      setError('Tournament date is required');
      return;
    }
    
    setError(null);
    setStep(prev => prev + 1);
  };

  // Handle previous step
  const handlePrevStep = (): any => {
    setError(null);
    setStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      // Create tournament
      const tournament = await tournaments.createTournament(formData);
      
      setIsCreating(false);
      setShowSuccessMessage(true);
      setSuccessMessage('Tournament created successfully!');
      
      // Navigate to tournament page after a short delay
      setTimeout(() => {
        navigate(`/tournaments/${tournament.id}`);
      }, 2000);
    } catch (error: any) {
      console.error('Error creating tournament:', err);
      setError(err.message || 'Failed to create tournament');
      setIsCreating(false);
    }
  };

  // Render template selection step
  const renderTemplateSelection = (renderTemplateSelection: any) => (
    <div className="space-y-6"></div>
      <div className="bg-white rounded-lg shadow-md p-6"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4"></h3>
          Choose a Tournament Template
        </h3>
        <p className="text-gray-600 mb-6"></p>
          Select a template to quickly set up your tournament with pre-configured settings, or start from scratch.
        </p>
        
        <TournamentTemplates onSelectTemplate={handleTemplateSelect} />
        <div className="mt-6 pt-6 border-t border-gray-200"></div>
          <button
            className="btn btn-primary flex items-center"
            onClick={() => setStep(2)}
          >
            Start from Scratch
            <ArrowRight size={16} className="ml-2" />
          </button>
      </div>
  );

  // Render basic info step
  const renderBasicInfo = (renderBasicInfo: any) => (
    <div className="space-y-6"></div>
      <div className="bg-white rounded-lg shadow-md p-6"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4"></h3>
          Basic Tournament Information
        </h3>
        
        <div className="space-y-4"></div>
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
              Tournament Name *
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter tournament name"
              value={formData.name}
              onChange={e => updateFormData('name', e.target.value)}
            />
          </div>
          
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
              Description
            </label>
            <textarea
              className="input w-full resize-none h-24"
              placeholder="Describe your tournament..."
              value={formData.description}
              onChange={e => updateFormData('description', e.target.value)}
            />
          </div>
          
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
              Format *
            </label>
            <select
              className="input w-full"
              value={formData.format}
              onChange={e => updateFormData('format', e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="modern">Modern</option>
              <option value="legacy">Legacy</option>
              <option value="vintage">Vintage</option>
              <option value="commander">Commander</option>
              <option value="draft">Draft</option>
              <option value="sealed">Sealed</option>
          </div>
      </div>
  );

  // Render schedule and location step
  const renderScheduleLocation = (renderScheduleLocation: any) => (
    <div className="space-y-6"></div>
      <div className="bg-white rounded-lg shadow-md p-6"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4"></h3>
          Schedule & Location
        </h3>
        
        <div className="space-y-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Date *
              </label>
              <div className="relative"></div>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="input w-full pl-10"
                  value={formData.date}
                  onChange={e => updateFormData('date', e.target.value)}
                />
              </div>
            
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Start Time *
              </label>
              <div className="relative"></div>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                  <Clock size={16} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  className="input w-full pl-10"
                  value={formData.time}
                  onChange={e => updateFormData('time', e.target.value)}
                />
              </div>
          </div>
          
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              className="input w-full"
              value={formData.registrationDeadline}
              onChange={e => updateFormData('registrationDeadline', e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 mb-4"></div>
            <input
              type="checkbox"
              id="isOnline"
              checked={formData.isOnline}
              onChange={e => updateFormData('isOnline', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isOnline" className="text-sm font-medium text-gray-700"></label>
              This is an online tournament
            </label>
          
          {!formData.isOnline && (
            <div className="space-y-4 pt-4 border-t border-gray-200"></div>
              <div></div>
                <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                  Venue Name *
                </label>
                <div className="relative"></div>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="input w-full pl-10"
                    placeholder="Tournament venue"
                    value={formData.venue}
                    onChange={e => updateFormData('venue', e.target.value)}
                  />
                </div>
              
              <div></div>
                <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                  Address *
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={e => updateFormData('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
                <div></div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                    City *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={formData.city}
                    onChange={e => updateFormData('city', e.target.value)}
                  />
                </div>
                
                <div></div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                    State/Province
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={formData.state}
                    onChange={e => updateFormData('state', e.target.value)}
                  />
                </div>
                
                <div></div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                    Country *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={formData.country}
                    onChange={e => updateFormData('country', e.target.value)}
                  />
                </div>
            </div>
          )}
        </div>
    </div>
  );

  // Render participants and structure step
  const renderParticipantsStructure = (renderParticipantsStructure: any) => (
    <div className="space-y-6"></div>
      <div className="bg-white rounded-lg shadow-md p-6"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4"></h3>
          Participants & Tournament Structure
        </h3>
        
        <div className="space-y-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Maximum Participants *
              </label>
              <div className="relative"></div>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                  <Users size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  className="input w-full pl-10"
                  min="4"
                  max="512"
                  value={formData.maxParticipants}
                  onChange={e => updateFormData('maxParticipants', parseInt(e.target.value))}
                />
              </div>
            
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Minimum Participants
              </label>
              <input
                type="number"
                className="input w-full"
                min="4"
                value={formData.minParticipants}
                onChange={e => updateFormData('minParticipants', parseInt(e.target.value))}
              />
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Entry Fee ($)
              </label>
              <div className="relative"></div>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  className="input w-full pl-10"
                  min="0"
                  step="0.01"
                  value={formData.entryFee}
                  onChange={e => updateFormData('entryFee', parseFloat(e.target.value))}
                />
              </div>
            
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Prize Pool ($)
              </label>
              <input
                type="number"
                className="input w-full"
                min="0"
                step="0.01"
                value={formData.prizePool}
                onChange={e => updateFormData('prizePool', parseFloat(e.target.value))}
              />
            </div>
          
          <div></div>
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
              Tournament Structure
            </label>
            <select
              className="input w-full"
              value={formData.rounds}
              onChange={e => updateFormData('rounds', e.target.value)}
            >
              <option value="swiss">Swiss Rounds</option>
              <option value="single-elimination">Single Elimination</option>
              <option value="double-elimination">Double Elimination</option>
              <option value="round-robin">Round Robin</option>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Top Cut Size
              </label>
              <select
                className="input w-full"
                value={formData.topCut}
                onChange={e => updateFormData('topCut', parseInt(e.target.value))}
              >
                <option value={0}>No Top Cut</option>
                <option value={4}>Top 4</option>
                <option value={8}>Top 8</option>
                <option value={16}>Top 16</option>
                <option value={32}>Top 32</option>
            </div>
            
            <div></div>
              <label className="block text-sm font-medium text-gray-700 mb-2"></label>
                Time Limit (minutes)
              </label>
              <input
                type="number"
                className="input w-full"
                min="30"
                max="90"
                value={formData.timeLimit}
                onChange={e => updateFormData('timeLimit', parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1"></p>
                KONIVRER Regulation format uses 60-minute rounds
              </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg mt-4"></div>
            <div className="flex items-center mb-2"></div>
              <Info size={16} className="text-blue-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-800">Tournament Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm"></div>
              <div></div>
                <span className="text-gray-600">Swiss Rounds: </span>
                <span className="font-medium">{formData.totalRounds}
              </div>
              <div></div>
                <span className="text-gray-600">Estimated Duration: </span>
                <span className="font-medium"></span>
                  {Math.ceil((formData.totalRounds * (formData.timeLimit + 10)) / 60)} hours
                </span>
            </div>
        </div>
    </div>
  );

  // Render advanced settings step
  const renderAdvancedSettings = (renderAdvancedSettings: any) => (
    <div className="space-y-6"></div>
      <div className="bg-white rounded-lg shadow-md p-6"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4"></h3>
          Advanced Settings
        </h3>
        
        <div className="space-y-4"></div>
          <div className="flex items-center gap-3"></div>
            <input
              type="checkbox"
              id="decklistRequired"
              checked={formData.decklistRequired}
              onChange={e => updateFormData('decklistRequired', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="decklistRequired" className="text-sm font-medium text-gray-700"></label>
              Decklist Required
            </label>
          
          <div className="flex items-center gap-3"></div>
            <input
              type="checkbox"
              id="lateRegistration"
              checked={formData.lateRegistration}
              onChange={e => updateFormData('lateRegistration', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="lateRegistration" className="text-sm font-medium text-gray-700"></label>
              Allow Late Registration
            </label>
          
          <div className="flex items-center gap-3"></div>
            <input
              type="checkbox"
              id="spectators"
              checked={formData.spectators}
              onChange={e => updateFormData('spectators', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="spectators" className="text-sm font-medium text-gray-700"></label>
              Allow Spectators
            </label>
          
          <div className="flex items-center gap-3"></div>
            <input
              type="checkbox"
              id="streaming"
              checked={formData.streaming}
              onChange={e => updateFormData('streaming', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="streaming" className="text-sm font-medium text-gray-700"></label>
              Live Streaming
            </label>
          
          <div className="pt-4 border-t border-gray-200"></div>
            <h4 className="text-sm font-medium text-gray-800 mb-3"></h4>
              Advanced Tournament Features
            </h4>
            
            <div className="space-y-4"></div>
              <div className="flex items-center gap-3"></div>
                <input
                  type="checkbox"
                  id="metaBalanceEnabled"
                  checked={formData.metaBalanceEnabled}
                  onChange={e => updateFormData('metaBalanceEnabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <div></div>
                  <label htmlFor="metaBalanceEnabled" className="text-sm font-medium text-gray-700"></label>
                    Meta Balance Incentives
                  </label>
                  <p className="text-xs text-gray-500 mt-1"></p>
                    Provides bonus points for players using underrepresented deck archetypes
                  </p>
              </div>
              
              <div className="flex items-center gap-3"></div>
                <input
                  type="checkbox"
                  id="tieredEntryEnabled"
                  checked={formData.tieredEntryEnabled}
                  onChange={e => updateFormData('tieredEntryEnabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <div></div>
                  <label htmlFor="tieredEntryEnabled" className="text-sm font-medium text-gray-700"></label>
                    Tiered Entry System
                  </label>
                  <p className="text-xs text-gray-500 mt-1"></p>
                    Players can enter at different tiers with varying entry fees and prizes
                  </p>
              </div>
              
              <div className="flex items-center gap-3"></div>
                <input
                  type="checkbox"
                  id="parallelBracketsEnabled"
                  checked={formData.parallelBracketsEnabled}
                  onChange={e => updateFormData('parallelBracketsEnabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <div></div>
                  <label htmlFor="parallelBracketsEnabled" className="text-sm font-medium text-gray-700"></label>
                    Parallel Brackets
                  </label>
                  <p className="text-xs text-gray-500 mt-1"></p>
                    Run multiple brackets simultaneously for different skill levels
                  </p>
              </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2"></label>
              Special Rules
            </label>
            <textarea
              className="input w-full resize-none h-24"
              placeholder="Any special rules or modifications for this tournament..."
              value={formData.specialRules}
              onChange={e => updateFormData('specialRules', e.target.value)}
            />
          </div>
      </div>
  );

  // Render review step
  const renderReview = (renderReview: any) => (
    <div className="space-y-6"></div>
      <div className="bg-white rounded-lg shadow-md p-6"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4"></h3>
          Review Tournament Details
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6"></div>
          <div className="space-y-4"></div>
            <div></div>
              <h4 className="text-sm font-medium text-gray-600">Basic Information</h4>
              <div className="mt-2 space-y-2"></div>
                <div></div>
                  <span className="text-sm text-gray-600">Name: </span>
                  <span className="font-medium">{formData.name || 'Untitled Tournament'}
                </div>
                <div></div>
                  <span className="text-sm text-gray-600">Format: </span>
                  <span className="font-medium capitalize">{formData.format}
                </div>
                <div></div>
                  <span className="text-sm text-gray-600">Description: </span>
                  <p className="text-sm mt-1">{formData.description || 'No description provided'}
                </div>
            </div>
            
            <div></div>
              <h4 className="text-sm font-medium text-gray-600">Schedule & Location</h4>
              <div className="mt-2 space-y-2"></div>
                <div></div>
                  <span className="text-sm text-gray-600">Date & Time: </span>
                  <span className="font-medium"></span>
                    {formData.date} at {formData.time || 'TBD'}
                </div>
                <div></div>
                  <span className="text-sm text-gray-600">Location: </span>
                  <span className="font-medium"></span>
                    {formData.isOnline
                      ? 'Online'
                      : `${formData.venue}, ${formData.city}, ${formData.country}`}
                  </span>
              </div>
            
            <div></div>
              <h4 className="text-sm font-medium text-gray-600">Tournament Structure</h4>
              <div className="mt-2 space-y-2"></div>
                <div></div>
                  <span className="text-sm text-gray-600">Participants: </span>
                  <span className="font-medium"></span>
                    {formData.maxParticipants} max ({formData.minParticipants} min)
                  </span>
                <div></div>
                  <span className="text-sm text-gray-600">Structure: </span>
                  <span className="font-medium capitalize"></span>
                    {formData.rounds} ({formData.totalRounds} rounds)
                    {formData.topCut > 0 ? ` with Top ${formData.topCut}` : ''}
                  </span>
                <div></div>
                  <span className="text-sm text-gray-600">Time Limit: </span>
                  <span className="font-medium">{formData.timeLimit} minutes per round</span>
              </div>
          </div>
          
          <div className="space-y-4"></div>
            <div></div>
              <h4 className="text-sm font-medium text-gray-600">Fees & Prizes</h4>
              <div className="mt-2 space-y-2"></div>
                <div></div>
                  <span className="text-sm text-gray-600">Entry Fee: </span>
                  <span className="font-medium"></span>
                    {formData.entryFee > 0 ? `$${formData.entryFee.toFixed(2)}` : 'Free'}
                  </span>
                <div></div>
                  <span className="text-sm text-gray-600">Prize Pool: </span>
                  <span className="font-medium"></span>
                    {formData.prizePool > 0 ? `$${formData.prizePool.toFixed(2)}` : 'None'}
                  </span>
              </div>
            
            <div></div>
              <h4 className="text-sm font-medium text-gray-600">Advanced Settings</h4>
              <div className="mt-2 space-y-2"></div>
                <div className="flex items-center gap-2"></div>
                  <div className={`w-3 h-3 rounded-full ${formData.decklistRequired ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Decklist Required</span>
                <div className="flex items-center gap-2"></div>
                  <div className={`w-3 h-3 rounded-full ${formData.lateRegistration ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Late Registration</span>
                <div className="flex items-center gap-2"></div>
                  <div className={`w-3 h-3 rounded-full ${formData.spectators ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Spectators Allowed</span>
                <div className="flex items-center gap-2"></div>
                  <div className={`w-3 h-3 rounded-full ${formData.streaming ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Live Streaming</span>
              </div>
            
            <div></div>
              <h4 className="text-sm font-medium text-gray-600">Advanced Features</h4>
              <div className="mt-2 space-y-2"></div>
                <div className="flex items-center gap-2"></div>
                  <div className={`w-3 h-3 rounded-full ${formData.metaBalanceEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Meta Balance Incentives</span>
                <div className="flex items-center gap-2"></div>
                  <div className={`w-3 h-3 rounded-full ${formData.tieredEntryEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Tiered Entry System</span>
                <div className="flex items-center gap-2"></div>
                  <div className={`w-3 h-3 rounded-full ${formData.parallelBracketsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Parallel Brackets</span>
              </div>
          </div>
        
        {formData.specialRules && (
          <div className="mt-6 pt-4 border-t border-gray-200"></div>
            <h4 className="text-sm font-medium text-gray-600">Special Rules</h4>
            <p className="text-sm mt-2">{formData.specialRules}
          </div>
        )}
      </div>
  );

  // Render current step
  const renderStep = (): any => {
    switch (true) {
      case 1:
        return renderTemplateSelection();
      case 2:
        return renderBasicInfo();
      case 3:
        return renderScheduleLocation();
      case 4:
        return renderParticipantsStructure();
      case 5:
        return renderAdvancedSettings();
      case 6:
        return renderReview();
      default:
        return null;
    }
  };

  // Render step indicator
  const renderStepIndicator = (): any => {
    const steps = [
      { number: 1, label: 'Template' },
      { number: 2, label: 'Basic Info' },
      { number: 3, label: 'Schedule' },
      { number: 4, label: 'Structure' },
      { number: 5, label: 'Settings' },
      { number: 6, label: 'Review' },
    ];
    
    return (
    <>
      <div className="mb-6"></div>
      <div className="flex items-center justify-between"></div>
      <div 
              key={s.number}
              className={`flex flex-col items-center ${
                step === s.number 
                  ? 'text-primary' 
                  : step > s.number 
                    ? 'text-green-500' 
                    : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step === s.number 
                  ? 'bg-primary text-white' 
                  : step > s.number 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.number ? <CheckCircle size={16} /> : s.number}
              </div>
      <span className="text-xs hidden md:block">{s.label}
            </div>
    </>
  ))}
        </div>
        <div className="relative mt-2"></div>
          <div className="absolute top-0 left-4 right-4 h-1 bg-gray-200"></div>
          <div 
            className="absolute top-0 left-4 h-1 bg-primary transition-all duration-300"
            style={{ width: `${(step - 1) * 20}%` }}></div>
        </div>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8"></div>
      <div className="mb-6"></div>
      <h1 className="text-2xl font-bold text-gray-900">Create Tournament</h1>
      <p className="text-gray-600">Set up a new tournament with our step-by-step wizard</p>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center justify-between"></div>
      <div className="flex items-center"></div>
      <AlertCircle className="mr-2" size={20} />
            <span>{error}
          </div>
      <button 
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <X size={20} />
          </button>
    </>
  )}
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center justify-between"></div>
          <div className="flex items-center"></div>
            <CheckCircle className="mr-2" size={20} />
            <span>{successMessage}
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-700 hover:text-green-900"
          >
            <X size={20} />
          </button>
      )}
      {/* Current Step */}
      {renderStep()}
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6"></div>
        <button
          className="btn btn-secondary flex items-center"
          onClick={handlePrevStep}
          disabled={step === 1}></button>
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </button>
        
        {step < 6 ? (
          <button
            className="btn btn-primary flex items-center"
            onClick={handleNextStep}></button>
            Next
            <ArrowRight size={16} className="ml-2" />
          </button>
        ) : (
          <button
            className="btn btn-primary flex items-center"
            onClick={handleSubmit}
            disabled={isCreating}></button>
            {isCreating ? (
              <>
                <Loader className="animate-spin mr-2" size={16} />
                Creating...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Create Tournament
              </>
            )}
          </button>
        )}
      </div>
  );
};

export default EnhancedTournamentCreate;