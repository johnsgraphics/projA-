import React, { useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/documentUtils';

const RapportSpecialForm = ({ formData, onChange }) => {
  const handleTextareaResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e?.target?.scrollHeight + 'px';
  };

  const handleTable1Change = (index, field, value) => {
    const updatedTable = [...(formData?.table1 || [])];
    if (!updatedTable?.[index]) {
      updatedTable[index] = {};
    }
    updatedTable[index][field] = value;
    
    // Auto-calculate variation
    if (field === 'passifAvant' || field === 'passifApres') {
      const avant = parseFloat(updatedTable?.[index]?.passifAvant) || 0;
      const apres = parseFloat(updatedTable?.[index]?.passifApres) || 0;
      updatedTable[index].variation = apres - avant;
    }
    
    onChange('table1', updatedTable);
  };

  const handleTable2Change = (index, field, value) => {
    const updatedTable = [...(formData?.table2 || [])];
    if (!updatedTable?.[index]) {
      updatedTable[index] = {};
    }
    updatedTable[index][field] = value;
    
    // Auto-calculate percentage
    if (field === 'nbrPartsApres') {
      const totalParts = updatedTable?.reduce((sum, row) => sum + (parseFloat(row?.nbrPartsApres) || 0), 0);
      updatedTable?.forEach(row => {
        if (row?.nbrPartsApres && totalParts > 0) {
          row.pourcentage = ((parseFloat(row?.nbrPartsApres) / totalParts) * 100)?.toFixed(2);
        }
      });
    }
    
    onChange('table2', updatedTable);
  };

  const addTableRow = (tableKey) => {
    const currentTable = formData?.[tableKey] || [];
    const newRow = tableKey === 'table1' 
      ? { libelle: '', passifAvant: 0, passifApres: 0, variation: 0 }
      : { nom: '', nbrPartsAvant: 0, valeurPartsAvant: 0, nbrPartsApres: 0, valeurPartsApres: 0, pourcentage: 0 };
    
    onChange(tableKey, [...currentTable, newRow]);
  };

  const removeTableRow = (tableKey, index) => {
    const currentTable = formData?.[tableKey] || [];
    if (currentTable?.length > 1) {
      const updatedTable = currentTable?.filter((_, i) => i !== index);
      onChange(tableKey, updatedTable);
    }
  };

  const defaultSections = {
    preambule: `Nous avons l'honneur de vous présenter notre rapport concernant le projet d'augmentation du capital social de votre société. Cette mission s'inscrit dans le cadre de nos prestations d'expertise comptable et vise à analyser la faisabilité et les implications de cette opération.`,

    exposMotifs: `Les raisons qui motivent cette augmentation de capital sont multiples :

1. Renforcement de la structure financière de l'entreprise2. Amélioration de la capacité d'autofinancement
3. Préparation aux investissements futurs
4. Optimisation de la répartition du capital entre associés

Cette opération s'inscrit dans une stratégie de développement à long terme.`,

    referencesReglementaires: `Les références réglementaires applicables sont :

• Article 691 du Code de commerce algérien relatif aux augmentations de capital
• Article 573 du Code de commerce concernant les assemblées générales extraordinaires
• Ordonnance n° 75-59 du 26 septembre 1975 portant code de commerce
• Dispositions légales et réglementaires en vigueur`,

    referencesInternes: `Les références internes à la société comprennent :

• Statuts de la société dans leur version actuellement en vigueur
• Procès-verbaux des délibérations antérieures du conseil d'administration
• États financiers certifiés des trois derniers exercices
• Rapport du commissaire aux comptes sur les comptes annuels`,

    modaliteAugmentation: `L'augmentation du capital social s'effectuera selon les modalités suivantes : 1. MODALITÉ RETENUE : Augmentation par capitalisation du compte courant d'associés2. MONTANT : L'augmentation portera le capital de [montant actuel] DA à [nouveau montant] DA
3. PROCÉDURE : Incorporation au capital des sommes inscrites au compte courant des associés
4. RÉPARTITION : Attribution de nouvelles parts sociales aux associés au prorata de leurs apports`,

    conclusion: `En conclusion, nous certifions que l'augmentation du capital social proposée est :

• Conforme aux dispositions légales et réglementaires en vigueur
• Compatible avec les statuts de la société
• Techniquement réalisable dans les conditions proposées
• Favorable aux intérêts de la société et de ses associés

Nous recommandons l'approbation de cette opération par l'assemblée générale extraordinaire des associés.`
  };

  // Initialize tables if they don't exist
  React.useEffect(() => {
    if (!formData?.table1 || formData?.table1?.length === 0) {
      onChange('table1', [
        { libelle: 'Capital social', passifAvant: 1000000, passifApres: 2000000, variation: 1000000 },
        { libelle: 'Compte courant associés', passifAvant: 1000000, passifApres: 0, variation: -1000000 }
      ]);
    }
    
    if (!formData?.table2 || formData?.table2?.length === 0) {
      onChange('table2', [
        { nom: 'Associé principal', nbrPartsAvant: 100, valeurPartsAvant: 1000000, nbrPartsApres: 200, valeurPartsApres: 2000000, pourcentage: 100 }
      ]);
    }
  }, [formData, onChange]);

  return (
    <div className="space-y-8">
      {/* Document Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Numéro de Rapport</label>
          <Input
            value={formData?.reportNumber || ''}
            onChange={(e) => onChange('reportNumber', e?.target?.value)}
            placeholder="01/2025/RP"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date du Rapport</label>
          <Input
            type="date"
            value={formData?.reportDate || ''}
            onChange={(e) => onChange('reportDate', e?.target?.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Objet de la Mission</label>
          <Input
            value={formData?.missionObject || ''}
            onChange={(e) => onChange('missionObject', e?.target?.value)}
            placeholder="Augmentation du capital social"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Montant de l'augmentation (DA)</label>
          <Input
            type="number"
            min="0"
            step="1"
            value={formData?.capitalIncrease || ''}
            onChange={(e) => onChange('capitalIncrease', parseFloat(e?.target?.value) || 0)}
            placeholder="1000000"
          />
        </div>
      </div>
      {/* Table 1: AUGMENTATION DU CAPITAL SOCIAL PAR CAPITALISATION DU COMPTE COURANT */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Augmentation du Capital par Capitalisation</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addTableRow('table1')}
          >
            Ajouter ligne
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Libellé</th>
                <th className="border border-border p-3 text-right">Passif avant</th>
                <th className="border border-border p-3 text-right">Passif après</th>
                <th className="border border-border p-3 text-right">Variation</th>
                <th className="border border-border p-3 text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(formData?.table1 || [])?.map((row, index) => (
                <tr key={index}>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      value={row?.libelle || ''}
                      onChange={(e) => handleTable1Change(index, 'libelle', e?.target?.value)}
                      placeholder="Libellé du compte"
                    />
                  </td>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      step="1"
                      value={row?.passifAvant || ''}
                      onChange={(e) => handleTable1Change(index, 'passifAvant', parseFloat(e?.target?.value) || 0)}
                    />
                  </td>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      step="1"
                      value={row?.passifApres || ''}
                      onChange={(e) => handleTable1Change(index, 'passifApres', parseFloat(e?.target?.value) || 0)}
                    />
                  </td>
                  <td className="border border-border p-2 text-right font-medium">
                    {formatCurrency(row?.variation || 0)}
                  </td>
                  <td className="border border-border p-2 text-center">
                    {(formData?.table1?.length || 0) > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => removeTableRow('table1', index)}
                        className="text-destructive hover:text-destructive"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Table 2: LE DÉTAIL DE L'AUGMENTATION PAR ASSOCIÉS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Détail de l'Augmentation par Associés</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addTableRow('table2')}
          >
            Ajouter associé
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Nom</th>
                <th className="border border-border p-3 text-right">Nbr parts avant</th>
                <th className="border border-border p-3 text-right">Valeur avant</th>
                <th className="border border-border p-3 text-right">Nbr parts après</th>
                <th className="border border-border p-3 text-right">Valeur après</th>
                <th className="border border-border p-3 text-right">Pourcentage</th>
                <th className="border border-border p-3 text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(formData?.table2 || [])?.map((row, index) => (
                <tr key={index}>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      value={row?.nom || ''}
                      onChange={(e) => handleTable2Change(index, 'nom', e?.target?.value)}
                      placeholder="Nom de l'associé"
                    />
                  </td>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      step="1"
                      value={row?.nbrPartsAvant || ''}
                      onChange={(e) => handleTable2Change(index, 'nbrPartsAvant', parseInt(e?.target?.value) || 0)}
                    />
                  </td>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      step="1"
                      value={row?.valeurPartsAvant || ''}
                      onChange={(e) => handleTable2Change(index, 'valeurPartsAvant', parseFloat(e?.target?.value) || 0)}
                    />
                  </td>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      step="1"
                      value={row?.nbrPartsApres || ''}
                      onChange={(e) => handleTable2Change(index, 'nbrPartsApres', parseInt(e?.target?.value) || 0)}
                    />
                  </td>
                  <td className="border border-border p-2">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      step="1"
                      value={row?.valeurPartsApres || ''}
                      onChange={(e) => handleTable2Change(index, 'valeurPartsApres', parseFloat(e?.target?.value) || 0)}
                    />
                  </td>
                  <td className="border border-border p-2 text-right font-medium">
                    {row?.pourcentage || 0}%
                  </td>
                  <td className="border border-border p-2 text-center">
                    {(formData?.table2?.length || 0) > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => removeTableRow('table2', index)}
                        className="text-destructive hover:text-destructive"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Report Sections */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Sections du Rapport</h3>

        {Object.entries(defaultSections)?.map(([key, defaultContent]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-2 capitalize">
              {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}
            </label>
            <textarea
              value={formData?.[key] || defaultContent}
              onChange={(e) => {
                onChange(key, e?.target?.value);
                handleTextareaResize(e);
              }}
              onInput={handleTextareaResize}
              className="w-full px-3 py-2 border border-border rounded-md resize-none min-h-[120px] max-h-[400px] overflow-y-auto"
              rows={6}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RapportSpecialForm;