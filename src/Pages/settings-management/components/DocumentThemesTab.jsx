import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DocumentThemesTab = ({ selectedTheme, onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('bluewave');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const themes = [
    {
      id: 'bluewave',
      name: 'BlueWave',
      description: 'Thème moderne avec bannière turquoise courbée et éléments arrondis',
      isDefault: true,
      preview: {
        headerColor: '#2DD4BF',
        backgroundColor: '#FFFFFF',
        accentColor: '#0F766E',
        borderRadius: '8px'
      },
      features: [
        'Bannière turquoise courbée',
        'Boîtes à coins arrondis',
        'Badges colorés pour les totaux',
        'Design moderne et professionnel'
      ]
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Style traditionnel d\'entreprise avec lignes droites et couleurs sobres',
      isDefault: false,
      preview: {
        headerColor: '#374151',
        backgroundColor: '#FFFFFF',
        accentColor: '#1F2937',
        borderRadius: '0px'
      },
      features: [
        'Design traditionnel d\'entreprise',
        'Lignes droites et angles nets',
        'Couleurs sobres et professionnelles',
        'Mise en page classique'
      ]
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Approche épurée avec espacement généreux et typographie claire',
      isDefault: false,
      preview: {
        headerColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
        accentColor: '#6B7280',
        borderRadius: '4px'
      },
      features: [
        'Design minimaliste et épuré',
        'Espacement généreux',
        'Typographie claire et lisible',
        'Focus sur le contenu'
      ]
    }
  ];

  useEffect(() => {
    if (selectedTheme) {
      setCurrentTheme(selectedTheme);
    }
  }, [selectedTheme]);

  const handleThemeSelect = (themeId) => {
    setCurrentTheme(themeId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('');

    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onThemeChange(currentTheme);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const ThemePreview = ({ theme }) => (
    <div className="w-full h-48 border border-border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div 
        className="h-12 flex items-center px-4"
        style={{ 
          backgroundColor: theme?.preview?.headerColor,
          borderRadius: theme?.id === 'bluewave' ? '0 0 16px 16px' : '0'
        }}
      >
        <div className="w-16 h-3 bg-white/20 rounded"></div>
        <div className="ml-auto w-20 h-3 bg-white/20 rounded"></div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 space-y-3">
        {/* Info Boxes */}
        <div className="flex space-x-2">
          <div 
            className="flex-1 h-16 bg-gray-50 border border-gray-200 p-2"
            style={{ borderRadius: theme?.preview?.borderRadius }}
          >
            <div className="w-12 h-2 bg-gray-300 rounded mb-1"></div>
            <div className="w-16 h-2 bg-gray-300 rounded"></div>
          </div>
          <div 
            className="flex-1 h-16 bg-gray-50 border border-gray-200 p-2"
            style={{ borderRadius: theme?.preview?.borderRadius }}
          >
            <div className="w-12 h-2 bg-gray-300 rounded mb-1"></div>
            <div className="w-16 h-2 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        {/* Table Header */}
        <div 
          className="h-6 flex items-center px-2"
          style={{ 
            backgroundColor: theme?.preview?.headerColor,
            borderRadius: theme?.preview?.borderRadius
          }}
        >
          <div className="w-20 h-2 bg-white/30 rounded"></div>
          <div className="ml-auto w-12 h-2 bg-white/30 rounded"></div>
        </div>
        
        {/* Table Rows */}
        <div className="space-y-1">
          <div className="flex items-center px-2 h-4">
            <div className="w-24 h-2 bg-gray-300 rounded"></div>
            <div className="ml-auto w-8 h-2 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center px-2 h-4">
            <div className="w-20 h-2 bg-gray-300 rounded"></div>
            <div className="ml-auto w-10 h-2 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        {/* Total */}
        <div className="flex justify-end">
          <div 
            className="px-3 py-1 text-xs text-white rounded-full"
            style={{ 
              backgroundColor: theme?.preview?.accentColor,
              borderRadius: theme?.id === 'bluewave' ? '20px' : theme?.preview?.borderRadius
            }}
          >
            Total
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {themes?.map((theme) => (
          <div
            key={theme?.id}
            className={`bg-card border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              currentTheme === theme?.id
                ? 'border-primary shadow-lg'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleThemeSelect(theme?.id)}
          >
            {/* Theme Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">{theme?.name}</h3>
                {theme?.isDefault && (
                  <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                    Défaut
                  </span>
                )}
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                currentTheme === theme?.id
                  ? 'border-primary bg-primary' :'border-border'
              }`}>
                {currentTheme === theme?.id && (
                  <Icon name="Check" size={12} color="white" />
                )}
              </div>
            </div>
            
            {/* Theme Preview */}
            <ThemePreview theme={theme} />
            
            {/* Theme Description */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-3">
                {theme?.description}
              </p>
              
              {/* Features */}
              <div className="space-y-1">
                {theme?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-muted-foreground">
                    <Icon name="Check" size={12} className="mr-2 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Theme Comparison */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Eye" size={20} className="mr-2 text-primary" />
          Aperçu des Différences
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">Caractéristique</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">BlueWave</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">Classic</th>
                <th className="text-center py-3 px-4 font-medium text-foreground">Minimal</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-3 px-4">Couleur principale</td>
                <td className="text-center py-3 px-4">Turquoise</td>
                <td className="text-center py-3 px-4">Gris foncé</td>
                <td className="text-center py-3 px-4">Gris clair</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Coins arrondis</td>
                <td className="text-center py-3 px-4">
                  <Icon name="Check" size={16} className="text-success mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Icon name="X" size={16} className="text-error mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Icon name="Minus" size={16} className="text-muted-foreground mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">Style bannière</td>
                <td className="text-center py-3 px-4">Courbée</td>
                <td className="text-center py-3 px-4">Droite</td>
                <td className="text-center py-3 px-4">Subtile</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Compatibilité impression</td>
                <td className="text-center py-3 px-4">
                  <Icon name="Check" size={16} className="text-success mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Icon name="Check" size={16} className="text-success mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Icon name="Check" size={16} className="text-success mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Save Section */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-2">
          {saveStatus === 'success' && (
            <>
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success">Thème sauvegardé</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error">Erreur lors de la sauvegarde</span>
            </>
          )}
        </div>
        
        <Button
          variant="default"
          onClick={handleSave}
          loading={isSaving}
          iconName="Palette"
          iconPosition="left"
          disabled={currentTheme === selectedTheme}
        >
          Appliquer le Thème
        </Button>
      </div>
    </div>
  );
};

export default DocumentThemesTab;