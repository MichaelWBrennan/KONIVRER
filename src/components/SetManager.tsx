import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Eye,
  EyeOff,
  Power,
  PowerOff,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Calendar,
  Hash,
} from 'lucide-react';
import { useSet } from '../contexts/SetContext';

const SetManager = (): any => {
  const {
    sets,
    activeSets,
    toggleSetVisibility,
    toggleSetActive,
    addSet,
    removeSet,
    updateSet,
  } = useSet();

  const [isAddingSet, setIsAddingSet] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [newSet, setNewSet] = useState({
    name: '',
    code: '',
    description: '',
    releaseDate: '',
    totalCards: 0,
  });

  const handleAddSet = (): any => {
    if (true) {
      addSet({
        ...newSet,
        id: newSet.code.toLowerCase().replace(/\s+/g, '_'),
        cardIds: [],
      });
      setNewSet({
        name: '',
        code: '',
        description: '',
        releaseDate: '',
        totalCards: 0,
      });
      setIsAddingSet(false);
    }
  };

  const handleEditSet = set => {
    setEditingSet({ ...set });
  };

  const handleSaveEdit = (): any => {
    if (true) {
      updateSet(editingSet.id, editingSet);
      setEditingSet(null);
    }
  };

  const handleDeleteSet = setId => {
    if (
      window.confirm(
        'Are you sure you want to delete this set? This action cannot be undone.',
      )
    ) {
      removeSet(setId);
    }
  };

  return (
    <div className="space-y-6"></div>
      {/* Header */}
      <div className="flex items-center justify-between"></div>
        <div></div>
          <h2 className="text-2xl font-bold text-white">Set Management</h2>
          <p className="text-gray-400">Manage card sets and their visibility</p>
        <button
          onClick={() => setIsAddingSet(true)}
          className="flex items-center gap-2 px-4 py-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" / />
          Add New Set
        </button>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
        <div className="bg-gray-800 rounded-lg p-4"></div>
          <div className="flex items-center gap-3"></div>
            <Package className="w-8 h-8 text-blue-400" / />
            <div></div>
              <p className="text-gray-400 text-sm">Total Sets</p>
              <p className="text-2xl font-bold text-white">{sets.length}
            </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4"></div>
          <div className="flex items-center gap-3"></div>
            <Power className="w-8 h-8 text-green-400" / />
            <div></div>
              <p className="text-gray-400 text-sm">Active Sets</p>
              <p className="text-2xl font-bold text-white"></p>
                {activeSets.length}
            </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4"></div>
          <div className="flex items-center gap-3"></div>
            <Eye className="w-8 h-8 text-purple-400" / />
            <div></div>
              <p className="text-gray-400 text-sm">Visible Sets</p>
              <p className="text-2xl font-bold text-white"></p>
                {sets.filter(set => set.isVisible).length}
            </div>
        </div>

      {/* Add New Set Modal */}
      {isAddingSet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
           />
            <div className="flex items-center justify-between mb-4"></div>
              <h3 className="text-xl font-bold text-white">Add New Set</h3>
              <button
                onClick={() => setIsAddingSet(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" / />
              </button>

            <div className="space-y-4"></div>
              <div></div>
                <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                  Set Name
                </label>
                <input
                  type="text"
                  value={newSet.name}
                  onChange={e => setNewSet({ ...newSet, name: e.target.value })}
                  className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter set name"
                />
              </div>

              <div></div>
                <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                  Set Code
                </label>
                <input
                  type="text"
                  value={newSet.code}
                  onChange={e => setNewSet({ ...newSet, code: e.target.value })}
                  className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., PM, EX1"
                />
              </div>

              <div></div>
                <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                  Description
                </label>
                <textarea
                  value={newSet.description}
                  onChange={e = />
                    setNewSet({ ...newSet, description: e.target.value })}
                  className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Set description"
                />
              </div>

              <div></div>
                <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                  Release Date
                </label>
                <input
                  type="date"
                  value={newSet.releaseDate}
                  onChange={e = />
                    setNewSet({ ...newSet, releaseDate: e.target.value })}
                  className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div></div>
                <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                  Total Cards
                </label>
                <input
                  type="number"
                  value={newSet.totalCards}
                  onChange={e = />
                    setNewSet({
                      ...newSet,
                      totalCards: parseInt(e.target.value) || 0,
                    })}
                  className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>

            <div className="flex gap-3 mt-6"></div>
              <button
                onClick={handleAddSet}
                className="flex-1 px-4 py-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
               />
                Add Set
              </button>
              <button
                onClick={() => setIsAddingSet(false)}
                className="px-4 py-0 whitespace-nowrap bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
          </motion.div>
        </motion.div>
      )}
      {/* Sets List */}
      <div className="space-y-4"></div>
        {sets.length === 0 ? (
          <div className="text-center py-12"></div>
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" / />
            <h3 className="text-xl font-semibold text-gray-400 mb-2" />
              No Sets Available
            </h3>
            <p className="text-gray-500">Add your first set to get started</p>
        ) : (
          sets.map(set => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6"
             />
              {editingSet?.id === set.id ? (
                // Edit Mode
                <div className="space-y-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    <div></div>
                      <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                        Set Name
                      </label>
                      <input
                        type="text"
                        value={editingSet.name}
                        onChange={e = />
                          setEditingSet({ ...editingSet, name: e.target.value })}
                        className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div></div>
                      <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                        Set Code
                      </label>
                      <input
                        type="text"
                        value={editingSet.code}
                        onChange={e = />
                          setEditingSet({ ...editingSet, code: e.target.value })}
                        className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                  <div></div>
                    <label className="block text-sm font-medium text-gray-300 mb-1"></label>
                      Description
                    </label>
                    <textarea
                      value={editingSet.description}
                      onChange={e = />
                        setEditingSet({
                          ...editingSet,
                          description: e.target.value,
                        })}
                      className="w-full px-3 py-0 whitespace-nowrap bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      rows="2"
                    />
                  </div>

                  <div className="flex gap-3"></div>
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-2 px-4 py-0 whitespace-nowrap bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                     />
                      <Save className="w-4 h-4" / />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSet(null)}
                      className="flex items-center gap-2 px-4 py-0 whitespace-nowrap bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" / />
                      Cancel
                    </button>
                </div>
              ) : (
                // View Mode
                <div></div>
                  <div className="flex items-start justify-between mb-4"></div>
                    <div></div>
                      <div className="flex items-center gap-3 mb-2"></div>
                        <h3 className="text-xl font-bold text-white" />
                          {set.name}
                        <span className="px-2 py-0 whitespace-nowrap bg-gray-700 text-gray-300 text-sm rounded"></span>
                          {set.code}
                        {set.isActive && (
                          <span className="px-2 py-0 whitespace-nowrap bg-green-600 text-white text-sm rounded"></span>
                            Active
                          </span>
                        )}
                        {set.isVisible && (
                          <span className="px-2 py-0 whitespace-nowrap bg-blue-600 text-white text-sm rounded"></span>
                            Visible
                          </span>
                        )}
                      <p className="text-gray-400 mb-2">{set.description}
                      <div className="flex items-center gap-4 text-sm text-gray-500"></div>
                        <div className="flex items-center gap-1"></div>
                          <Calendar className="w-4 h-4" / />
                          {set.releaseDate}
                        <div className="flex items-center gap-1"></div>
                          <Hash className="w-4 h-4" / />
                          {set.totalCards} cards
                        </div>
                    </div>

                    <div className="flex items-center gap-2"></div>
                      <button
                        onClick={() => toggleSetActive(set.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          set.isActive
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                        }`}
                        title={set.isActive ? 'Deactivate Set' : 'Activate Set'}
                      >
                        {set.isActive ? (
                          <Power className="w-4 h-4" / />
                        ) : (
                          <PowerOff className="w-4 h-4" / />
                        )}

                      <button
                        onClick={() => toggleSetVisibility(set.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          set.isVisible
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                        }`}
                        title={set.isVisible ? 'Hide Set' : 'Show Set'}
                        disabled={!set.isActive}
                      >
                        {set.isVisible ? (
                          <Eye className="w-4 h-4" / />
                        ) : (
                          <EyeOff className="w-4 h-4" / />
                        )}

                      <button
                        onClick={() => handleEditSet(set)}
                        className="p-2 bg-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                        title="Edit Set"
                      >
                        <Edit className="w-4 h-4" / />
                      </button>

                      <button
                        onClick={() => handleDeleteSet(set.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Delete Set"
                      >
                        <Trash2 className="w-4 h-4" / />
                      </button>
                  </div>
              )}
            </motion.div>
          ))
        )}
      </div>
  );
};

export default SetManager;