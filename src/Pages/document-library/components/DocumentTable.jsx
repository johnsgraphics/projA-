import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentTable = ({ documents, onView, onEdit, onDuplicate, onPrint, onExport, onDelete, selectedDocuments, onSelectDocument, onSelectAll }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDocuments = [...documents]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-gray-400" />;
    }
    return (
      <Icon 
        name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedDocuments?.length === documents?.length && documents?.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-2">
                  <span>Type</span>
                  <SortIcon field="type" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('documentNumber')}
              >
                <div className="flex items-center space-x-2">
                  <span>Numéro</span>
                  <SortIcon field="documentNumber" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('clientName')}
              >
                <div className="flex items-center space-x-2">
                  <span>Client</span>
                  <SortIcon field="clientName" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-2">
                  <span>Date de création</span>
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedDocuments?.map((document) => (
              <tr key={document?.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedDocuments?.includes(document?.id)}
                    onChange={() => onSelectDocument(document?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={document?.type === 'NOTE' ? 'FileText' : 'FileBarChart'} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-sm font-medium">
                      {document?.type === 'NOTE' ? 'Note d\'Honoraires' : 'Rapport Spécial'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-foreground">
                    {document?.documentNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {document?.clientName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(document?.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(document?.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onView(document)}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEdit(document)}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                    variant="ghost"
                    size="sm"
                    iconName="Printer"
                    onClick={() => onPrint(document)}
                    className="h-8 w-8 p-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => onDelete(document)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {documents?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun document trouvé</h3>
          <p className="text-muted-foreground">
            Aucun document ne correspond aux critères de recherche actuels.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;