import React from 'react';
import Select from '../../../components/ui/Select';

const ClientSelector = ({ value, onChange, disabled = false }) => {
  const clients = [
    {
      value: 'client_1',
      label: 'SARL TECH INNOVATIONS',
      description: 'RC: 98/00-1234567 - NIF: 000123456789012'
    },
    {
      value: 'client_2',
      label: 'EURL DIGITAL SOLUTIONS',
      description: 'RC: 98/00-2345678 - NIF: 000234567890123'
    },
    {
      value: 'client_3',
      label: 'SPA CONSTRUCTION MODERNE',
      description: 'RC: 98/00-3456789 - NIF: 000345678901234'
    },
    {
      value: 'client_4',
      label: 'EURL SERVICES COMPTABLES',
      description: 'RC: 98/00-4567890 - NIF: 000456789012345'
    }
  ];

  return (
    <div className="mb-6">
      <Select
        label="Client"
        description="Sélectionnez le client pour ce document"
        options={clients}
        value={value}
        onChange={onChange}
        placeholder="Choisir un client..."
        searchable
        clearable
        required
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
};

export default ClientSelector;