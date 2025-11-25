import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  searchTerm, 
  onSearchChange, 
  documentType, 
  onDocumentTypeChange,
  dateRange,
  onDateRangeChange,
  selectedClient,
  onClientChange,
  clients,
  onClearFilters 
}) => {
  const documentTypeOptions = [
    { value: 'all', label: 'Tous les documents' },
    { value: 'NOTE', label: 'Notes d\'Honoraires' },
    { value: 'RAPPORT', label: 'Rapports Spéciaux' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Toutes les dates' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' }
  ];

  const clientOptions = [
    { value: 'all', label: 'Tous les clients' },
    ...clients?.map(client => ({
      value: client?.id,
      label: client?.nom
    }))
  ];

  const hasActiveFilters = searchTerm || documentType !== 'all' || dateRange !== 'all' || selectedClient !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Rechercher par client ou numéro..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full"
        />
        
        <Select
          options={documentTypeOptions}
          value={documentType}
          onChange={onDocumentTypeChange}
          placeholder="Type de document"
        />
        
        <Select
          options={dateRangeOptions}
          value={dateRange}
          onChange={onDateRangeChange}
          placeholder="Période"
        />
        
        <Select
          options={clientOptions}
          value={selectedClient}
          onChange={onClientChange}
          placeholder="Client"
        />
      </div>
      {hasActiveFilters && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Filtres actifs appliqués
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;