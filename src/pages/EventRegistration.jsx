import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Shield,
  Target,
  Award,
  Zap,
  BookOpen,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { analytics } from '../utils/analytics';

const EventRegistration = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Deck, 3: Payment, 4: Confirmation
  const [userDecks, setUserDecks] = useState([]);
  
  const [formData, setFormData] = useState({
    // Player Info
    playerName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    
    // Deck Selection
    selectedDeck: '',
    decklistFile: null,
    decklistText: '',
    
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    
    // Preferences
    notifications: true,
    newsletter: false,
    shareContact: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Mock event data
    const mockEvent = {
      id: eventId || 1,
      name: 'KONIVRER Regional Championship',
      description: 'Join us for the biggest KONIVRER tournament of the season! Compete against the best players in the region for amazing prizes and glory.',
      format: 'Standard',
      type: 'Swiss + Top 8',
      date: '2024-06-15',
      time: '10:00',
      endTime: '18:00',
      location: 'GameHub Convention Center',
      address: '123 Gaming Street, San Francisco, CA 94102',
      organizer: 'GameHub Events',
      judge: 'Sarah Chen (Level 2)',
      maxPlayers: 128,
      registeredPlayers: 87,
      entryFee: 25,
      prizePool: '$2,000 + Booster Packs',
      registrationDeadline: '2024-06-14 23:59',
      decklistDeadline: '2024-06-14 23:59',
      requirements: [
        'Valid KONIVRER player ID',
        'Standard format deck (40 cards minimum)',
        'Completed decklist submission',
        'Entry fee payment'
      ],
      schedule: [
        { time: '09:00', event: 'Registration Opens' },
        { time: '09:45', event: 'Player Meeting' },
        { time: '10:00', event: 'Round 1 Begins' },
        { time: '12:30', event: 'Lunch Break' },
        { time: '13:30', event: 'Swiss Rounds Continue' },
        { time: '16:00', event: 'Top 8 Begins' },
        { time: '18:00', event: 'Finals & Awards' }
      ],
      prizes: [
        { place: '1st', prize: '$800 + Trophy + Playmat' },
        { place: '2nd', prize: '$400 + Playmat' },
        { place: '3rd-4th', prize: '$200 + Playmat' },
        { place: '5th-8th', prize: '$100' },
        { place: 'Top 16', prize: '4 Booster Packs' },
        { place: 'All Players', prize: 'Participation Promo Card' }
      ],
      rules: 'Standard KONIVRER tournament rules apply. Deck construction follows current Standard format restrictions.',
      contact: 'events@gamehub.com',
      status: 'open', // open, full, closed
      isRegistered: false,
      paymentRequired: true,
      decklistRequired: true
    };

    const mockUserDecks = [
      { id: 1, name: 'Elemental Storm', format: 'Standard', isLegal: true },
      { id: 2, name: 'Control Master', format: 'Standard', isLegal: true },
      { id: 3, name: 'Aggro Rush', format: 'Legacy', isLegal: false }
    ];

    setTimeout(() => {
      setEvent(mockEvent);
      setUserDecks(mockUserDecks);
      setLoading(false);
    }, 1000);
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.playerName.trim()) newErrors.playerName = 'Player name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    }

    if (stepNumber === 2) {
      if (!formData.selectedDeck && !formData.decklistText.trim()) {
        newErrors.selectedDeck = 'Please select a deck or provide a decklist';
      }
    }

    if (stepNumber === 3 && event.paymentRequired) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      analytics.buttonClick('registration_next_step', step);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmitRegistration = async () => {
    if (!validateStep(step)) return;

    setRegistering(true);
    analytics.buttonClick('registration_submit', event.id);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would submit to the backend
      console.log('Registration submitted:', formData);
      
      setStep(4); // Confirmation step
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-400';
      case 'full': return 'text-yellow-400';
      case 'closed': return 'text-red-400';
      default: return 'text-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Registration Open';
      case 'full': return 'Event Full';
      case 'closed': return 'Registration Closed';
      default: return 'Unknown';
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
            <p className="text-muted mt-4">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tournaments" className="btn btn-ghost">
          <ArrowLeft size={16} />
          Back to Events
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-secondary">Event Registration</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[
              { number: 1, title: 'Player Info', icon: User },
              { number: 2, title: 'Deck Selection', icon: BookOpen },
              { number: 3, title: 'Payment', icon: CreditCard },
              { number: 4, title: 'Confirmation', icon: CheckCircle }
            ].map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.number;
              const isCompleted = step > stepItem.number;
              
              return (
                <div key={stepItem.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? 'bg-green-600 border-green-600 text-white' :
                    isActive ? 'border-accent-primary text-accent-primary' :
                    'border-muted text-muted'
                  }`}>
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-accent-primary' : isCompleted ? 'text-green-400' : 'text-muted'
                    }`}>
                      {stepItem.title}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step > stepItem.number ? 'bg-green-600' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Player Information */}
          {step === 1 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Player Information</h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Player Name *</label>
                    <input
                      type="text"
                      name="playerName"
                      value={formData.playerName}
                      onChange={handleInputChange}
                      className={`input ${errors.playerName ? 'border-red-500' : ''}`}
                      placeholder="Your full name"
                    />
                    {errors.playerName && <p className="text-red-400 text-sm mt-1">{errors.playerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Name and phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dietary Restrictions / Allergies</label>
                  <textarea
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleInputChange}
                    className="input resize-none"
                    rows={3}
                    placeholder="Please list any dietary restrictions or allergies..."
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <label className="text-sm">Send me event updates and notifications</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <label className="text-sm">Subscribe to KONIVRER newsletter</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="shareContact"
                      checked={formData.shareContact}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <label className="text-sm">Allow other players to contact me for practice games</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={handleNextStep} className="btn btn-primary">
                  Next: Deck Selection
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Deck Selection */}
          {step === 2 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Deck Selection</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-blue-400" size={20} />
                    <span className="font-semibold text-blue-400">Format: {event.format}</span>
                  </div>
                  <p className="text-sm text-secondary">
                    Your deck must be legal in the {event.format} format. Decklist submission is required by {new Date(event.decklistDeadline).toLocaleString()}.
                  </p>
                </div>

                {/* Saved Decks */}
                <div>
                  <h3 className="font-medium mb-3">Select from Saved Decks</h3>
                  <div className="space-y-2">
                    {userDecks.filter(deck => deck.format === event.format).map(deck => (
                      <div
                        key={deck.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.selectedDeck === deck.id.toString()
                            ? 'border-accent-primary bg-accent-primary/10'
                            : 'border-color hover:border-accent-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, selectedDeck: deck.id.toString() }))}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{deck.name}</div>
                            <div className="text-sm text-secondary">{deck.format}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {deck.isLegal ? (
                              <CheckCircle className="text-green-400" size={16} />
                            ) : (
                              <XCircle className="text-red-400" size={16} />
                            )}
                            <input
                              type="radio"
                              name="selectedDeck"
                              value={deck.id}
                              checked={formData.selectedDeck === deck.id.toString()}
                              onChange={handleInputChange}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Decklist */}
                <div>
                  <h3 className="font-medium mb-3">Or Submit New Decklist</h3>
                  <textarea
                    name="decklistText"
                    value={formData.decklistText}
                    onChange={handleInputChange}
                    className="input resize-none"
                    rows={8}
                    placeholder="Paste your decklist here...&#10;&#10;Example:&#10;4 Brilliant Watcher&#10;4 Infernal Sprinter&#10;3 Gustling Wisp&#10;..."
                  />
                </div>

                {errors.selectedDeck && (
                  <p className="text-red-400 text-sm">{errors.selectedDeck}</p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={handlePreviousStep} className="btn btn-secondary">
                  Previous
                </button>
                <button onClick={handleNextStep} className="btn btn-primary">
                  Next: Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
              
              {event.paymentRequired ? (
                <div className="space-y-6">
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-green-400">Entry Fee</div>
                        <div className="text-sm text-secondary">Includes tournament entry and participation promo</div>
                      </div>
                      <div className="text-2xl font-bold text-green-400">${event.entryFee}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="venmo">Venmo</option>
                    </select>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`input ${errors.expiryDate ? 'border-red-500' : ''}`}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`input ${errors.cvv ? 'border-red-500' : ''}`}
                            placeholder="123"
                          />
                          {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Billing Address</label>
                        <textarea
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className="input resize-none"
                          rows={3}
                          placeholder="Street address, City, State, ZIP"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="font-semibold text-green-400">Free Event</span>
                  </div>
                  <p className="text-sm text-secondary">
                    This event is free to enter. No payment required.
                  </p>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button onClick={handlePreviousStep} className="btn btn-secondary">
                  Previous
                </button>
                <button
                  onClick={handleSubmitRegistration}
                  disabled={registering}
                  className="btn btn-primary"
                >
                  {registering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Complete Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="card text-center">
              <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-semibold mb-4">Registration Complete!</h2>
              
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6 mb-6">
                <p className="text-lg mb-4">
                  You have successfully registered for <strong>{event.name}</strong>
                </p>
                <div className="space-y-2 text-sm">
                  <div>Registration ID: <strong>REG-{Date.now()}</strong></div>
                  <div>Confirmation sent to: <strong>{formData.email}</strong></div>
                </div>
              </div>

              <div className="space-y-4 text-left max-w-md mx-auto">
                <h3 className="font-semibold">Next Steps:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                    <span>Check your email for confirmation details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                    <span>Arrive 30 minutes early for check-in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                    <span>Bring a printed copy of your decklist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <User className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
                    <span>Bring valid photo ID for verification</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Link to="/tournaments" className="btn btn-secondary">
                  View More Events
                </Link>
                <Link to="/profile" className="btn btn-primary">
                  View My Registrations
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-6">
          {/* Event Summary */}
          <div className="card">
            <h3 className="font-semibold mb-4">Event Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="text-accent-primary" size={16} />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="text-accent-primary" size={16} />
                <span>{event.time} - {event.endTime}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="text-accent-primary flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <div>{event.location}</div>
                  <div className="text-muted">{event.address}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="text-accent-primary" size={16} />
                <span>{event.registeredPlayers}/{event.maxPlayers} players</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Trophy className="text-accent-primary" size={16} />
                <span>{event.format} • {event.type}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="text-accent-primary" size={16} />
                <span>${event.entryFee} entry fee</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Award className="text-accent-primary" size={16} />
                <span>{event.prizePool}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-color">
              <div className={`text-center font-medium ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card">
            <h3 className="font-semibold mb-4">Schedule</h3>
            <div className="space-y-2 text-sm">
              {event.schedule.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted">{item.time}</span>
                  <span>{item.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prizes */}
          <div className="card">
            <h3 className="font-semibold mb-4">Prize Structure</h3>
            <div className="space-y-2 text-sm">
              {event.prizes.map((prize, index) => (
                <div key={index} className="flex justify-between">
                  <span className={`font-medium ${
                    prize.place === '1st' ? 'text-yellow-400' : 
                    prize.place.includes('2nd') || prize.place.includes('3rd') ? 'text-gray-300' : 
                    'text-secondary'
                  }`}>
                    {prize.place}
                  </span>
                  <span className="text-right">{prize.prize}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="card">
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted">Organizer:</span>
                <div>{event.organizer}</div>
              </div>
              <div>
                <span className="text-muted">Head Judge:</span>
                <div>{event.judge}</div>
              </div>
              <div>
                <span className="text-muted">Email:</span>
                <div>{event.contact}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;