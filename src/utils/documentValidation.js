/**
 * Document Validation Utilities
 * Enforces business rules and data integrity for document generation
 */

export const validateRapportSpecial = (formData, clientData) => {
    const errors = [];
    const warnings = [];

    // 1. Required Fields Check
    const requiredFields = [
        { key: 'reportNumber', label: 'Numéro de Rapport' },
        { key: 'reportDate', label: 'Date du Rapport' },
        { key: 'capitalIncrease', label: 'Montant de l\'augmentation' },
        // Add more as needed based on the schema
    ];

    requiredFields.forEach(field => {
        if (!formData?.[field.key]) {
            errors.push({
                field: field.key,
                message: `Le champ "${field.label}" est obligatoire.`
            });
        }
    });

    if (!clientData?.name) {
        errors.push({
            field: 'client',
            message: 'Le nom de la société (Client) est introuvable.'
        });
    }

    // 2. Date Logic Validation
    if (formData?.reportDate && formData?.assemblyDate) {
        const reportDate = new Date(formData.reportDate);
        const assemblyDate = new Date(formData.assemblyDate);

        if (assemblyDate > reportDate) {
            errors.push({
                field: 'assemblyDate',
                message: 'La date de l\'assemblée ne peut pas être postérieure à la date du rapport.'
            });
        }
    }

    // 3. Financial Validation
    // Capital Before/After checks
    const capitalBefore = parseFloat(formData?.capitalBefore) || 0;
    const capitalAfter = parseFloat(formData?.capitalAfter) || 0;
    const capitalIncrease = parseFloat(formData?.capitalIncrease) || 0;

    // If capitalAfter is provided, check consistency
    if (capitalAfter > 0 && capitalBefore > 0) {
        if (Math.abs((capitalBefore + capitalIncrease) - capitalAfter) > 0.01) {
            warnings.push({
                field: 'capitalAfter',
                message: `Le capital après (${capitalAfter}) ne correspond pas à la somme du capital avant (${capitalBefore}) + augmentation (${capitalIncrease}).`
            });
        }
    }

    // Table 1 Validation (Capitalisation)
    const table1 = formData?.table1 || [];
    // const totalVariation = table1.reduce((sum, row) => sum + (parseFloat(row?.variation) || 0), 0);

    // Table 2 Validation (Shareholders)
    const table2 = formData?.table2 || [];
    if (table2.length === 0) {
        errors.push({
            field: 'shareholders',
            message: 'La liste des associés est vide.'
        });
    } else {
        // Check if total value after matches capital after
        const totalValueAfter = table2.reduce((sum, row) => sum + (parseFloat(row?.valeurPartsApres) || 0), 0);

        // If we have a calculated capitalAfter, compare
        const expectedCapitalAfter = capitalBefore + capitalIncrease;

        // Strict check: tolerance 0.01
        if (Math.abs(totalValueAfter - expectedCapitalAfter) > 0.01) {
            errors.push({
                field: 'shareholders_value',
                message: `ERREUR CRITIQUE: Le total des parts après (${totalValueAfter.toFixed(2)}) ne correspond pas au capital social attendu (${expectedCapitalAfter.toFixed(2)}). Différence: ${(totalValueAfter - expectedCapitalAfter).toFixed(2)}`
            });
        }

        // Check percentages
        const totalPct = table2.reduce((sum, row) => sum + (parseFloat(row?.pourcentage) || 0), 0);
        if (Math.abs(totalPct - 100) > 0.1) {
            warnings.push({
                field: 'shareholders_pct',
                message: `Le total des pourcentages est de ${totalPct.toFixed(2)}% (devrait être 100%).`
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};
