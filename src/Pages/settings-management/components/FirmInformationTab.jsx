import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const FirmInformationTab = ({ firmData, onUpdate }) => {
  const [formData, setFormData] = useState({
    cabinetName: '',
    title: '',
    address: '',
    agrement: '',
    nif: '',
    nis: '',
    ai: '',
    bankName: '',
    bankAccount: '',
    bankAddress: '',
    logo: null,
    logoPreview: null,
    logoSize: 90
  });


  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');


  useEffect(() => {
    if (firmData) {
      setFormData({
        ...firmData,
        logoSize: firmData?.logoSize || 90
      });
    }
  }, [firmData]);


  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogoSizeChange = (e) => {
    const size = parseInt(e?.target?.value);
    setFormData(prev => ({
      ...prev,
      logoSize: size
    }));
    // Save logo size immediately to localStorage so it reflects in print without needing to press Save
    const saved = JSON.parse(localStorage.getItem('cabinetdoc-firm-data') || '{}');
    saved.logoSize = size;
    localStorage.setItem('cabinetdoc-firm-data', JSON.stringify(saved));
  };


  const handleLogoUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!validTypes?.includes(file?.type)) {
        setErrors(prev => ({
          ...prev,
          logo: 'Format de fichier non supporté. Utilisez JPG, PNG ou SVG.'
        }));
        return;
      }


      if (file?.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: 'La taille du fichier ne doit pas dépasser 2MB.'
        }));
        return;
      }


      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: event?.target?.result
        }));
        setErrors(prev => ({
          ...prev,
          logo: ''
        }));
      };
      reader?.readAsDataURL(file);
    }
  };


  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logoPreview: null
    }));
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.cabinetName?.trim()) {
      newErrors.cabinetName = 'Le nom du cabinet est requis';
    }
    
    if (!formData?.title?.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData?.address?.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    
    if (!formData?.agrement?.trim()) {
      newErrors.agrement = 'Le numéro d\'agrément est requis';
    }
    
    if (!formData?.nif?.trim()) {
      newErrors.nif = 'Le NIF est requis';
    }
    
    if (!formData?.nis?.trim()) {
      newErrors.nis = 'Le NIS est requis';
    }


    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };


  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }


    setIsSaving(true);
    setSaveStatus('');


    try {
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


  return (
    <div className="space-y-8">
      {/* Cabinet Information Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Building2" size={20} className="mr-2 text-primary" />
          Informations du Cabinet
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="text-sm font-medium leading-none text-foreground block mb-2" htmlFor="cabinetName" dir="ltr">Nom du Cabinet</label>
            <textarea
              id="cabinetName"
              name="cabinetName"
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-left"
              dir="ltr"
              placeholder="CABINET DE COMPTABILITÉ ET DE COMMISSAIRE AUX COMPTES"
              value={formData?.cabinetName || ''}
              onChange={(e) => handleInputChange({ target: { name: 'cabinetName', value: e.target.value } })}
            />
            {errors?.cabinetName && (
              <p className="text-destructive text-xs mt-1">{errors?.cabinetName}</p>
            )}
          </div>
          
          <Input
            label="Nom du comptable"
            name="title"
            value={formData?.title}
            onChange={handleInputChange}
            error={errors?.title}
            required
            placeholder="Commissaire aux Comptes"
            dir="ltr"
            className="text-left"
          />
          
          <div className="md:col-span-2">
            <Input
              label="Adresse"
              name="address"
              value={formData?.address}
              onChange={handleInputChange}
              error={errors?.address}
              required
              placeholder="Adresse complète du cabinet"
              dir="ltr"
              className="text-left"
            />
          </div>
        </div>
      </div>

      {/* Legal Information Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileCheck" size={20} className="mr-2 text-primary" />
          Informations Légales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="AGRÉMENT"
            name="agrement"
            value={formData?.agrement}
            onChange={handleInputChange}
            error={errors?.agrement}
            required
            placeholder="N° d'agrément"
          />
          
          <Input
            label="NIF"
            name="nif"
            value={formData?.nif}
            onChange={handleInputChange}
            error={errors?.nif}
            required
            placeholder="Numéro NIF"
          />
          
          <Input
            label="NIS"
            name="nis"
            value={formData?.nis}
            onChange={handleInputChange}
            error={errors?.nis}
            required
            placeholder="Numéro NIS"
          />
          
          <Input
            label="AI"
            name="ai"
            value={formData?.ai}
            onChange={handleInputChange}
            error={errors?.ai}
            placeholder="Numéro AI"
          />
        </div>
      </div>

      {/* Bank Information Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CreditCard" size={20} className="mr-2 text-primary" />
          Informations Bancaires
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom de la Banque"
            name="bankName"
            value={formData?.bankName}
            onChange={handleInputChange}
            placeholder="Ex: Banque d'Algérie"
          />
          
          <Input
            label="Numéro de Compte"
            name="bankAccount"
            value={formData?.bankAccount}
            onChange={handleInputChange}
            placeholder="Numéro de compte bancaire"
          />
          
          <div className="md:col-span-2">
            <Input
              label="Adresse de la Banque"
              name="bankAddress"
              value={formData?.bankAddress}
              onChange={handleInputChange}
              placeholder="Adresse de l'agence bancaire"
            />
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Image" size={20} className="mr-2 text-primary" />
          Logo du Cabinet
        </h3>
        
        <div className="space-y-4">
          {formData?.logoPreview ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div 
                  className="border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted overflow-hidden"
                  style={{ 
                    width: `${formData?.logoSize}px`, 
                    height: `${formData?.logoSize}px` 
                  }}
                >
                  <Image
                    src={formData?.logoPreview}
                    alt="Aperçu du logo du cabinet comptable"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Logo téléchargé avec succès
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
              
              {/* Logo Size Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span>Taille du logo</span>
                  <span className="text-muted-foreground">{formData?.logoSize}px</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={formData?.logoSize}
                  onChange={handleLogoSizeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Petit (50px)</span>
                  <span>Moyen (90px)</span>
                  <span>Grand (150px)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <label className="block">
                <div className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                  <Icon name="Upload" size={24} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Cliquez pour télécharger un logo
                    <br />
                    <span className="text-xs">JPG, PNG ou SVG (max 2MB)</span>
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
          
          {errors?.logo && (
            <p className="text-sm text-error">{errors?.logo}</p>
          )}
        </div>
      </div>

      {/* Save Section */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-2">
          {saveStatus === 'success' && (
            <>
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success">Informations sauvegardées</span>
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
          iconName="Save"
          iconPosition="left"
        >
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};


export default FirmInformationTab;
