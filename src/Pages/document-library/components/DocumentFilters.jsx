import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DocumentFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  clients, 
  documentCount,
  selectedCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const documentTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'NOTE', label: 'Note d\'Honoraires' },
    { value: 'RAPPORT', label: 'Rapport Spécial' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'completed', label: 'Terminé' },
    { value: 'archived', label: 'Archivé' }
  ];

  const clientOptions = [
    { value: '', label: 'Tous les clients' },
    ...clients?.map(client => ({
      value: client?.id,
      label: client?.nom
    }))
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-foreground">Filtres de recherche</h2>
          <div className="text-sm text-muted-foreground">
            {documentCount} document{documentCount !== 1 ? 's' : ''} trouvé{documentCount !== 1 ? 's' : ''}
            {selectedCount > 0 && (
              <span className="ml-2 text-primary font-medium">
                ({selectedCount} sélectionné{selectedCount !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={onClearFilters}
            >
              Effacer
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            Filtres
          </Button>
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${!isExpanded ? 'hidden md:grid' : ''}`}>
        <div>
          <Input
            label="Recherche"
            type="text"
            placeholder="Rechercher dans les documents..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Type de document
          </label>
          <select
            value={filters?.type || ''}
            onChange={(e) => handleFilterChange('type', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {documentTypes?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Client
          </label>
          <select
            value={filters?.clientId || ''}
            onChange={(e) => handleFilterChange('clientId', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {clientOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Statut
          </label>
          <select
            value={filters?.status || ''}
            onChange={(e) => handleFilterChange('status', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Input
            label="Date de début"
            type="date"
            value={filters?.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
          />
        </div>

        <div>
          <Input
            label="Date de fin"
            type="date"
            value={filters?.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
          />
        </div>

        <div>
          <Input
            label="Numéro de document"
            type="text"
            placeholder="Ex: 01/2025/HN"
            value={filters?.documentNumber || ''}
            onChange={(e) => handleFilterChange('documentNumber', e?.target?.value)}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            size="default"
            iconName="Search"
            iconPosition="left"
            className="w-full"
            onClick={() => {}}
          >
            Rechercher
          </Button>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {filters?.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Recherche: "{filters?.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.type && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Type: {documentTypes?.find(t => t?.value === filters?.type)?.label}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.clientId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Client: {clientOptions?.find(c => c?.value === filters?.clientId)?.label}
                <button
                  onClick={() => handleFilterChange('clientId', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Statut: {statusOptions?.find(s => s?.value === filters?.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentFilters;