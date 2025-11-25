import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedDocuments, onBulkExport, onBulkArchive, onBulkDelete, onClearSelection }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (selectedDocuments?.length === 0) {
    return null;
  }

  const handleBulkExport = async () => {
    setIsExporting(true);
    try {
      await onBulkExport(selectedDocuments);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedDocuments);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedDocuments?.length} document{selectedDocuments?.length !== 1 ? 's' : ''} sélectionné{selectedDocuments?.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              Supprimer
            </Button>

            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
              className="h-8 w-8 p-0"
            />
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-999 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-red-600" />
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

            <p className="text-foreground mb-6">
              Êtes-vous sûr de vouloir supprimer {selectedDocuments?.length} document{selectedDocuments?.length !== 1 ? 's' : ''} ?
              Cette action ne peut pas être annulée et les numéros de documents seront automatiquement renumerotés.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                iconName="Trash2"
                iconPosition="left"
                onClick={handleBulkDelete}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;