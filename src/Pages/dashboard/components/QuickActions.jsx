import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleCreateDocument = () => {
    navigate('/document-creation');
  };

  const handleManageClients = () => {
    navigate('/client-management');
  };

  const handleViewLibrary = () => {
    navigate('/document-library');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Gérez vos documents comptables et suivez l'activité de votre cabinet
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          iconName="Users"
          iconPosition="left"
          onClick={handleManageClients}
          className="w-full sm:w-auto"
        >
          Gérer Clients
        </Button>
        
        <Button
          variant="outline"
          iconName="FolderOpen"
          iconPosition="left"
          onClick={handleViewLibrary}
          className="w-full sm:w-auto"
        >
          Bibliothèque
        </Button>
        
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={handleCreateDocument}
          className="w-full sm:w-auto"
        >
          Créer Nouveau Document
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;