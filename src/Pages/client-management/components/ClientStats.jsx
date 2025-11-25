import React from 'react';
import Icon from '../../../components/AppIcon';

const ClientStats = ({ totalClients, newThisMonth, withDocuments, filteredCount }) => {
  const stats = [
    {
      id: 'total',
      label: 'Total Clients',
      value: totalClients,
      icon: 'Users',
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    {
      id: 'new',
      label: 'Nouveaux ce mois',
      value: newThisMonth,
      icon: 'UserPlus',
      color: 'bg-success',
      textColor: 'text-success-foreground'
    },
    {
      id: 'documents',
      label: 'Avec documents',
      value: withDocuments,
      icon: 'FileText',
      color: 'bg-accent',
      textColor: 'text-accent-foreground'
    },
    {
      id: 'filtered',
      label: 'Résultats affichés',
      value: filteredCount,
      icon: 'Filter',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat) => (
        <div key={stat?.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${stat?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientStats;