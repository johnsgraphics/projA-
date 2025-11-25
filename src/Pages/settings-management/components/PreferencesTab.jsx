import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PreferencesTab = ({ preferences, onUpdate }) => {
  const [formData, setFormData] = useState({
    defaultNoteTemplate: '',
    defaultRapportTemplate: '',
    numberFormat: 'french',
    dateFormat: 'dd/mm/yyyy',
    currency: 'DA',
    autoSave: true,
    autoNumbering: true,
    printMargins: 'normal',
    pageSize: 'A4',
    defaultLanguage: 'fr'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const numberFormatOptions = [
    { value: 'french', label: 'Français (1.000,00)' },
    { value: 'english', label: 'Anglais (1,000.00)' },
    { value: 'space', label: 'Espaces (1 000,00)' }
  ];

  const dateFormatOptions = [
    { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
    { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' }
  ];

  const printMarginsOptions = [
    { value: 'narrow', label: 'Étroites (1,27 cm)' },
    { value: 'normal', label: 'Normales (2,54 cm)' },
    { value: 'wide', label: 'Larges (3,81 cm)' }
  ];

  const pageSizeOptions = [
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'Letter', label: 'Lettre (216 × 279 mm)' }
  ];

  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'English' }
  ];

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('');

    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdate(formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setFormData({
      defaultNoteTemplate: `Objet : Note d'honoraires pour services comptables\n\nNous avons l'honneur de vous présenter notre note d'honoraires pour les services comptables rendus.\n\nVeuillez trouver ci-dessous le détail de nos prestations :`,
      defaultRapportTemplate: `RAPPORT SPÉCIAL SUR L'AUGMENTATION DU CAPITAL SOCIAL\n\nEn notre qualité de Commissaire aux Comptes de votre société, nous avons l'honneur de vous présenter notre rapport spécial sur l'opération d'augmentation du capital social.\n\nCette opération s'inscrit dans le cadre du développement de votre activité et du renforcement de vos fonds propres.`,
      numberFormat: 'french',
      dateFormat: 'dd/mm/yyyy',
      currency: 'DA',
      autoSave: true,
      autoNumbering: true,
      printMargins: 'normal',
      pageSize: 'A4',
      defaultLanguage: 'fr'
    });
  };

  return (
    <div className="space-y-8">
      {/* Document Templates Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileText" size={20} className="mr-2 text-primary" />
          Modèles de Documents
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Modèle par défaut - Note d'Honoraires
            </label>
            <textarea
              name="defaultNoteTemplate"
              value={formData?.defaultNoteTemplate}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Texte d'introduction par défaut pour les notes d'honoraires..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Variables disponibles: {'{'}CLIENT_NAME{'}'}, {'{'}DATE{'}'}, {'{'}YEAR{'}'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Modèle par défaut - Rapport Spécial
            </label>
            <textarea
              name="defaultRapportTemplate"
              value={formData?.defaultRapportTemplate}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Texte d'introduction par défaut pour les rapports spéciaux..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Variables disponibles: {'{'}CLIENT_NAME{'}'}, {'{'}CAPITAL_AMOUNT{'}'}, {'{'}DATE{'}'}
            </p>
          </div>
        </div>
      </div>
      {/* Formatting Preferences Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings2" size={20} className="mr-2 text-primary" />
          Préférences de Formatage
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Format des Nombres"
            options={numberFormatOptions}
            value={formData?.numberFormat}
            onChange={(value) => handleSelectChange('numberFormat', value)}
            description="Format d'affichage des montants"
          />
          
          <Select
            label="Format des Dates"
            options={dateFormatOptions}
            value={formData?.dateFormat}
            onChange={(value) => handleSelectChange('dateFormat', value)}
            description="Format d'affichage des dates"
          />
          
          <Input
            label="Devise"
            name="currency"
            value={formData?.currency}
            onChange={handleInputChange}
            placeholder="DA"
            description="Symbole de la devise"
          />
          
          <Select
            label="Langue par Défaut"
            options={languageOptions}
            value={formData?.defaultLanguage}
            onChange={(value) => handleSelectChange('defaultLanguage', value)}
            description="Langue de l'interface"
          />
        </div>
      </div>
      {/* Print Settings Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Printer" size={20} className="mr-2 text-primary" />
          Paramètres d'Impression
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Marges d'Impression"
            options={printMarginsOptions}
            value={formData?.printMargins}
            onChange={(value) => handleSelectChange('printMargins', value)}
            description="Taille des marges pour l'impression"
          />
          
          <Select
            label="Taille de Page"
            options={pageSizeOptions}
            value={formData?.pageSize}
            onChange={(value) => handleSelectChange('pageSize', value)}
            description="Format de page pour l'impression"
          />
        </div>
      </div>
      {/* Application Behavior Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2 text-primary" />
          Comportement de l'Application
        </h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Sauvegarde Automatique"
            description="Sauvegarder automatiquement les modifications toutes les 30 secondes"
            checked={formData?.autoSave}
            onChange={(e) => handleInputChange(e)}
            name="autoSave"
          />
          
          <Checkbox
            label="Numérotation Automatique"
            description="Générer automatiquement les numéros de documents séquentiels"
            checked={formData?.autoNumbering}
            onChange={(e) => handleInputChange(e)}
            name="autoNumbering"
          />
        </div>
      </div>
      {/* Preview Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Eye" size={20} className="mr-2 text-primary" />
          Aperçu des Formats
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Nombres</h4>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Exemple:</p>
              <p className="font-mono">
                {formData?.numberFormat === 'french' && '1.250,75 DA'}
                {formData?.numberFormat === 'english' && '1,250.75 DA'}
                {formData?.numberFormat === 'space' && '1 250,75 DA'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Dates</h4>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Exemple:</p>
              <p className="font-mono">
                {formData?.dateFormat === 'dd/mm/yyyy' && '06/11/2025'}
                {formData?.dateFormat === 'mm/dd/yyyy' && '11/06/2025'}
                {formData?.dateFormat === 'yyyy-mm-dd' && '2025-11-06'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Devise</h4>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Symbole:</p>
              <p className="font-mono text-lg">{formData?.currency}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Réinitialiser
          </Button>
          
          {saveStatus === 'success' && (
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success">Préférences sauvegardées</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error">Erreur lors de la sauvegarde</span>
            </div>
          )}
        </div>
        
        <Button
          variant="default"
          onClick={handleSave}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Sauvegarder les Préférences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesTab;