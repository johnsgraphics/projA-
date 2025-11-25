import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import DocumentTable from './components/DocumentTable';
import DocumentFilters from './components/DocumentFilters';
import DocumentCard from './components/DocumentCard';
import BulkActions from './components/BulkActions';
import DocumentPreviewModal from './components/DocumentPreviewModal';

const DocumentLibrary = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table');
  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    clientId: '',
    status: '',
    startDate: '',
    endDate: '',
    documentNumber: ''
  });

  // Mock data for documents
  const mockDocuments = [
    {
      id: "doc_001",
      type: "NOTE",
      documentNumber: "01/2025/HN",
      clientName: "SARL ALPHA CONSTRUCTION",
      clientId: "client_001",
      clientAddress: "Zone Industrielle, Rue des Entrepreneurs, 16000 Alger",
      clientRC: "16/00-123456B25",
      clientNIF: "000016123456789",
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-01-15T14:20:00Z",
      status: "completed",
      totalAmount: 125000,
      description: "Audit comptable annuel et certification des comptes",
      lineItems: [
        {
          description: "Audit comptable annuel",
          quantity: 1,
          unitPrice: 100000
        },
        {
          description: "Certification des comptes",
          quantity: 1,
          unitPrice: 25000
        }
      ],
      notes: "Audit réalisé selon les normes comptables algériennes"
    },
    {
      id: "doc_002",
      type: "RAPPORT",
      documentNumber: "01/2025/RP",
      clientName: "SPA BETA INDUSTRIES",
      clientId: "client_002",
      clientAddress: "Boulevard Mohamed V, 31000 Oran",
      clientRC: "31/00-987654B25",
      clientNIF: "000031987654321",
      createdAt: "2025-01-20T09:15:00Z",
      updatedAt: "2025-01-22T16:45:00Z",
      status: "draft",
      description: "Rapport spécial sur l\'augmentation du capital social de 5.000.000 DA à 15.000.000 DA",
      notes: "Rapport en cours de finalisation, validation en attente"
    },
    {
      id: "doc_003",
      type: "NOTE",
      documentNumber: "02/2025/HN",
      clientName: "EURL GAMMA SERVICES",
      clientId: "client_003",
      clientAddress: "Cité El Badr, 25000 Constantine",
      clientRC: "25/00-456789B25",
      clientNIF: "000025456789012",
      createdAt: "2025-01-25T11:00:00Z",
      updatedAt: "2025-01-25T11:00:00Z",
      status: "completed",
      totalAmount: 75000,
      description: "Révision comptable trimestrielle",
      lineItems: [
        {
          description: "Révision des comptes Q4 2024",
          quantity: 1,
          unitPrice: 75000
        }
      ]
    },
    {
      id: "doc_004",
      type: "RAPPORT",
      documentNumber: "02/2025/RP",
      clientName: "SARL DELTA TRADING",
      clientId: "client_004",
      clientAddress: "Zone Commerciale, 09000 Blida",
      clientRC: "09/00-789012B25",
      clientNIF: "000009789012345",
      createdAt: "2025-02-01T14:30:00Z",
      updatedAt: "2025-02-03T10:15:00Z",
      status: "archived",
      description: "Rapport d'évaluation des actifs immobiliers"
    },
    {
      id: "doc_005",
      type: "NOTE",
      documentNumber: "03/2025/HN",
      clientName: "SNC EPSILON CONSULTING",
      clientId: "client_005",
      clientAddress: "Rue Larbi Ben M'hidi, 19000 Sétif",
      clientRC: "19/00-345678B25",
      clientNIF: "000019345678901",
      createdAt: "2025-02-05T08:45:00Z",
      updatedAt: "2025-02-05T17:30:00Z",
      status: "completed",
      totalAmount: 200000,
      description: "Mission d\'expertise comptable complète",
      lineItems: [
        {
          description: "Tenue de comptabilité mensuelle",
          quantity: 12,
          unitPrice: 15000
        },
        {
          description: "Établissement des déclarations fiscales",
          quantity: 1,
          unitPrice: 20000
        }
      ]
    }
  ];

  // Mock data for clients
  const mockClients = [
    {
      id: "client_001",
      nom: "SARL ALPHA CONSTRUCTION"
    },
    {
      id: "client_002", 
      nom: "SPA BETA INDUSTRIES"
    },
    {
      id: "client_003",
      nom: "EURL GAMMA SERVICES"
    },
    {
      id: "client_004",
      nom: "SARL DELTA TRADING"
    },
    {
      id: "client_005",
      nom: "SNC EPSILON CONSULTING"
    }
  ];

  useEffect(() => {
    // Load documents and clients from localStorage or use mock data
    const savedDocuments = localStorage.getItem('documents');
    const savedClients = localStorage.getItem('clients');
    
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    } else {
      setDocuments(mockDocuments);
      localStorage.setItem('documents', JSON.stringify(mockDocuments));
    }

    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      setClients(mockClients);
      localStorage.setItem('clients', JSON.stringify(mockClients));
    }
  }, []);

  useEffect(() => {
    // Apply filters to documents
    let filtered = documents?.filter(doc => {
      const matchesSearch = !filters?.search || 
        doc?.clientName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        doc?.documentNumber?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        doc?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase());

      const matchesType = !filters?.type || doc?.type === filters?.type;
      const matchesClient = !filters?.clientId || doc?.clientId === filters?.clientId;
      const matchesStatus = !filters?.status || doc?.status === filters?.status;
      const matchesDocNumber = !filters?.documentNumber || 
        doc?.documentNumber?.toLowerCase()?.includes(filters?.documentNumber?.toLowerCase());

      const matchesDateRange = (!filters?.startDate || new Date(doc.createdAt) >= new Date(filters.startDate)) &&
        (!filters?.endDate || new Date(doc.createdAt) <= new Date(filters.endDate));

      return matchesSearch && matchesType && matchesClient && matchesStatus && 
             matchesDocNumber && matchesDateRange;
    });

    setFilteredDocuments(filtered);
  }, [documents, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: '',
      clientId: '',
      status: '',
      startDate: '',
      endDate: '',
      documentNumber: ''
    });
  };

  const handleSelectDocument = (documentId) => {
    setSelectedDocuments(prev => 
      prev?.includes(documentId) 
        ? prev?.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments?.length === filteredDocuments?.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments?.map(doc => doc?.id));
    }
  };

  const handleView = (document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  const handleEdit = (document) => {
    navigate('/document-creation', { 
      state: { 
        editDocument: document,
        documentType: document?.type 
      } 
    });
  };

  const handleDuplicate = (document) => {
    const duplicatedDoc = {
      ...document,
      id: `doc_${Date.now()}`,
      documentNumber: generateDocumentNumber(document?.type),
      createdAt: new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString(),
      status: 'draft'
    };

    const updatedDocuments = [...documents, duplicatedDoc];
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  };

  const handlePrint = (document) => {
    // Get the actual logo from localStorage (new store first, then legacy)
    const v2 = JSON.parse(localStorage.getItem('cabinetdoc-firm-data') || '{}');
    const legacy = JSON.parse(localStorage.getItem('firmSettings') || '{}');
    const logoUrl = v2?.logoPreview || v2?.logo || legacy?.logo || null;
    // Use saved logo size (default 90px if not set)
    const logoSize = v2?.logoSize || 90;

    // Create a proper document preview for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Impression - ${document?.documentNumber}</title>
          <meta charset="utf-8">
          <style>
            @page { size: A4; margin: 8mm 12mm; }
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0;
              padding: 0;
              background: white;
              color: black;
              line-height: 1.4;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .print-area {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
            }
            .header { 
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px; 
              padding: 16px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .logo {
              width: ${logoSize}px;
              height: ${logoSize}px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              background: transparent;
              border: none;
            }
            .logo img { width: 100%; height: 100%; object-fit: cover; }
            .company-info { text-align: left; direction: ltr; }
            .document-title { text-align: right; }
          </style>
        </head>
        <body>
          <div class="print-area">
            <div class="header">
              <div class="logo-section">
                <div class="logo">
                  ${logoUrl ? `<img src="${logoUrl}" alt="Logo" />` : `<span style="font-size:10px;color:#888">شعار الشركة</span>`}
                </div>
                <div class="company-info">
                  <strong style="white-space:pre-line">${document?.firmName || 'CABINET DE COMPTABILITÉ ET DE COMMISSAIRE AUX COMPTES'}</strong><br>
                  <span>${document?.accountantName || document?.firmTitle || ''}</span>
                </div>
              </div>
              <div class="document-title">
                <h2 style="margin:0">${document?.documentType === 'NOTE' ? 'NOTE D\'HONORAIRES' : 'RAPPORT SPÉCIAL'}</h2>
                <small>${document?.documentNumber || ''}</small>
              </div>
            </div>
            ${document?.htmlContent || ''}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExport = (document) => {
    // Simple Word export simulation
    const content = `
      ${document?.type === 'NOTE' ? 'NOTE D\'HONORAIRES' : 'RAPPORT SPÉCIAL'}
      N° ${document?.documentNumber}
      
      Date: ${new Date(document.createdAt)?.toLocaleDateString('fr-FR')}
      Client: ${document?.clientName}
      ${document?.clientAddress ? `Adresse: ${document?.clientAddress}` : ''}
      
      ${document?.description || ''}
      
      ${document?.lineItems ? document?.lineItems?.map(item => 
        `${item?.description} - Quantité: ${item?.quantity} - Prix: ${item?.unitPrice?.toLocaleString('fr-FR')} DA`
      )?.join('\n') : ''}
      
      ${document?.totalAmount ? `Total: ${document?.totalAmount?.toLocaleString('fr-FR')} DA` : ''}
    `;

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document?.createElement('a');
    a.href = url;
    a.download = `${document?.documentNumber}.doc`;
    document?.body?.appendChild(a);
    a?.click();
    document?.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (document) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le document ${document?.documentNumber} ?`)) {
      const updatedDocuments = documents?.filter(doc => doc?.id !== document?.id);
      
      // Renumber documents of the same type
      const renumberedDocuments = renumberDocuments(updatedDocuments, document?.type);
      
      setDocuments(renumberedDocuments);
      localStorage.setItem('documents', JSON.stringify(renumberedDocuments));
      setSelectedDocuments(prev => prev?.filter(id => id !== document?.id));
    }
  };

  const handleBulkExport = async (documentIds) => {
    // Simulate bulk export
    return new Promise((resolve) => {
      setTimeout(() => {
        const selectedDocs = documents.filter(doc => documentIds.includes(doc.id));
        const content = selectedDocs.map(doc => `
          ${doc.type === 'NOTE' ? 'NOTE D\'HONORAIRES' : 'RAPPORT SPÉCIAL'}
          N° ${doc.documentNumber}
          Client: ${doc.clientName}
          Date: ${new Date(doc.createdAt).toLocaleDateString('fr-FR')}
          ${doc.description || ''}
          ${doc.totalAmount ? `Total: ${doc.totalAmount.toLocaleString('fr-FR')} DA` : ''}
        `).join('\n\n---\n\n');

        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documents_export_${new Date().toISOString().split('T')[0]}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        resolve();
      }, 1000);
    });
  };

  const handleBulkArchive = (documentIds) => {
    const updatedDocuments = documents?.map(doc => 
      documentIds?.includes(doc?.id) 
        ? { ...doc, status: 'archived', updatedAt: new Date()?.toISOString() }
        : doc
    );
    
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    setSelectedDocuments([]);
  };

  const handleBulkDelete = (documentIds) => {
    const updatedDocuments = documents?.filter(doc => !documentIds?.includes(doc?.id));
    
    // Renumber all document types
    const renumberedDocuments = renumberAllDocuments(updatedDocuments);
    
    setDocuments(renumberedDocuments);
    localStorage.setItem('documents', JSON.stringify(renumberedDocuments));
    setSelectedDocuments([]);
  };

  const generateDocumentNumber = (type) => {
    const year = new Date()?.getFullYear();
    const typeCode = type === 'NOTE' ? 'HN' : 'RP';
    const existingNumbers = documents?.filter(doc => doc?.type === type && doc?.documentNumber?.includes(year))?.map(doc => parseInt(doc?.documentNumber?.split('/')?.[0]))?.sort((a, b) => a - b);
    
    let nextNumber = 1;
    for (let i = 0; i < existingNumbers?.length; i++) {
      if (existingNumbers?.[i] === nextNumber) {
        nextNumber++;
      } else {
        break;
      }
    }
    
    return `${nextNumber?.toString()?.padStart(2, '0')}/${year}/${typeCode}`;
  };

  const renumberDocuments = (docs, type) => {
    const docsOfType = docs?.filter(doc => doc?.type === type);
    const otherDocs = docs?.filter(doc => doc?.type !== type);
    
    // Group by year
    const docsByYear = docsOfType?.reduce((acc, doc) => {
      const year = new Date(doc.createdAt)?.getFullYear();
      if (!acc?.[year]) acc[year] = [];
      acc?.[year]?.push(doc);
      return acc;
    }, {});
    
    // Renumber each year group
    const renumberedDocs = [];
    Object.keys(docsByYear)?.forEach(year => {
      const yearDocs = docsByYear?.[year]?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      yearDocs?.forEach((doc, index) => {
        const typeCode = type === 'NOTE' ? 'HN' : 'RP';
        const newNumber = `${(index + 1)?.toString()?.padStart(2, '0')}/${year}/${typeCode}`;
        renumberedDocs?.push({
          ...doc,
          documentNumber: newNumber
        });
      });
    });
    
    return [...renumberedDocs, ...otherDocs];
  };

  const renumberAllDocuments = (docs) => {
    let result = docs;
    result = renumberDocuments(result, 'NOTE');
    result = renumberDocuments(result, 'RAPPORT');
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bibliothèque de Documents</h1>
            <p className="text-muted-foreground mt-2">
              Gérez et organisez tous vos documents comptables
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                iconName="Table"
                onClick={() => setViewMode('table')}
                className="h-8 w-8 p-0"
              />
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                iconName="Grid3X3"
                onClick={() => setViewMode('cards')}
                className="h-8 w-8 p-0"
              />
            </div>
            
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => navigate('/document-creation')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Nouveau Document
            </Button>
          </div>
        </div>

        <DocumentFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          clients={clients}
          documentCount={filteredDocuments?.length}
          selectedCount={selectedDocuments?.length}
        />

        {viewMode === 'table' ? (
          <DocumentTable
            documents={filteredDocuments}
            onView={handleView}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onPrint={handlePrint}
            onExport={handleExport}
            onDelete={handleDelete}
            selectedDocuments={selectedDocuments}
            onSelectDocument={handleSelectDocument}
            onSelectAll={handleSelectAll}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments?.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={handleView}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onPrint={handlePrint}
                onExport={handleExport}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <BulkActions
          selectedDocuments={selectedDocuments}
          onBulkExport={handleBulkExport}
          onBulkArchive={handleBulkArchive}
          onBulkDelete={handleBulkDelete}
          onClearSelection={() => setSelectedDocuments([])}
        />

        <DocumentPreviewModal
          document={previewDocument}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewDocument(null);
          }}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default DocumentLibrary;