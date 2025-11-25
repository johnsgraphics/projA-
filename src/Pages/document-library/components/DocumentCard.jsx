import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentCard = ({ document, onView, onEdit, onDuplicate, onPrint, onExport, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Terminé', color: 'bg-green-100 text-green-800' },
      archived: { label: 'Archivé', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
            <Icon 
              name={document?.type === 'NOTE' ? 'FileText' : 'FileBarChart'} 
              size={24} 
              className="text-primary" 
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {document?.type === 'NOTE' ? 'Note d\'Honoraires' : 'Rapport Spécial'}
            </h3>
            <p className="text-sm text-gray-600 font-mono font-medium">
              {document?.documentNumber}
            </p>
          </div>
        </div>
        {getStatusBadge(document?.status)}
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Client</p>
          <p className="font-semibold text-gray-900">{document?.clientName}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Créé le</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(document?.createdAt)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Modifié le</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(document?.updatedAt)}</p>
          </div>
        </div>

        {document?.totalAmount && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-xs text-primary/70 uppercase tracking-wide mb-1">Montant total</p>
            <p className="font-bold text-xl text-primary">
              {document?.totalAmount?.toLocaleString('fr-FR')} DA
            </p>
          </div>
        )}

        {document?.description && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {document?.description}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            onClick={() => onView(document)}
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={() => onEdit(document)}
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Printer"
            onClick={() => onPrint(document)}
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={() => onDelete(document)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;