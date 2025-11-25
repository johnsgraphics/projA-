import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import Icon from '../../components/AppIcon';
import FirmInformationTab from './components/FirmInformationTab';
import DocumentThemesTab from './components/DocumentThemesTab';
import PreferencesTab from './components/PreferencesTab';


const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('firm');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Settings data state
  const [firmData, setFirmData] = useState({
    cabinetName: 'Cabinet Comptable Alger',
    title: 'Commissaire aux Comptes',
    address: '15 Rue Didouche Mourad, Alger 16000, Algérie',
    agrement: 'AGR-2023-001',
    nif: '099916000123456',
    nis: '000116000123456',
    ai: '16000123456001',
    bankName: 'Banque d\'Algérie',
    bankAccount: '00799999000123456789',
    bankAddress: 'Agence Centrale, 38 Avenue Franklin Roosevelt, Alger',
    logo: null,
    logoPreview: null,
    logoSize: 90
  });


  const [selectedTheme, setSelectedTheme] = useState('bluewave');
  
  const [preferences, setPreferences] = useState({
    defaultNoteTemplate: `Objet : Note d'honoraires pour services comptables\n\nNous avons l'honneur de vous présenter notre note d'honoraires pour les services comptables rendus.\n\nVeuillez trouver ci-dessous le détail de nos prestations :`,defaultRapportTemplate: `RAPPORT SPÉCIAL SUR L'AUGMENTATION DU CAPITAL SOCIAL\n\nEn notre qualité de Commissaire aux Comptes de votre société, nous avons l'honneur de vous présenter notre rapport spécial sur l'opération d'augmentation du capital social.\n\nCette opération s'inscrit dans le cadre du développement de votre activité et du renforcement de vos fonds propres.`,
    numberFormat: 'french',
    dateFormat: 'dd/mm/yyyy',
    currency: 'DA',
    autoSave: true,
    autoNumbering: true,
    printMargins: 'normal',
    pageSize: 'A4',
    defaultLanguage: 'fr'
  });


  const tabs = [
    {
      id: 'firm',
      label: 'Informations du Cabinet',
      icon: 'Building2',
      description: 'Gérer les informations légales et bancaires'
    },
    {
      id: 'themes',
      label: 'Thèmes de Documents',
      icon: 'Palette',
      description: 'Personnaliser l\'apparence des documents'
    },
    {
      id: 'preferences',
      label: 'Préférences',
      icon: 'Settings2',
      description: 'Configurer les paramètres de l\'application'
    }
  ];


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  useEffect(() => {
    // Load settings from localStorage
    const savedFirmData = localStorage.getItem('cabinetdoc-firm-data');
    const savedTheme = localStorage.getItem('cabinetdoc-theme');
    const savedPreferences = localStorage.getItem('cabinetdoc-preferences');


    if (savedFirmData) {
      const parsed = JSON.parse(savedFirmData);
      setFirmData({
        ...parsed,
        logoSize: parsed?.logoSize || 90
      });
    }
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);


  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const handleFirmDataUpdate = (newData) => {
    setFirmData(newData);
    localStorage.setItem('cabinetdoc-firm-data', JSON.stringify(newData));
  };


  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    localStorage.setItem('cabinetdoc-theme', newTheme);
  };


  const handlePreferencesUpdate = (newPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cabinetdoc-preferences', JSON.stringify(newPreferences));
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'firm':
        return (
          <FirmInformationTab
            firmData={firmData}
            onUpdate={handleFirmDataUpdate}
          />
        );
      case 'themes':
        return (
          <DocumentThemesTab
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
        );
      case 'preferences':
        return (
          <PreferencesTab
            preferences={preferences}
            onUpdate={handlePreferencesUpdate}
          />
        );
      default:
        return null;
    }
  };


  return (
    <>
      <Helmet>
        <title>Paramètres - CabinetDoc Pro</title>
        <meta name="description" content="Configurez les paramètres de votre cabinet, personnalisez les thèmes de documents et gérez vos préférences d'application." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        <SidebarNavigation 
          isOpen={isMobileMenuOpen}
          onToggle={setIsMobileMenuOpen}
        />


        <main className={`pt-16 transition-all duration-200 ${
          isMobile ? 'ml-0' : 'ml-15'
        }`}>
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Settings" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
                  <p className="text-muted-foreground">
                    Configurez votre cabinet et personnalisez l'application
                  </p>
                </div>
              </div>
            </div>


            {/* Settings Container */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Tab Navigation */}
              {isMobile ? (
                // Mobile Accordion Style
                (<div className="divide-y divide-border">
                  {tabs?.map((tab) => (
                    <div key={tab?.id}>
                      <button
                        onClick={() => setActiveTab(activeTab === tab?.id ? '' : tab?.id)}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                          activeTab === tab?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon name={tab?.icon} size={20} />
                          <div>
                            <div className="font-medium">{tab?.label}</div>
                            <div className={`text-sm ${
                              activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            }`}>
                              {tab?.description}
                            </div>
                          </div>
                        </div>
                        <Icon 
                          name={activeTab === tab?.id ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                        />
                      </button>
                      
                      {activeTab === tab?.id && (
                        <div className="p-6 bg-background">
                          {renderTabContent()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>)
              ) : (
                // Desktop Tab Style
                (<>
                  <div className="border-b border-border">
                    <nav className="flex space-x-8 px-6">
                      {tabs?.map((tab) => (
                        <button
                          key={tab?.id}
                          onClick={() => setActiveTab(tab?.id)}
                          className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab?.id
                              ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                          }`}
                        >
                          <Icon name={tab?.icon} size={16} />
                          <span>{tab?.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                  <div className="p-6">
                    {renderTabContent()}
                  </div>
                </>)
              )}
            </div>


            {/* Help Section */}
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="HelpCircle" size={20} color="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Besoin d'aide ?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Les paramètres sont automatiquement sauvegardés et appliqués à tous vos nouveaux documents. 
                    Les documents existants conservent leurs paramètres d'origine.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="Info" size={14} className="text-accent" />
                      <span>Les informations du cabinet sont requises pour générer des documents valides</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Info" size={14} className="text-accent" />
                      <span>Le thème sélectionné s'applique à tous les nouveaux documents créés</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Info" size={14} className="text-accent" />
                      <span>Les préférences de formatage affectent l'affichage des nombres et dates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};


export default SettingsManagement;
