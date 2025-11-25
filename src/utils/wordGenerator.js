import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    Header,
    Footer,
    ImageRun,
    AlignmentType,
    VerticalAlign,
    PageNumber,
    TextWrappingSide,
    TextWrappingType
} from "docx";
import { saveAs } from "file-saver";
import { formatCurrency, formatDate } from "./documentUtils";

// --- Helpers ---

// Convert SVG URL to PNG Blob (High DPI)
const convertSvgToPng = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            // 300 DPI: 1mm approx 11.8 px. Let's use 12 px/mm for safety.
            // A4 width 210mm. Header width ~210mm.
            const scale = 4; // High res scale
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Canvas to Blob failed"));
            }, "image/png", 1.0);
        };
        img.onerror = (e) => reject(e);
        img.src = url;
    });
};

const fetchImage = async (url) => {
    try {
        // If it's an SVG, convert it
        if (url.endsWith(".svg")) {
            const pngBlob = await convertSvgToPng(url);
            return await pngBlob.arrayBuffer();
        }
        const response = await fetch(url);
        const blob = await response.blob();
        return await blob.arrayBuffer();
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
};

export const generateRapportSpecialWord = async (formData, clientData, firmData, settings) => {
    // 1. Prepare Data
    const reportNumber = formData?.reportNumber || "01/2025/RP";
    const reportDate = formatDate(formData?.reportDate, 'long');

    // Load Images
    // Wave Header: Use local path or fallback
    const waveHeaderUrl = "/Assets/Images/wave-header-01.svg";
    const waveHeaderBuffer = await fetchImage(waveHeaderUrl);

    const logoUrl = settings?.logo || null;
    const logoBuffer = logoUrl ? await fetchImage(logoUrl) : null;

    // 2. Define Styles
    const primaryColor = "#0F766E"; // Teal-700

    // 3. Create Document
    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "Normal",
                    name: "Normal",
                    run: {
                        font: "Arial",
                        size: 22, // 11pt
                    },
                    paragraph: {
                        spacing: { line: 276 }, // 1.2 line height
                    },
                },
                {
                    id: "Heading1",
                    name: "Heading 1",
                    run: {
                        font: "Arial",
                        size: 28, // 14pt
                        bold: true,
                        color: primaryColor,
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
                        keepNext: true, // Keep with next paragraph
                    },
                },
                {
                    id: "TableHeader",
                    name: "Table Header",
                    run: {
                        font: "Arial",
                        size: 22,
                        bold: true,
                        color: "FFFFFF",
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                    },
                },
            ],
        },
        sections: [{
            properties: {
                page: {
                    size: {
                        width: "210mm",
                        height: "297mm",
                    },
                    margin: {
                        top: "20mm",
                        bottom: "20mm",
                        left: "15mm",
                        right: "15mm",
                    },
                },
            },
            headers: {
                default: new Header({
                    children: [
                        // Wave Header Image (Behind text ideally, but docx limitation often puts it inline or anchored)
                        // We will place it as a full-width image at the top if possible, or simulate the layout.
                        // For strict design, we'll try to put the image.
                        ...(waveHeaderBuffer ? [
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: waveHeaderBuffer,
                                        transformation: {
                                            width: 794, // ~210mm in pixels at 96 DPI
                                            height: 300, // Approx height
                                        },
                                        floating: {
                                            horizontalPosition: {
                                                offset: 0,
                                            },
                                            verticalPosition: {
                                                offset: 0,
                                            },
                                            behindDocument: true,
                                        },
                                    }),
                                ],
                            })
                        ] : []),

                        // Text Content Overlay (Simulated with Table or Paragraphs)
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            borders: {
                                top: { style: BorderStyle.NONE },
                                bottom: { style: BorderStyle.NONE },
                                left: { style: BorderStyle.NONE },
                                right: { style: BorderStyle.NONE },
                                insideHorizontal: { style: BorderStyle.NONE },
                                insideVertical: { style: BorderStyle.NONE },
                            },
                            rows: [
                                new TableRow({
                                    children: [
                                        // Left: Logo & Firm Name
                                        new TableCell({
                                            children: [
                                                ...(logoBuffer ? [new Paragraph({
                                                    children: [new ImageRun({
                                                        data: logoBuffer,
                                                        transformation: { width: 100, height: 100 },
                                                    })]
                                                })] : []),
                                                new Paragraph({
                                                    children: [new TextRun({ text: firmData?.name || "CABINET", bold: true, size: 20 })],
                                                }),
                                                new Paragraph({
                                                    children: [new TextRun({ text: firmData?.title || "", size: 18 })],
                                                }),
                                            ],
                                            width: { size: 40, type: WidthType.PERCENTAGE },
                                        }),
                                        // Right: Title & Number
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    children: [new TextRun({ text: "RAPPORT SPÉCIAL", bold: true, size: 32, color: "FFFFFF" })],
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                                new Paragraph({
                                                    children: [new TextRun({ text: `N° ${reportNumber}`, size: 24, color: "FFFFFF" })],
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                            width: { size: 60, type: WidthType.PERCENTAGE },
                                            verticalAlign: VerticalAlign.TOP,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    children: ["Page ", PageNumber.CURRENT, " sur ", PageNumber.TOTAL_PAGES],
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        }),
                    ],
                }),
            },
            children: [
                // Title Section
                new Paragraph({
                    text: "PROJET D'AUGMENTATION DU CAPITAL SOCIAL",
                    heading: "Heading1",
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 800, after: 400 }, // Push down to avoid header overlap
                }),

                // Client Info Box
                createClientInfoBox(clientData, reportDate),

                new Paragraph({ text: "" }), // Spacer

                // Preambule
                ...createSection("PRÉAMBULE", formData?.preambule),
                ...createSection("EXPOSÉ DES MOTIFS", formData?.exposMotifs),

                // Table 1
                new Paragraph({
                    text: "AUGMENTATION DU CAPITAL SOCIAL PAR CAPITALISATION",
                    heading: "Heading1",
                    spacing: { before: 400, after: 200 },
                }),
                createTable1(formData?.table1),

                // Table 2
                new Paragraph({
                    text: "DÉTAIL DE L'AUGMENTATION PAR ASSOCIÉS",
                    heading: "Heading1",
                    spacing: { before: 400, after: 200 },
                }),
                createTable2(formData?.table2),

                // Other Sections
                ...createSection("RÉFÉRENCES RÉGLEMENTAIRES", formData?.referencesReglementaires),
                ...createSection("RÉFÉRENCES INTERNES", formData?.referencesInternes),
                ...createSection("MODALITÉ D'AUGMENTATION", formData?.modaliteAugmentation),
                ...createSection("CONCLUSION", formData?.conclusion),

                // Signature
                new Paragraph({
                    text: "Fait à Alger, le " + reportDate,
                    spacing: { before: 600 },
                    alignment: AlignmentType.RIGHT,
                    keepNext: true,
                }),
                new Paragraph({
                    text: "Le Commissaire aux Comptes",
                    bold: true,
                    spacing: { before: 200 },
                    alignment: AlignmentType.RIGHT,
                    keepNext: true,
                }),
                new Paragraph({
                    text: "Signature et Cachet",
                    spacing: { before: 1200 }, // Space for signature
                    alignment: AlignmentType.RIGHT,
                }),
            ],
        }],
    });

    // 4. Generate and Save
    const blob = await Packer.toBlob(doc);
    const filename = `${reportNumber.replace(/\//g, '-')}_${clientData?.name?.replace(/\s+/g, '_')}_${formData?.reportDate}.docx`;
    saveAs(blob, filename);
};

