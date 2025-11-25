import { validateRapportSpecial } from './documentValidation';
// Document utility functions for CabinetDoc Pro

/**
 * Generate sequential document numbers
 */
export const generateDocumentNumber = (type, year = new Date()?.getFullYear()) => {
  const prefix = type === 'NOTE_HONORAIRES' ? 'HN' : 'RP';
  const existingDocuments = JSON.parse(localStorage.getItem('documents') || '[]');

  // Filter documents by type and year
  const sameTypeYear = existingDocuments?.filter(doc => {
    if (!doc?.formData?.documentNumber && !doc?.formData?.reportNumber) return false;

    const number = doc?.formData?.documentNumber || doc?.formData?.reportNumber;
    const regex = new RegExp(`\\d+/${year}/${prefix}$`);
    return regex?.test(number);
  });

  const nextNumber = sameTypeYear?.length + 1;
  return `${nextNumber?.toString()?.padStart(2, '0')}/${year}/${prefix}`;
};

/**
 * Renumber documents after deletion
 */
export const renumberDocuments = (deletedDocId) => {
  const documents = JSON.parse(localStorage.getItem('documents') || '[]');
  const updatedDocuments = documents?.filter(doc => doc?.id !== deletedDocId);

  // Group by type and year
  const groups = {};

  updatedDocuments?.forEach(doc => {
    const number = doc?.formData?.documentNumber || doc?.formData?.reportNumber;
    if (!number) return;

    const match = number?.match(/(\d+)\/(\d{4})\/(HN|RP)$/);
    if (!match) return;

    const [, , year, type] = match;
    const key = `${year}-${type}`;

    if (!groups?.[key]) groups[key] = [];
    groups?.[key]?.push(doc);
  });

  // Renumber each group
  Object.keys(groups)?.forEach(key => {
    const [year, type] = key?.split('-');
    groups?.[key]?.sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return aDate - bDate;
    });

    groups?.[key]?.forEach((doc, index) => {
      const newNumber = `${(index + 1)?.toString()?.padStart(2, '0')}/${year}/${type}`;
      if (type === 'HN') {
        doc.formData.documentNumber = newNumber;
      } else {
        doc.formData.reportNumber = newNumber;
      }
    });
  });

  localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  return updatedDocuments;
};

/**
 * Format currency for Algerian Dinar
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const formatted = new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })?.format(amount || 0);

  return showSymbol ? `${formatted} DA` : formatted;
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') return currencyString;
  if (!currencyString) return 0;

  return parseFloat(currencyString?.toString()?.replace(/[^\d,.-]/g, '')?.replace(',', '.')) || 0;
};

/**
 * Format date for French locale
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date?.getTime())) return '';

  const options = format === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' };

  return date?.toLocaleDateString('fr-FR', options);
};

/**
 * Calculate line item total
 */
export const calculateLineTotal = (quantity, unitPrice) => {
  const qty = parseFloat(quantity) || 0;
  const price = parseCurrency(unitPrice);
  return qty * price;
};

/**
 * Calculate subtotal from line items
 */
export const calculateSubtotal = (lineItems = []) => {
  return lineItems?.reduce((sum, item) => sum + (parseFloat(item?.total) || 0), 0);
};

/**
 * Calculate TVA amount
 */
export const calculateTVA = (subtotal, tvaRate = 19) => {
  const rate = parseFloat(tvaRate) || 0;
  return subtotal * (rate / 100);
};

/**
 * Generate Word document blob from HTML
 */
