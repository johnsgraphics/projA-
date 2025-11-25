import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DeleteConfirmation = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  clientName, 
  isMultiple = false, 
  count = 1,
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1000 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-muted-foreground">
                Cette action est irréversible
              </p>
            </div>
          </div>

          <div className="mb-6">
            {isMultiple ? (
              <p className="text-foreground">
                Êtes-vous sûr de vouloir supprimer <strong>{count} client{count > 1 ? 's' : ''}</strong> ?
                <br />
                <span className="text-sm text-muted-foreground mt-2 block">
                  Tous les documents associés à ces clients seront également supprimés.
                </span>
              </p>
            ) : (
              <p className="text-foreground">
                Êtes-vous sûr de vouloir supprimer le client <strong>"{clientName}"</strong> ?
                <br />
                <span className="text-sm text-muted-foreground mt-2 block">
                  Tous les documents associés à ce client seront également supprimés.
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              loading={isDeleting}
              iconName="Trash2"
              iconPosition="left"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;