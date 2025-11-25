import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentPreviewModal = ({ document, isOpen, onClose, onEdit, onPrint, onExport }) => {
  if (!isOpen || !document) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Terminé', color: 'bg-green-100 text-green-800' },
      archived: { label: 'Archivé', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-999 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon 
                name={document?.type === 'NOTE' ? 'FileText' : 'FileBarChart'} 
                size={24} 
                className="text-primary" 
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {document?.type === 'NOTE' ? 'Note d\'Honoraires' : 'Rapport Spécial'}
              </h2>
              <p className="text-muted-foreground font-mono">
                {document?.documentNumber}
              </p>
            </div>
            {getStatusBadge(document?.status)}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={() => onEdit(document)}
            >
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Printer"
              iconPosition="left"
              onClick={() => onPrint(document)}
            >
              Imprimer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
              className="h-8 w-8 p-0"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Informations du document
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Type de document</p>
                    <p className="font-medium text-foreground">
                      {document?.type === 'NOTE' ? 'Note d\'Honoraires' : 'Rapport Spécial'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Numéro</p>
                    <p className="font-mono text-foreground">{document?.documentNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="text-foreground">{formatDate(document?.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                    <p className="text-foreground">{formatDate(document?.updatedAt)}</p>
                  </div>

                  {document?.totalAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground">Montant total</p>
                      <p className="text-xl font-semibold text-primary">
                        {document?.totalAmount?.toLocaleString('fr-FR')} DA
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Informations client
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom du client</p>
                    <p className="font-medium text-foreground">{document?.clientName}</p>
                  </div>
                  
                  {document?.clientAddress && (
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="text-foreground">{document?.clientAddress}</p>
                    </div>
                  )}
                  
                  {document?.clientRC && (
                    <div>
                      <p className="text-sm text-muted-foreground">RC</p>
                      <p className="font-mono text-foreground">{document?.clientRC}</p>
                    </div>
                  )}
                  
                  {document?.clientNIF && (
                    <div>
                      <p className="text-sm text-muted-foreground">NIF</p>
                      <p className="font-mono text-foreground">{document?.clientNIF}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {document?.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                  Description
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{document?.description}</p>
              </div>
            )}

            {document?.lineItems && document?.lineItems?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                  Éléments de facturation
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Quantité
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Prix unitaire
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {document?.lineItems?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-foreground">{item?.description}</td>
                          <td className="px-4 py-3 text-right text-foreground">{item?.quantity}</td>
                          <td className="px-4 py-3 text-right text-foreground">
                            {item?.unitPrice?.toLocaleString('fr-FR')} DA
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {(item?.quantity * item?.unitPrice)?.toLocaleString('fr-FR')} DA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {document?.notes && (
              <div>
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
                  Notes
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{document?.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;