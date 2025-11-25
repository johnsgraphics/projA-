import React from 'react';
import Select from '../../../components/ui/Select';

const DocumentTypeSelector = ({ value, onChange, disabled = false }) => {
  const documentTypes = [
    {
      value: 'NOTE_HONORAIRES',
      label: 'NOTE D\'HONORAIRES',
      description: 'Facture de services professionnels'
    },
    {
      value: 'RAPPORT_SPECIAL',
      label: 'RAPPORT SPECIAL PROJET D\'AUGMENTATION DU CAPITAL SOCIAL',
      description: 'Rapport d\'expertise comptable'
    }
  ];

  return (
    <div className="mb-6">
      <Select
        label="Type de Document"
        description="Sélectionnez le type de document à créer"
        options={documentTypes}
        value={value}
        onChange={onChange}
        placeholder="Choisir un type de document..."
        required
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
};

export default DocumentTypeSelector;