import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import ClientCard from './components/ClientCard';
import ClientForm from './components/ClientForm';
import SearchAndFilters from './components/SearchAndFilters';
import DeleteConfirmation from './components/DeleteConfirmation';
import ClientStats from './components/ClientStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ClientManagement = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    client: null,
    isMultiple: false,
    count: 0
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for clients
  const mockClients = [
    {
      id: 1,
      nom: "SARL TECH SOLUTIONS",
      adresse: "Zone Industrielle Rouiba, Alger 16012",
      rc: "16/00-0123456",
      nif: "098765432101",
      nis: "000016123456789",
      dateCreation: "2024-01-15T10:30:00Z",
      dateModification: "2024-10-20T14:45:00Z"
    },
    {
      id: 2,
      nom: "Entreprise Bâtiment Moderne",
      adresse: "Cité des 1000 Logements, Oran 31000",
      rc: "31/00-0987654",
      nif: "123456789012",
      nis: "000031987654321",
      dateCreation: "2024-02-10T09:15:00Z",
      dateModification: "2024-11-01T16:20:00Z"
    },
    {
      id: 3,
      nom: "Cabinet Conseil Juridique",
      adresse: "Boulevard Mohamed V, Constantine 25000",
      rc: "25/00-0456789",
      nif: "567890123456",
      nis: "000025456789012",
      dateCreation: "2024-03-05T11:45:00Z",
      dateModification: "2024-10-15T13:30:00Z"
    },
    {
      id: 4,
      nom: "Pharmacie Centrale",
      adresse: "Rue Didouche Mourad, Alger 16000",
      rc: "16/00-0789123",
      nif: "234567890123",
      nis: "000016789123456",
      dateCreation: "2024-04-12T08:20:00Z",
      dateModification: "2024-11-03T10:15:00Z"
    },
    {
      id: 5,
      nom: "Restaurant Le Gourmet",
      adresse: "Front de Mer, Annaba 23000",
      rc: "23/00-0321654",
      nif: "345678901234",
      nis: "000023321654987",
      dateCreation: "2024-05-20T14:10:00Z",
      dateModification: "2024-10-28T17:45:00Z"
    },
    {
      id: 6,
      nom: "Garage Auto Service",
      adresse: "Route Nationale 1, Blida 09000",
      rc: "09/00-0654987",
      nif: "456789012345",
      nis: "000009654987321",
      dateCreation: "2024-06-08T12:30:00Z",
      dateModification: "2024-11-05T09:20:00Z"
    }
  ];

  // Load clients from localStorage on component mount
  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients));
      } catch (error) {
        console.error('Error loading clients from localStorage:', error);
        setClients(mockClients);
      }
    } else {
      setClients(mockClients);
    }
  }, []);

  // Save clients to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm?.trim()) return clients;
    
    const term = searchTerm?.toLowerCase();
    return clients?.filter(client => 
      client?.nom?.toLowerCase()?.includes(term) ||
      client?.adresse?.toLowerCase()?.includes(term) ||
      (client?.rc && client?.rc?.toLowerCase()?.includes(term)) ||
      (client?.nif && client?.nif?.toLowerCase()?.includes(term)) ||
      (client?.nis && client?.nis?.toLowerCase()?.includes(term))
    );
  }, [clients, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const currentMonth = new Date()?.getMonth();
    const currentYear = new Date()?.getFullYear();
    
    const newThisMonth = clients?.filter(client => {
      const creationDate = new Date(client.dateCreation);
      return creationDate?.getMonth() === currentMonth && 
             creationDate?.getFullYear() === currentYear;
    })?.length;

    return {
      totalClients: clients?.length,
      newThisMonth,
      withDocuments: Math.floor(clients?.length * 0.7), // Mock calculation
      filteredCount: filteredClients?.length
    };
  }, [clients, filteredClients]);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleUseClient = (client) => {
    // Store selected client in localStorage for document creation
    localStorage.setItem('selected-client', JSON.stringify(client));
    navigate('/document-creation');
  };

  const handleDeleteClient = (client) => {
    setDeleteConfirmation({
      isOpen: true,
      client,
      isMultiple: false,
      count: 1
    });
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      client: null,
      isMultiple: true,
      count: selectedClients?.length
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      if (deleteConfirmation?.isMultiple) {
        setClients(prev => prev?.filter(client => !selectedClients?.includes(client?.id)));
        setSelectedClients([]);
      } else {
        setClients(prev => prev?.filter(client => client?.id !== deleteConfirmation?.client?.id));
      }
      
      setDeleteConfirmation({
        isOpen: false,
        client: null,
        isMultiple: false,
        count: 0
      });
    } catch (error) {
      console.error('Error deleting client(s):', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      client: null,
      isMultiple: false,
      count: 0
    });
  };

  const handleSaveClient = async (clientData) => {
    if (editingClient) {
      setClients(prev => prev?.map(client => 
        client?.id === editingClient?.id ? clientData : client
      ));
    } else {
      setClients(prev => [...prev, clientData]);
    }
    
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleSelectClient = (clientId) => {
    setSelectedClients(prev => {
      if (prev?.includes(clientId)) {
        return prev?.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedClients?.length === filteredClients?.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients?.map(client => client?.id));
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Nom', 'Adresse', 'RC', 'NIF', 'NIS', 'Date de création'],
      ...filteredClients?.map(client => [
        client?.nom,
        client?.adresse,
        client?.rc || '',
        client?.nif || '',
        client?.nis || '',
        new Date(client.dateCreation)?.toLocaleDateString('fr-FR')
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `clients_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <SidebarNavigation 
        isOpen={isMobileMenuOpen}
        onToggle={handleSidebarToggle}
      />
      <main className={`pt-16 transition-all duration-200 ${
        isSidebarOpen ? 'md:ml-60' : 'md:ml-15'
      }`}>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground">Gestion des Clients</h1>
              <div className="flex items-center space-x-2">
                {filteredClients?.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="hidden sm:flex"
                  >
                    {selectedClients?.length === filteredClients?.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                )}
              </div>
            </div>
            <p className="text-muted-foreground">
              Gérez vos clients et leurs informations pour la création de documents
            </p>
          </div>

          <ClientStats
            totalClients={stats?.totalClients}
            newThisMonth={stats?.newThisMonth}
            withDocuments={stats?.withDocuments}
            filteredCount={stats?.filteredCount}
          />

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClient={handleAddClient}
            selectedCount={selectedClients?.length}
            onBulkDelete={handleBulkDelete}
            onExport={handleExport}
            totalClients={clients?.length}
          />

          {filteredClients?.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? 'Aucun client trouvé' : 'Aucun client enregistré'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter votre premier client'
                }
              </p>
              {!searchTerm && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddClient}
                >
                  Ajouter un client
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClients?.map((client) => (
                <ClientCard
                  key={client?.id}
                  client={client}
                  onUse={handleUseClient}
                  onEdit={handleEditClient}
                  onDelete={handleDeleteClient}
                  isSelected={selectedClients?.includes(client?.id)}
                  onSelect={handleSelectClient}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <ClientForm
        client={editingClient}
        onSave={handleSaveClient}
        onCancel={handleCancelForm}
        isOpen={isFormOpen}
      />
      <DeleteConfirmation
        isOpen={deleteConfirmation?.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        clientName={deleteConfirmation?.client?.nom}
        isMultiple={deleteConfirmation?.isMultiple}
        count={deleteConfirmation?.count}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ClientManagement;