export const generateWordDocument = (htmlContent, filename) => {
  const htmlWithStyles = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        @page { size: A4; margin: 8mm 12mm; }
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; }
        .header-banner { background-color: #2DD4BF; color: white; padding: 20px; text-align: center; }
        .info-box { border: 1px solid #ccc; padding: 15px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #2DD4BF; color: white; font-weight: bold; }
        .total-pill { background-color: #2DD4BF; color: white; padding: 8px 15px; border-radius: 20px; display: inline-block; }
        .signature-box { margin-top: 40px; text-align: right; }
        .logo-placeholder { width: 32mm; height: 32mm; border: 2px dashed #ccc; display: inline-block; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob([htmlWithStyles], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  document.body?.appendChild(a);
  a?.click();
  document.body?.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Get logo URL from settings or return placeholder
 */
export const getLogoUrl = () => {
  try {
    // Prefer new settings store (saved from SettingsManagement)
    const v2Raw = localStorage.getItem('cabinetdoc-firm-data');
    if (v2Raw) {
      const v2 = JSON.parse(v2Raw);
      if (v2?.logoPreview) return v2.logoPreview;
      if (v2?.logo) return v2.logo;
    }

    // Fallback to legacy store (firmSettings)
    const legacyRaw = localStorage.getItem('firmSettings');
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      return legacy?.logo || null;
    }

    return null;
  } catch (_e) {
    return null;
  }
};

/**
 * Save logo to localStorage as base64
 */
export const saveLogo = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const settings = JSON.parse(localStorage.getItem('firmSettings') || '{}');
      settings.logo = e.target.result;
      localStorage.setItem('firmSettings', JSON.stringify(settings));
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Theme configurations
 */
export const themes = {
  BlueWave: {
    name: 'BlueWave',
    banner: 'bg-gradient-to-r from-teal-400 to-teal-600 text-white',
    accent: 'text-teal-600',
    border: 'border-teal-200',
    header: 'bg-teal-50',
    pill: 'bg-teal-500 text-white',
    colors: {
      primary: '#2DD4BF',
      secondary: '#0F766E',
      background: '#F0FDFA'
    }
  },
  Classic: {
    name: 'Classic',
    banner: 'bg-gradient-to-r from-gray-700 to-gray-900 text-white',
    accent: 'text-gray-700',
    border: 'border-gray-300',
    header: 'bg-gray-100',
    pill: 'bg-gray-700 text-white',
    colors: {
      primary: '#374151',
      secondary: '#6B7280',
      background: '#F9FAFB'
    }
  },
  Minimal: {
    name: 'Minimal',
    banner: 'bg-black text-white',
    accent: 'text-black',
    border: 'border-gray-200',
    header: 'bg-gray-50',
    pill: 'bg-black text-white',
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      background: '#FFFFFF'
    }
  }
};

/**
 * Apply custom theme from uploaded JSON/CSS
 */
export const applyCustomTheme = (themeData) => {
  const customTheme = {
    name: 'Custom',
    banner: `bg-[${themeData?.colors?.primary || '#2DD4BF'}] text-white`,
    accent: `text-[${themeData?.colors?.primary || '#2DD4BF'}]`,
    border: `border-[${themeData?.colors?.border || '#E5E7EB'}]`,
    header: `bg-[${themeData?.colors?.background || '#F0FDFA'}]`,
    pill: `bg-[${themeData?.colors?.primary || '#2DD4BF'}] text-white`,
    colors: themeData?.colors || themes?.BlueWave?.colors,
    ...themeData
  };

  // Save to localStorage
  const settings = JSON.parse(localStorage.getItem('firmSettings') || '{}');
  settings.customTheme = customTheme;
  localStorage.setItem('firmSettings', JSON.stringify(settings));

  return customTheme;
};

/**
 * Get theme by name
 */
export const getTheme = (themeName) => {
  if (themeName === 'Custom') {
    const settings = JSON.parse(localStorage.getItem('firmSettings') || '{}');
    return settings?.customTheme || themes?.BlueWave;
  }
  return themes?.[themeName] || themes?.BlueWave;
};

/**
 * Validate required fields for document types
 */
export const validateDocument = (documentType, formData, clientData) => {
  const errors = [];

  if (!clientData) {
    errors?.push('Client sélectionné requis');
  }

  if (documentType === 'NOTE_HONORAIRES') {
    if (!formData?.lineItems || formData?.lineItems?.length === 0) {
      errors?.push('Au moins un service doit être ajouté');
    }

    formData?.lineItems?.forEach((item, index) => {
      if (!item?.description?.trim()) {
        errors?.push(`Description requise pour le service ${index + 1}`);
      }
      if (!item?.unitPrice || item?.unitPrice <= 0) {
        errors?.push(`Prix unitaire requis pour le service ${index + 1}`);
      }
    });
  } else if (documentType === 'RAPPORT_SPECIAL') {
    const validationResult = validateRapportSpecial(formData, clientData);
    if (!validationResult.isValid) {
      // Map validation errors to simple string array for UI
      validationResult.errors.forEach(err => errors.push(err.message));
    }
    if (validationResult.warnings && validationResult.warnings.length > 0) {
      validationResult.warnings.forEach(warn => errors.push(`ATTENTION: ${warn.message}`));
    }
  }

  return errors;
};

export default {
  generateDocumentNumber,
  renumberDocuments,
  formatCurrency,
  parseCurrency,
  formatDate,
  calculateLineTotal,
  calculateSubtotal,
  calculateTVA,
  generateWordDocument,
  getLogoUrl,
  saveLogo,
  themes,
  applyCustomTheme,
  getTheme,
  validateDocument
};