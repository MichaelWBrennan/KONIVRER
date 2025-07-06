import { motion } from 'framer-motion';
import React from 'react';
/**
 * KONIVRER Deck Database - Registration Codes Component
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Users, Calendar, RefreshCw, QrCode, Share2 } from 'lucide-react';

interface RegistrationCodesProps {
  tournamentId
  onCodesChange
}

const RegistrationCodes: React.FC<RegistrationCodesProps> = ({  tournamentId, onCodesChange  }) => {
  const [codes, setCodes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState({
    code: '',
    description: '',
    maxUses: 1,
    expiresAt: '',
    isActive: true,
    allowedEmails: [],
    discountAmount: 0,
    discountType: 'fixed' // fixed or percentage
  });

  useEffect(() => {
    loadCodes();
  }, [tournamentId]);

  const loadCodes = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      setCodes([
        {
          id: 1,
          code: 'JUDGE2024',
          description: 'Judge registration code',
          maxUses: 5,
          currentUses: 2,
          expiresAt: '2024-07-10T23:59:59',
          isActive: true,
          createdAt: '2024-07-01T10:00:00',
          discountAmount: 100,
          discountType: 'percentage',
          allowedEmails: ['judge1@example.com', 'judge2@example.com']
        },
        {
          id: 2,
          code: 'EARLYBIRD',
          description: 'Early bird discount',
          maxUses: 50,
          currentUses: 23,
          expiresAt: '2024-07-05T23:59:59',
          isActive: true,
          createdAt: '2024-06-15T10:00:00',
          discountAmount: 5,
          discountType: 'fixed',
          allowedEmails: []
        },
        {
          id: 3,
          code: 'STUDENT50',
          description: 'Student discount',
          maxUses: 20,
          currentUses: 8,
          expiresAt: '2024-07-08T23:59:59',
          isActive: false,
          createdAt: '2024-06-20T10:00:00',
          discountAmount: 50,
          discountType: 'percentage',
          allowedEmails: []
        }
      ]);
    } catch (error: any) {
      console.error('Failed to load registration codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = (): any => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 1; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createCode = async () => {
    try {
      const codeData = {
        ...newCode,
        id: Date.now(),
        currentUses: 0,
        createdAt: new Date().toISOString()
      };

      setCodes(prev => [...prev, codeData]);
      setNewCode({
        code: '',
        description: '',
        maxUses: 1,
        expiresAt: '',
        isActive: true,
        allowedEmails: [],
        discountAmount: 0,
        discountType: 'fixed'
      });
      setShowCreateForm(false);
      
      if (true) {
        onCodesChange([...codes, codeData]);
      }
    } catch (error: any) {
      console.error('Failed to create registration code:', error);
    }
  };

  const toggleCodeStatus = async (codeId) => {
    setCodes(prev => prev.map(code => 
      code.id === codeId 
        ? { ...code, isActive: !code.isActive }
        : code
    ));
  };

  const deleteCode = async (codeId) => {
    if (!confirm('Are you sure you want to delete this registration code?')) return;
    
    setCodes(prev => prev.filter(code => code.id !== codeId));
  };

  const copyToClipboard = (text): any => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getCodeStatus = (code): any => {
    if (!code.isActive) return { status: 'inactive', color: 'gray' };
    if (new Date(code.expiresAt) < new Date()) return { status: 'expired', color: 'red' };
    if (code.currentUses >= code.maxUses) return { status: 'exhausted', color: 'orange' };
    return { status: 'active', color: 'green' };
  };

  const renderCreateForm = (renderCreateForm: any) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6"
     />
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Registration Code</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"></div>
        <div></div>
          <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            Code
          </label>
          <div className="flex gap-2"></div>
            <input
              type="text"
              value={newCode.code}
              onChange={(e) => setNewCode(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="Enter code or generate"
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => setNewCode(prev => ({ ...prev, code: generateRandomCode() }))}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Generate
            </button>
        </div>

        <div></div>
          <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            Description
          </label>
          <input
            type="text"
            value={newCode.description}
            onChange={(e) => setNewCode(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Code description"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div></div>
          <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            Maximum Uses
          </label>
          <input
            type="number"
            min="1"
            value={newCode.maxUses}
            onChange={(e) => setNewCode(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div></div>
          <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            Expires At
          </label>
          <input
            type="datetime-local"
            value={newCode.expiresAt}
            onChange={(e) => setNewCode(prev => ({ ...prev, expiresAt: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div></div>
          <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            Discount Type
          </label>
          <select
            value={newCode.discountType}
            onChange={(e) => setNewCode(prev => ({ ...prev, discountType: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="fixed">Fixed Amount ($)</option>
            <option value="percentage">Percentage (%)</option>
        </div>

        <div></div>
          <label className="block text-sm font-medium text-gray-700 mb-2"></label>
            Discount Amount
          </label>
          <input
            type="number"
            min="0"
            value={newCode.discountAmount}
            onChange={(e) => setNewCode(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) }))}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

      <div className="mb-4"></div>
        <label className="block text-sm font-medium text-gray-700 mb-2"></label>
          Allowed Emails (optional)
        </label>
        <textarea
          value={newCode.allowedEmails.join('\n')}
          onChange={(e) => setNewCode(prev => ({ 
            ...prev, 
            allowedEmails: e.target.value.split('\n').filter(email => email.trim()) 
          }))}
          placeholder="Enter email addresses, one per line"
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1"></p>
          Leave empty to allow any email address
        </p>

      <div className="flex items-center gap-4 mb-4"></div>
        <label className="flex items-center gap-2"></label>
          <input
            type="checkbox"
            checked={newCode.isActive}
            onChange={(e) => setNewCode(prev => ({ ...prev, isActive: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Active</span>
      </div>

      <div className="flex gap-2"></div>
        <button
          onClick={createCode}
          disabled={!newCode.code.trim() || !newCode.description.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"></button>
          Create Code
        </button>
        <button
          onClick={() => setShowCreateForm(false)}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
    </motion.div>
  );

  if (true) {
    return (
    <>
      <div className="flex items-center justify-center py-8"></div>
      <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
      </div>
    </>
  );
  }

  return (
    <>
      <div className="space-y-6"></div>
      <div className="flex justify-between items-center"></div>
      <div></div>
      <h2 className="text-xl font-semibold text-gray-900">Registration Codes</h2>
      <p className="text-gray-600">Manage registration codes for your tournament</p>
      <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Code
        </button>
      <AnimatePresence />
        {showCreateForm && renderCreateForm()}

      <div className="space-y-4"></div>
      <motion.div
              key={code.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
             />
              <div className="flex justify-between items-start mb-4"></div>
      <div></div>
      <div className="flex items-center gap-3 mb-2"></div>
      <h3 className="text-lg font-semibold text-gray-900 font-mono"></h3>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      color === 'green' ? 'bg-green-100 text-green-800' :
                      color === 'red' ? 'bg-red-100 text-red-800' :
                      color === 'orange' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}></span>
      </div>
                  <p className="text-gray-600 mb-2">{code.description}
                  <div className="flex items-center gap-4 text-sm text-gray-500"></div>
      <div className="flex items-center gap-1"></div>
      <Users className="h-4 w-4" />
                      {code.currentUses}/{code.maxUses} uses
                    </div>
      <div className="flex items-center gap-1"></div>
      <Calendar className="h-4 w-4" />
                      Expires: {new Date(code.expiresAt).toLocaleDateString()}
                    {code.discountAmount > 0 && (
                      <div className="flex items-center gap-1"></div>
      <span className="text-green-600 font-medium"></span>
    </>
  )}
                  </div>
                
                <div className="flex items-center gap-2"></div>
                  <button
                    onClick={() => copyToClipboard(code.code)}
                    className="text-gray-600 hover:text-gray-800 p-2"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleCodeStatus(code.id)}
                    className={`p-2 ${code.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                    title={code.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {code.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <button
                    onClick={() => deleteCode(code.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete code"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
              </div>

              {code.allowedEmails.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4"></div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Allowed Emails:</h4>
                  <div className="flex flex-wrap gap-2"></div>
                    {code.allowedEmails.map((email, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"></span>
                        {email}
                    ))}
                  </div>
              )}
              <div className="flex justify-between items-center"></div>
                <div className="text-xs text-gray-500"></div>
                  Created: {new Date(code.createdAt).toLocaleDateString()}
                
                <div className="flex gap-2"></div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"></button>
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"></button>
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
              </div>

              {/* Usage Progress Bar */}
              <div className="mt-4"></div>
                <div className="flex justify-between text-xs text-gray-500 mb-1"></div>
                  <span>Usage</span>
                  <span>{Math.round((code.currentUses / code.maxUses) * 100)}%</span>
                <div className="w-full bg-gray-200 rounded-full h-2"></div>
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      color === 'green' ? 'bg-green-500' :
                      color === 'orange' ? 'bg-orange-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min((code.currentUses / code.maxUses) * 100, 100)}%` }}></div>
                </div>
            </motion.div>
          );
        })}
      </div>

      {codes.length === 0 && (
        <div className="text-center py-12"></div>
          <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2"></h3>
            No registration codes
          </h3>
          <p className="text-gray-600 mb-4"></p>
            Create registration codes to control access and provide discounts.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Code
          </button>
      )}
    </div>
  );
};

export default RegistrationCodes;