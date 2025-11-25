import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { formatCurrency, calculateLineTotal } from '../../../utils/documentUtils';

const NoteHonorairesForm = ({ formData, onChange, onAddLineItem, onRemoveLineItem }) => {
  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...(formData?.lineItems || [])];
    updatedLineItems[index] = { ...updatedLineItems?.[index], [field]: value };
    
    // Auto-calculate total when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : updatedLineItems?.[index]?.quantity;
      const unitPrice = field === 'unitPrice' ? value : updatedLineItems?.[index]?.unitPrice;
      updatedLineItems[index].total = calculateLineTotal(quantity, unitPrice);
    }
    
    onChange('lineItems', updatedLineItems);
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e?.target?.scrollHeight + 'px';
  };

  return (
    <div className="space-y-6">
      {/* Document Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Numéro de Document</label>
          <Input
            value={formData?.documentNumber || ''}
            onChange={(e) => onChange('documentNumber', e?.target?.value)}
            placeholder="01/2025/HN"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date d'émission</label>
          <Input
            type="date"
            value={formData?.issueDate || ''}
            onChange={(e) => onChange('issueDate', e?.target?.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date d'échéance</label>
          <Input
            type="date"
            value={formData?.dueDate || ''}
            onChange={(e) => onChange('dueDate', e?.target?.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Période de service</label>
          <Input
            value={formData?.servicePeriod || ''}
            onChange={(e) => onChange('servicePeriod', e?.target?.value)}
            placeholder="Janvier 2025"
          />
        </div>
      </div>
      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Services</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onAddLineItem}
          >
            Ajouter une ligne
          </Button>
        </div>

        <div className="space-y-4">
          {formData?.lineItems?.map((item, index) => (
            <div key={index} className="p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium">Service {index + 1}</h4>
                {formData?.lineItems?.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => onRemoveLineItem(index)}
                    className="text-destructive hover:text-destructive"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={item?.description || ''}
                    onChange={(e) => {
                      handleLineItemChange(index, 'description', e?.target?.value);
                      handleTextareaResize(e);
                    }}
                    onInput={handleTextareaResize}
                    placeholder="Description détaillée du service..."
                    className="w-full px-3 py-2 border border-border rounded-md resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
                    style={{ fieldSizing: 'content' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantité</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item?.quantity || 1}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e?.target?.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix unitaire (DA)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item?.unitPrice || ''}
                    onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e?.target?.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mt-3 text-right">
                <span className="text-sm text-muted-foreground">Total: </span>
                <span className="font-semibold text-lg">
                  {formatCurrency(item?.total || 0)}
                </span>
              </div>
            </div>
          )) || (
            <div className="text-center py-6 text-muted-foreground">
              <p>Aucun service ajouté. Cliquez sur "Ajouter une ligne" pour commencer.</p>
            </div>
          )}
        </div>
      </div>
      {/* TVA Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Taux TVA (%)</label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData?.tvaRate || 0}
            onChange={(e) => onChange('tvaRate', parseFloat(e?.target?.value) || 0)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Conditions de paiement</label>
          <Input
            value={formData?.paymentTerms || ''}
            onChange={(e) => onChange('paymentTerms', e?.target?.value)}
            placeholder="Paiement à 30 jours"
          />
        </div>
      </div>
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2">Notes additionnelles</label>
        <textarea
          value={formData?.notes || ''}
          onChange={(e) => {
            onChange('notes', e?.target?.value);
            handleTextareaResize(e);
          }}
          onInput={handleTextareaResize}
          placeholder="Notes, conditions spéciales, informations complémentaires..."
          className="w-full px-3 py-2 border border-border rounded-md resize-none min-h-[80px] max-h-[200px] overflow-y-auto"
          rows={3}
        />
      </div>
      {/* Summary */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Récapitulatif</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span className="font-medium">
              {formatCurrency(formData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item?.total) || 0), 0) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>TVA ({formData?.tvaRate || 0}%):</span>
            <span className="font-medium">
              {formatCurrency(
                (formData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item?.total) || 0), 0) || 0) *
                ((parseFloat(formData?.tvaRate) || 0) / 100)
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>TOTAL:</span>
            <span className="text-primary">
              {formatCurrency(
                (formData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item?.total) || 0), 0) || 0) *
                (1 + ((parseFloat(formData?.tvaRate) || 0) / 100))
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteHonorairesForm;