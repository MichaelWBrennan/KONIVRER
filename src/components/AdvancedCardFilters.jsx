import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const AdvancedCardFilters = ({ filters, onFiltersChange, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    class: true,
    elements: true,
    keywords: true,
    talents: true,
    cost: true,
    power: true,
    rarity: true,
    set: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (category, value, isMultiple = false) => {
    if (isMultiple) {
      const currentValues = filters[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onFiltersChange({ ...filters, [category]: newValues });
    } else {
      onFiltersChange({ 
        ...filters, 
        [category]: filters[category] === value ? '' : value 
      });
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      type: [],
      class: [],
      elements: [],
      keywords: [],
      talents: [],
      cost: { min: '', max: '' },
      power: { min: '', max: '' },
      rarity: [],
      set: [],
    });
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-700 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-white hover:text-blue-400 transition-colors"
      >
        {title}
        {expandedSections[section] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxFilter = ({ options, category, label }) => (
    <div className="space-y-2">
      {options.map(option => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={(filters[category] || []).includes(option)}
            onChange={() => updateFilter(category, option, true)}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-300">{option}</span>
        </label>
      ))}
    </div>
  );

  const RangeFilter = ({ category, label, min = 0, max = 10 }) => (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min"
          value={filters[category]?.min || ''}
          onChange={(e) => updateFilter(category, { ...filters[category], min: e.target.value })}
          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          min={min}
          max={max}
        />
        <span className="text-gray-400 self-center">-</span>
        <input
          type="number"
          placeholder="Max"
          value={filters[category]?.max || ''}
          onChange={(e) => updateFilter(category, { ...filters[category], max: e.target.value })}
          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          min={min}
          max={max}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Advanced Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <FilterSection title="Card Type" section="type">
            <CheckboxFilter
              options={['Creature', 'Spell', 'Equipment', 'Artifact']}
              category="type"
            />
          </FilterSection>

          <FilterSection title="Class" section="class">
            <CheckboxFilter
              options={['Elemental', 'Demon', 'Guardian', 'Support', 'Weapon', 'Armor', 'Dragon', 'Assassin', 'Resource', 'Wizard', 'Construct']}
              category="class"
            />
          </FilterSection>

          <FilterSection title="Elements" section="elements">
            <CheckboxFilter
              options={['🜁', '🜂', '🜃', '🜄', '🜅']}
              category="elements"
            />
          </FilterSection>

          <FilterSection title="Keywords" section="keywords">
            <CheckboxFilter
              options={['Gust', 'Inferno', 'Brilliance', 'Steadfast', 'Instant', 'Equipment', 'Flying', 'Shadow', 'Stealth', 'Artifact', 'Storm', 'Defender']}
              category="keywords"
            />
          </FilterSection>

          <FilterSection title="Talents" section="talents">
            <CheckboxFilter
              options={['Wind', 'Fire', 'Light', 'Earth', 'Shadow']}
              category="talents"
            />
          </FilterSection>

          <FilterSection title="Cost" section="cost">
            <RangeFilter category="cost" label="Mana Cost" min={0} max={10} />
          </FilterSection>

          <FilterSection title="Power" section="power">
            <RangeFilter category="power" label="Power" min={0} max={10} />
          </FilterSection>

          <FilterSection title="Rarity" section="rarity">
            <CheckboxFilter
              options={['common', 'uncommon', 'rare', 'mythic']}
              category="rarity"
            />
          </FilterSection>

          <FilterSection title="Set" section="set">
            <CheckboxFilter
              options={['Core Set', 'Expansion 1']}
              category="set"
            />
          </FilterSection>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCardFilters;