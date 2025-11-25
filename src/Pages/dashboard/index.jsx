import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KPICard from './components/KPICard';

import FilterControls from './components/FilterControls';
import DocumentGrid from './components/DocumentGrid';
import QuickActions from './components/QuickActions';

const Dashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');

  // KPI data
  const [kpiData, setKpiData] = useState({
    totalDocuments: 0,
    totalClients: 0,
    totalAmount: 0,
    pendingDocuments: 0
  });

  // Mock data for documents
  const mockDocuments = [
    {
      id: 1,
      type: 'NOTE',
      number: '01/2025/HN',
      clientName: 'SARL ALPHA CONSTRUCTION',
      clientId: 1,
      totalAmount: 125000.00,
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: 2,
      type: 'RAPPORT',
      number: '01/2025/RP',
      clientName: 'SPA BETA INDUSTRIES',
      clientId: 2,
      totalAmount: null,
      createdAt: '2025-01-10T14:20:00Z',
      updatedAt: '2025-01-10T14:20:00Z',
      status: 'completed'
    },
    {
      id: 3,
      type: 'NOTE',
      number: '02/2025/HN',
      clientName: 'EURL GAMMA SERVICES',
      clientId: 3,
      totalAmount: 87500.00,
      createdAt: '2025-01-08T09:15:00Z',
      updatedAt: '2025-01-08T09:15:00Z',
      status: 'completed'
    },
    {
      id: 4,
      type: 'NOTE',
      number: '03/2025/HN',
      clientName: 'SNC DELTA TRADING',
      clientId: 4,
      totalAmount: 156000.00,
      createdAt: '2025-01-05T16:45:00Z',
      updatedAt: '2025-01-05T16:45:00Z',
      status: 'completed'
    },
    {
      id: 5,
      type: 'RAPPORT',
      number: '02/2025/RP',
      clientName: 'SARL EPSILON TECH',
      clientId: 5,
      totalAmount: null,
      createdAt: '2025-01-03T11:30:00Z',
      updatedAt: '2025-01-03T11:30:00Z',
      status: 'completed'
    },
    {
      id: 6,
      type: 'NOTE',
      number: '04/2025/HN',
      clientName: 'SPA ZETA LOGISTICS',
      clientId: 6,
      totalAmount: 203000.00,
      createdAt: '2024-12-28T13:20:00Z',
      updatedAt: '2024-12-28T13:20:00Z',
      status: 'completed'
    }
  ];

  // Mock data for clients
  const mockClients = [
    {
      id: 1,
      nom: 'SARL ALPHA CONSTRUCTION',
      adresse: '15 Rue des Frères Bouadou, Alger 16000',
      rc: '98/00-1234567B23',
      nif: '098765432101',
      nis: '000123456789012'
    },
    {
      id: 2,
      nom: 'SPA BETA INDUSTRIES',
      adresse: '42 Boulevard Mohamed V, Oran 31000',
      rc: '31/00-7654321A19',
      nif: '087654321098',
      nis: '000987654321098'
    },
    {
      id: 3,
      nom: 'EURL GAMMA SERVICES',
      adresse: '8 Avenue de l\'Indépendance, Constantine 25000',
      rc: '25/00-9876543C21',
      nif: '076543210987',
      nis: '000876543210987'
    },
    {
      id: 4,
      nom: 'SNC DELTA TRADING',
      adresse: '23 Rue Larbi Ben M\'hidi, Annaba 23000',
      rc: '23/00-5432109D22',
      nif: '065432109876',
      nis: '000765432109876'
    },
    {
      id: 5,
      nom: 'SARL EPSILON TECH',
      adresse: '67 Route Nationale, Sétif 19000',
      rc: '19/00-3210987E20',
      nif: '054321098765',
      nis: '000654321098765'
    },
    {
      id: 6,
      nom: 'SPA ZETA LOGISTICS',
      adresse: '91 Avenue des Martyrs, Tlemcen 13000',
      rc: '13/00-2109876F24',
      nif: '043210987654',
      nis: '000543210987654'
    }
  ];

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load from localStorage or use mock data (sync with document library)
      const savedDocuments = localStorage.getItem('documents');
      const savedClients = localStorage.getItem('clients');
      
      const loadedDocuments = savedDocuments ? JSON.parse(savedDocuments) : mockDocuments;
      const loadedClients = savedClients ? JSON.parse(savedClients) : mockClients;
      
      setDocuments(loadedDocuments);
      setClients(loadedClients);
      
      // Calculate KPI data
      const totalAmount = loadedDocuments.reduce((sum, doc) => sum + (doc.totalAmount || 0), 0);
      const pendingDocs = loadedDocuments.filter(doc => doc.status === 'draft').length;
      
      setKpiData({
        totalDocuments: loadedDocuments.length,
        totalClients: loadedClients.length,
        totalAmount: totalAmount,
        pendingDocuments: pendingDocs
      });
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter documents based on search and filter criteria
  useEffect(() => {
    let filtered = [...documents];

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(doc => 
        doc?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        doc?.number?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Document type filter
    if (documentType !== 'all') {
      filtered = filtered?.filter(doc => doc?.type === documentType);
    }

    // Client filter
    if (selectedClient !== 'all') {
      filtered = filtered?.filter(doc => doc?.clientId === parseInt(selectedClient));
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered?.filter(doc => {
        const docDate = new Date(doc.createdAt);
        
        switch (dateRange) {
          case 'today':
            return docDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return docDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return docDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
            return docDate >= quarterAgo;
          case 'year':
            const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            return docDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Sort by creation date (newest first)
    filtered?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, documentType, dateRange, selectedClient]);

  // Calculate KPIs
  const totalDocuments = documents?.length;
  const totalClients = clients?.length;
  const noteDocuments = documents?.filter(doc => doc?.type === 'NOTE')?.length;
  const rapportDocuments = documents?.filter(doc => doc?.type === 'RAPPORT')?.length;
  
  // Calculate monthly growth (mock calculation)
  const currentMonth = new Date()?.getMonth();
  const currentYear = new Date()?.getFullYear();
  const thisMonthDocs = documents?.filter(doc => {
    const docDate = new Date(doc.createdAt);
    return docDate?.getMonth() === currentMonth && docDate?.getFullYear() === currentYear;
  })?.length;

  // Event handlers
  const handleEditDocument = (document) => {
    navigate('/document-creation', { state: { editDocument: document } });
  };

  const handlePrintDocument = (document) => {
    // Mock print functionality
    console.log('Printing document:', document?.number);
    // In real implementation, this would open print dialog
  };

  const handleExportDocument = (document) => {
    // Mock export functionality
    console.log('Exporting document:', document?.number);
    // In real implementation, this would generate Word document
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDocumentType('all');
    setDateRange('all');
    setSelectedClient('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-6">
        <QuickActions />
        
        {/* KPI Cards - NOTE D'HONORAIRES Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Documents"
            value={kpiData.totalDocuments}
            icon="FileText"
            trend="up"
            trendValue={`+${thisMonthDocs} ce mois`}
            color="primary"
          />
          <KPICard
            title="Clients Actifs"
            value={kpiData.totalClients}
            icon="Users"
            trend={undefined}
            trendValue={undefined}
            color="success"
          />
          <KPICard
            title="Montant Total"
            value={`${kpiData.totalAmount.toLocaleString('fr-FR')} DA`}
            icon="DollarSign"
            trend="up"
            trendValue="+12% ce mois"
            color="warning"
          />
          <KPICard
            title="Documents en Attente"
            value={kpiData.pendingDocuments}
            icon="Clock"
            trend={kpiData.pendingDocuments > 0 ? 'up' : undefined}
            trendValue={kpiData.pendingDocuments > 0 ? 'À traiter' : undefined}
            color="secondary"
          />
        </div>

        {/* Filter Controls */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          documentType={documentType}
          onDocumentTypeChange={setDocumentType}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
          clients={clients}
          onClearFilters={handleClearFilters}
        />

        {/* Documents Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Documents Récents
              {filteredDocuments?.length !== documents?.length && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({filteredDocuments?.length} sur {documents?.length})
                </span>
              )}
            </h2>
          </div>
          
          <DocumentGrid
            documents={filteredDocuments}
            onEdit={handleEditDocument}
            onPrint={handlePrintDocument}
            onExport={handleExportDocument}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;