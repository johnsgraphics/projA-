import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import ClientSelector from './components/ClientSelector';
import NoteHonorairesForm from './components/NoteHonorairesForm';
import RapportSpecialForm from './components/RapportSpecialForm';
import DocumentPreview from './components/DocumentPreview';
import ActionButtons from './components/ActionButtons';
import ThemeSelector from './components/ThemeSelector';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { generateDocumentNumber, validateDocument, generateWordDocument } from '../../utils/documentUtils';
import { generateRapportSpecialWord } from '../../utils/wordGenerator';
import { generateRapportSpecialPDF } from '../../utils/pdfGenerator';
import { validateRapportSpecial } from '../../utils/documentValidation';

import { createPortal } from 'react-dom';

const PrintPortal = ({ children }) => {
  const mountNode = document.body;
  return createPortal(
    <div id="print-mount" className="hidden print:block">
      {children}
    </div>,
    mountNode
  );
};

const DocumentCreation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('editor');
  const [isMobile, setIsMobile] = useState(false);
  const [logoSize, setLogoSize] = useState(90);
  const [manualResize, setManualResize] = useState(false);

  // Form state
  const [documentType, setDocumentType] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('BlueWave');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Note d'Honoraires form data
  const [noteFormData, setNoteFormData] = useState({
    documentNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    servicePeriod: '',
    lineItems: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    tvaRate: 0,
    notes: '',
    paymentTerms: 'Paiement à 30 jours',
  });

  // Rapport Special form data
  const [rapportFormData, setRapportFormData] = useState({
    reportNumber: '',
    reportDate: new Date().toISOString().split('T')[0],
    missionObject: 'Augmentation du capital social',
    capitalIncrease: '',
    table1: [],
    table2: [],
  });

  // Load clients and firm data from localStorage
  const getClients = () => {
    return JSON.parse(localStorage.getItem('clients') || '[]');
  };

  const getFirmData = () => {
    const v2 = JSON.parse(localStorage.getItem('cabinetdoc-firm-data') || '{}');
    const legacy = JSON.parse(localStorage.getItem('firmSettings') || '{}');
    return {
      name: v2?.cabinetName || legacy?.companyName || 'CABINET DE COMPTABILITÉ',
      title: v2?.title || legacy?.companyTitle || 'MME KEBAILI Amal',
      address: v2?.address || legacy?.address || 'cité 13 Hectars 96 logts N°10 BARAKI',
      agrement: v2?.agrement || legacy?.agrement || 'N°4057/2019',
      nif: v2?.nif || legacy?.nif || '27716050093014741680',
      nis: v2?.nis || legacy?.nis || '29716050093031',
      ai: v2?.ai || legacy?.ai || 'N° 16149780121',
      bankName: v2?.bankName || legacy?.bankName || 'BNA - Banque Nationale d\'Algérie',
      rib: v2?.rib || legacy?.rib || '007 00123 0123456789 12',
      bankAddress: v2?.bankAddress || legacy?.bankAddress || 'Agence Alger Centre'
    };
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load pre-selected client from localStorage
  useEffect(() => {
    const savedSelectedClient = localStorage.getItem('selected-client');
    if (savedSelectedClient) {
      try {
        const clientData = JSON.parse(savedSelectedClient);
        setSelectedClient(clientData.id);
        // Clear the saved selection after loading
        localStorage.removeItem('selected-client');
      } catch (error) {
        console.error('Error loading selected client:', error);
      }
    }
  }, []);

  // Generate document number when type changes
  useEffect(() => {
    if (documentType) {
      const number = generateDocumentNumber(documentType);
      if (documentType === 'NOTE_HONORAIRES') {
        setNoteFormData(prev => ({ ...prev, documentNumber: number }));
      } else {
        setRapportFormData(prev => ({ ...prev, reportNumber: number }));
      }
    }
  }, [documentType]);

  const handleNoteFormChange = (field, value) => {
    setNoteFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation errors when user makes changes
    if (validationErrors?.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleRapportFormChange = (field, value) => {
    setRapportFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation errors when user makes changes
    if (validationErrors?.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleAddLineItem = () => {
    const newItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setNoteFormData(prev => ({
      ...prev,
      lineItems: [...prev?.lineItems, newItem]
    }));
  };

  const handleRemoveLineItem = (index) => {
    if (noteFormData?.lineItems?.length > 1) {
      setNoteFormData(prev => ({
        ...prev,
        lineItems: prev?.lineItems?.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = async () => {
    // Validate document
    const currentFormData = documentType === 'NOTE_HONORAIRES' ? noteFormData : rapportFormData;
    const currentClientData = getSelectedClientData();
    const errors = validateDocument(documentType, currentFormData, currentClientData);

    if (errors?.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const documentData = {
        id: Date.now(),
        type: documentType,
        client: selectedClient,
        theme: selectedTheme,
        formData: currentFormData,
        clientData: currentClientData,
        firmData: getFirmData(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
      existingDocuments?.push(documentData);
      localStorage.setItem('documents', JSON.stringify(existingDocuments));

      // Navigate to document library
      navigate('/documents');
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Scroll Sync Refs
  const editorRef = React.useRef(null);
  const previewRef = React.useRef(null);

  // Synchronized Scrolling
  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    const handleScroll = () => {
      if (!manualResize) { // Only sync if not in manual resize mode (optional check)
        const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
        preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
      }
    };

    editor.addEventListener('scroll', handleScroll);
    return () => editor.removeEventListener('scroll', handleScroll);
  }, [manualResize]);

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      if (documentType === 'RAPPORT_SPECIAL') {
        const currentClientData = getSelectedClientData();
        const firmData = getFirmData();
        // Use new generator
        await generateRapportSpecialWord(rapportFormData, currentClientData, firmData, getFirmData());
      } else {
        // Fallback for Note Honoraires (keep existing)
        const previewElement = document.querySelector('.print-area');
        if (previewElement) {
          generateWordDocument(previewElement.outerHTML, `Note_${noteFormData.documentNumber}`);
        }
      }
    } catch (error) {
      console.error('Error exporting Word:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const filename = `${documentType === 'NOTE_HONORAIRES' ? noteFormData?.documentNumber : rapportFormData?.reportNumber}.pdf`;
      // Use the ID we added to DocumentPreview
      await generateRapportSpecialPDF('document-preview-content', filename.replace(/\//g, '-'));
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    // Add print class to body to trigger print styles
    document.body?.classList?.add('printing');
    window.print();
    // Remove print class after printing
    setTimeout(() => {
      document.body?.classList?.remove('printing');
    }, 1000);
  };

  const handlePreview = () => {
    if (isMobile) {
      setActiveTab('preview');
    }
  };

  const getCurrentFormData = () => {
    return documentType === 'NOTE_HONORAIRES' ? noteFormData : rapportFormData;
  };

  const getSelectedClientData = () => {
    if (!selectedClient) return null;
    const clients = getClients();
    return clients?.find(client => client?.id === selectedClient) || null;
  };

  const canSave = documentType && selectedClient && validationErrors?.length === 0;
  const canPrint = canSave;
  const canExport = canSave;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowLeft"
            onClick={() => navigate('/dashboard')}
          />
          <h1 className="text-2xl font-bold text-foreground">Création de Document</h1>
        </div>
        <p className="text-muted-foreground">
          Créez et gérez vos notes d'honoraires et rapports spéciaux avec aperçu en temps réel
        </p>
      </div>
      {/* Validation Errors */}
      {validationErrors?.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertCircle" size={20} className="text-destructive" />
            <h3 className="font-medium text-destructive">Erreurs de validation</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
            {validationErrors?.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Action Buttons */}
      <div className="mb-6">
        <ActionButtons
          onSave={handleSave}
          onExport={handleExportWord}
          onExportPDF={handleExportPDF}
          onPrint={handlePrint}
          onPreview={handlePreview}
          isSaving={isSaving}
          isExporting={isExporting}
          canSave={canSave}
          canPrint={canPrint}
          canExport={canExport}
        />
      </div>
      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="flex mb-6 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'editor' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Icon name="Edit3" size={16} className="inline mr-2" />
            Éditeur
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Icon name="Eye" size={16} className="inline mr-2" />
            Aperçu
          </button>
        </div>
      )}
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div
          ref={editorRef}
          className={`space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 ${isMobile && activeTab !== 'editor' ? 'hidden' : ''}`}
        >
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Configuration du Document</h2>

            <DocumentTypeSelector
              value={documentType}
              onChange={setDocumentType}
            />

            <ClientSelector
              value={selectedClient}
              onChange={setSelectedClient}
              clients={getClients()}
            />

            <ThemeSelector
              value={selectedTheme}
              onChange={setSelectedTheme}
            />
          </div>

          {/* Dynamic Form */}
          {documentType && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                {documentType === 'NOTE_HONORAIRES' ? 'Note d\'Honoraires' : 'Rapport Spécial'}
              </h2>

              {documentType === 'NOTE_HONORAIRES' ? (
                <NoteHonorairesForm
                  formData={noteFormData}
                  onChange={handleNoteFormChange}
                  onAddLineItem={handleAddLineItem}
                  onRemoveLineItem={handleRemoveLineItem}
                />
              ) : (
                <RapportSpecialForm
                  formData={rapportFormData}
                  onChange={handleRapportFormChange}
                />
              )}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className={`${isMobile && activeTab !== 'preview' ? 'hidden' : ''}`}>
          <div className="bg-card border border-border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Aperçu A4</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Monitor" size={16} />
                <span>210mm × 297mm</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <label htmlFor="logo-size-range" className="text-xs mr-2" style={{ direction: 'rtl' }}>
                حجم الشعار (px)
              </label>
              <input
                id="logo-size-range"
                type="range"
                min="40"
                max="200"
                value={logoSize}
                style={{ width: '180px' }}
                onChange={(e) => setLogoSize(Number(e.target.value))}
              />
              <span className="ml-2 text-xs">{logoSize}px</span>
              <div className="ml-6 flex items-center gap-2">
                <label htmlFor="manual-resize" className="text-xs">وضع التعديل بالماوس</label>
                <input
                  id="manual-resize"
                  type="checkbox"
                  checked={manualResize}
                  onChange={(e) => setManualResize(e.target.checked)}
                />
              </div>
            </div>

            {/* Wave controls removed per request */}
          </div>

          <div ref={previewRef} className="overflow-auto max-h-[calc(100vh-200px)] bg-gray-100 rounded-lg p-4">
            <div className="transform scale-75 origin-top print:transform-none print:scale-100">
              <DocumentPreview
                formData={getCurrentFormData()}
                clientData={getSelectedClientData()}
                firmData={{ ...getFirmData(), logoSize }}
                documentType={documentType}
                previewMode={false}
                resizeMode={manualResize}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print Portal */}
      <PrintPortal>
        <div className="print-only-container">
          <DocumentPreview
            formData={getCurrentFormData()}
            clientData={getSelectedClientData()}
            firmData={{ ...getFirmData(), logoSize }}
            documentType={documentType}
            previewMode={false}
            resizeMode={false}
          />
        </div>
      </PrintPortal>
    </div>
  );
};

export default DocumentCreation;