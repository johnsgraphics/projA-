import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentCard = ({ document, onEdit, onPrint, onExport }) => {
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'NOTE':
        return 'FileText';
      case 'RAPPORT':
        return 'FileBarChart';
      default:
        return 'File';
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'NOTE':
        return 'Note d\'Honoraires';
      case 'RAPPORT':
        return 'Rapport Spécial';
      default:
        return 'Document';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    })?.format(amount)?.replace('DZD', 'DA');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getDocumentIcon(document?.type)} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{getDocumentTypeLabel(document?.type)}</h3>
            <p className="text-sm text-muted-foreground">N° {document?.number}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {formatDate(document?.createdAt)}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="User" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{document?.clientName}</span>
        </div>
        {document?.totalAmount && (
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{formatAmount(document?.totalAmount)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={() => onEdit(document)}
          className="flex-1"
        >
          Modifier
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Printer"
          onClick={() => onPrint(document)}
        />
        <Button
          variant="ghost"
          size="sm"
          iconName="Download"
          onClick={() => onExport(document)}
        />
      </div>
    </div>
  );
};

export default DocumentCard;