// --- Helpers ---

function createClientInfoBox(clientData, date) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({ text: "SOCIÉTÉ:", bold: true }),
                            new Paragraph({ text: clientData?.name || "" }),
                            new Paragraph({ text: clientData?.address || "" }),
                            new Paragraph({ text: `RC: ${clientData?.rc || ""}` }),
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({ text: "DATE:", bold: true }),
                            new Paragraph({ text: date }),
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    }),
                ],
            }),
        ],
    });
}

function createSection(title, content) {
    return [
        new Paragraph({
            text: title,
            heading: "Heading1",
            spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
            text: content || "",
            alignment: AlignmentType.JUSTIFIED,
        }),
    ];
}

function createTable1(data) {
    const headerRow = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ text: "Libellé", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "Passif Avant", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "Passif Après", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "Variation", style: "TableHeader" })], shading: { fill: "0F766E" } }),
        ],
        tableHeader: true, // Repeats on new page
    });

    const rows = (data || []).map(row => new TableRow({
        children: [
            new TableCell({ children: [new Paragraph(row.libelle || "")] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(row.passifAvant, false), alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(row.passifApres, false), alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(row.variation, false), alignment: AlignmentType.RIGHT })] }),
        ],
        cantSplit: true, // Prevent row breaking
    }));

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...rows],
    });
}

function createTable2(data) {
    const headerRow = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ text: "Nom", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "Parts Avant", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "Valeur Avant", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "Parts Après", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "Valeur Après", style: "TableHeader" })], shading: { fill: "0F766E" } }),
            new TableCell({ children: [new Paragraph({ text: "%", style: "TableHeader" })], shading: { fill: "0F766E" } }),
        ],
        tableHeader: true, // Repeats on new page
    });

    const rows = (data || []).map(row => new TableRow({
        children: [
            new TableCell({ children: [new Paragraph(row.nom || "")] }),
            new TableCell({ children: [new Paragraph({ text: (row.nbrPartsAvant || 0).toString(), alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(row.valeurPartsAvant, false), alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: (row.nbrPartsApres || 0).toString(), alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(row.valeurPartsApres, false), alignment: AlignmentType.RIGHT })] }),
            new TableCell({ children: [new Paragraph({ text: (row.pourcentage || 0) + "%", alignment: AlignmentType.RIGHT })] }),
        ],
        cantSplit: true, // Prevent row breaking
    }));

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...rows],
    });
}
