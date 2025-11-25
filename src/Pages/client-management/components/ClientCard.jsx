import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ClientCard = ({ client, onUse, onEdit, onDelete, isSelected, onSelect }) => {
  const handleUse = () => {
    onUse(client);
  };

  const handleEdit = () => {
    onEdit(client);
  };

  const handleDelete = () => {
    onDelete(client);
  };

  const handleSelect = () => {
    onSelect(client?.id);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 ${
      isSelected ? 'ring-2 ring-primary border-primary' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
          />
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={24} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{client?.nom}</h3>
            <p className="text-sm text-muted-foreground">Client #{client?.id?.toString()?.padStart(3, '0')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={handleEdit}
            className="text-muted-foreground hover:text-foreground"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={handleDelete}
            className="text-error hover:text-error"
          />
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Adresse</label>
          <p className="text-sm text-foreground mt-1">{client?.adresse}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RC</label>
            <p className="text-sm text-foreground mt-1">{client?.rc || 'Non renseigné'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">NIF</label>
            <p className="text-sm text-foreground mt-1">{client?.nif || 'Non renseigné'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">NIS</label>
            <p className="text-sm text-foreground mt-1">{client?.nis || 'Non renseigné'}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Créé le {new Date(client.dateCreation)?.toLocaleDateString('fr-FR')}
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="FileText"
          iconPosition="left"
          onClick={handleUse}
        >
          Utiliser
        </Button>
      </div>
    </div>
  );
};

export default ClientCard;