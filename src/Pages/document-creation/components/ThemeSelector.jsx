import React from 'react';
import Select from '../../../components/ui/Select';

const ThemeSelector = ({ value, onChange, disabled = false }) => {
  const themes = [
    {
      value: 'BlueWave',
      label: 'BlueWave (Par défaut)',
      description: 'Thème moderne avec accents turquoise'
    },
    {
      value: 'Classic',
      label: 'Classique',
      description: 'Style traditionnel professionnel'
    },
    {
      value: 'Minimal',
      label: 'Minimal',
      description: 'Design épuré et moderne'
    }
  ];

  return (
    <div className="mb-4">
      <Select
        label="Thème du Document"
        description="Choisissez le style d'apparence pour votre document"
        options={themes}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
};

export default ThemeSelector;