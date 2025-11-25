import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const ActionButtons = ({
  onSave,
  onPrint,
  onExport,
  onExportPDF,
  onPreview,
  isSaving = false,
  isExporting = false,
  canSave = true,
  canPrint = true,
  canExport = true
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
    if (onPreview) {
      onPreview(!showPreview);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg">
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          iconName="Save"
          iconPosition="left"
          onClick={onSave}
          loading={isSaving}
          disabled={!canSave || isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>

        <Button
          variant="outline"
          iconName="Printer"
          iconPosition="left"
          onClick={handlePrint}
          disabled={!canPrint}
        >
          Imprimer
        </Button>

        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          onClick={onExport}
          loading={isExporting}
          disabled={!canExport || isExporting}
        >
          {isExporting ? 'Export...' : 'Word'}
        </Button>

        <Button
          variant="outline"
          iconName="FileText"
          iconPosition="left"
          onClick={onExportPDF}
          loading={isExporting}
          disabled={!canExport || isExporting}
        >
          PDF
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          iconName="Eye"
          iconPosition="left"
          onClick={handlePreview}
          className="hidden md:flex"
        >
          {showPreview ? 'Masquer' : 'Aperçu'}
        </Button>

        <div className="h-6 w-px bg-border mx-2 hidden md:block" />

        <Button
          variant="ghost"
          iconName="RotateCcw"
          iconPosition="left"
          size="sm"
        >
          Réinitialiser
        </Button>

        <Button
          variant="ghost"
          iconName="Copy"
          iconPosition="left"
          size="sm"
        >
          Dupliquer
        </Button>
      </div>

      {/* Mobile Actions */}
      <div className="flex md:hidden w-full mt-2 gap-2">
        <Button
          variant="ghost"
          iconName="Eye"
          iconPosition="left"
          onClick={handlePreview}
          fullWidth
        >
          {showPreview ? 'Masquer Aperçu' : 'Voir Aperçu'}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;