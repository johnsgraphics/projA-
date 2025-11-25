import React from 'react';
import DocumentCard from './DocumentCard';
import Icon from '../../../components/AppIcon';

const DocumentGrid = ({ documents, onEdit, onPrint, onExport, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg"></div>
                <div>
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-muted rounded w-20"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-muted rounded flex-1"></div>
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Aucun document trouvé</h3>
        <p className="text-muted-foreground mb-6">
          Commencez par créer votre premier document ou ajustez vos filtres de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents?.map((document) => (
        <DocumentCard
          key={document?.id}
          document={document}
          onEdit={onEdit}
          onPrint={onPrint}
          onExport={onExport}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;