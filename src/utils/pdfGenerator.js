import html2pdf from 'html2pdf.js';

export const generateRapportSpecialPDF = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    const opt = {
        margin: [20, 15, 20, 15], // Top, Left, Bottom, Right in mm (Strict A4 margins)
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        enableLinks: true
    };

    try {
        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};
