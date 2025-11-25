import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  onAddClient, 
  selectedCount, 
  onBulkDelete, 
  onExport,
  totalClients 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e) => {
    onSearchChange(e?.target?.value);
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="w-full sm:w-80">
            <Input
              type="search"
              placeholder="Rechercher par nom, RC, NIF ou NIS..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconPosition="left"
            onClick={toggleFilters}
            className="whitespace-nowrap"
          >
            Filtres
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
              </span>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={onBulkDelete}
              >
                Supprimer
              </Button>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
            className="hidden sm:flex"
          >
            Exporter
          </Button>
          
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onAddClient}
          >
            Ajouter Client
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Statut RC
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="">Tous</option>
                <option value="with-rc">Avec RC</option>
                <option value="without-rc">Sans RC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Statut NIF
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="">Tous</option>
                <option value="with-nif">Avec NIF</option>
                <option value="without-nif">Sans NIF</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date de création
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
            >
              Réinitialiser
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={toggleFilters}
            >
              Appliquer
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {totalClients} client{totalClients > 1 ? 's' : ''} au total
        </span>
        {searchTerm && (
          <span>
            Résultats pour "{searchTerm}"
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;