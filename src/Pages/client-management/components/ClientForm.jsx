import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const ClientForm = ({ client, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    rc: '',
    nif: '',
    nis: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        nom: client?.nom || '',
        adresse: client?.adresse || '',
        rc: client?.rc || '',
        nif: client?.nif || '',
        nis: client?.nis || ''
      });
    } else {
      setFormData({
        nom: '',
        adresse: '',
        rc: '',
        nif: '',
        nis: ''
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.nom?.trim()) {
      newErrors.nom = 'Le nom du client est obligatoire';
    }
    
    if (!formData?.adresse?.trim()) {
      newErrors.adresse = 'L\'adresse est obligatoire';
    }

    if (formData?.rc && !/^\d+$/?.test(formData?.rc)) {
      newErrors.rc = 'Le RC doit contenir uniquement des chiffres';
    }

    if (formData?.nif && !/^\d+$/?.test(formData?.nif)) {
      newErrors.nif = 'Le NIF doit contenir uniquement des chiffres';
    }

    if (formData?.nis && !/^\d+$/?.test(formData?.nis)) {
      newErrors.nis = 'Le NIS doit contenir uniquement des chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const clientData = {
        ...formData,
        id: client?.id || Date.now(),
        dateCreation: client?.dateCreation || new Date()?.toISOString(),
        dateModification: new Date()?.toISOString()
      };
      
      await onSave(clientData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-1000 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {client ? 'Modifier le client' : 'Ajouter un client'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nom du client"
                type="text"
                placeholder="Entrez le nom du client"
                value={formData?.nom}
                onChange={(e) => handleInputChange('nom', e?.target?.value)}
                error={errors?.nom}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Adresse"
                type="text"
                placeholder="Entrez l'adresse complète"
                value={formData?.adresse}
                onChange={(e) => handleInputChange('adresse', e?.target?.value)}
                error={errors?.adresse}
                required
              />
            </div>

            <div>
              <Input
                label="Registre de Commerce (RC)"
                type="text"
                placeholder="Ex: 123456789"
                value={formData?.rc}
                onChange={(e) => handleInputChange('rc', e?.target?.value)}
                error={errors?.rc}
                description="Numéro d'inscription au registre de commerce"
              />
            </div>

            <div>
              <Input
                label="Numéro d'Identification Fiscale (NIF)"
                type="text"
                placeholder="Ex: 987654321"
                value={formData?.nif}
                onChange={(e) => handleInputChange('nif', e?.target?.value)}
                error={errors?.nif}
                description="Numéro d'identification fiscale"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Numéro d'Identification Statistique (NIS)"
                type="text"
                placeholder="Ex: 456789123"
                value={formData?.nis}
                onChange={(e) => handleInputChange('nis', e?.target?.value)}
                error={errors?.nis}
                description="Numéro d'identification statistique"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {client ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;