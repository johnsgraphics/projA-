import React from 'react';
import { formatCurrency, formatDate, getTheme, getLogoUrl } from '../../../utils/documentUtils';

const DocumentPreview = ({ documentType, formData, clientData, firmData, theme = 'BlueWave', previewMode = false }) => {
  const themeConfig = getTheme(theme);
  const logoUrl = getLogoUrl();

  const noteHonorairesConfig = {
    logoPos: { leftMm: 0, topMm: 20 },
    firmNamePos: { leftMm: 41, topMm: 32.5 },
    firmNameFontMm: 4.9,
    firmTitlePos: { leftMm: 41, topMm: 43.8 },
    firmTitleFontMm: 4.9,
    mainTitlePos: { leftMm: 120, topMm: 9.18 },
    mainTitleFontMm: 7.68,
    numberPos: { leftMm: 120, topMm: 17.46 },
    numberFontMm: 7.68
  };

  const rapportSpecialConfig = {
    logoPos: { leftMm: 0, topMm: 20 },
    firmNamePos: { leftMm: 41, topMm: 32.5 },
    firmNameFontMm: 4.9,
    firmTitlePos: { leftMm: 41, topMm: 43.8 },
    firmTitleFontMm: 4.9,
    mainTitlePos: { leftMm: 100, topMm: 0 },
    mainTitleFontMm: 5,
    numberPos: { leftMm: 100, topMm: 11 },
    numberFontMm: 5
  };

  const config = documentType === 'NOTE_HONORAIRES' ? noteHonorairesConfig : rapportSpecialConfig;

  const renderLogo = () => {
    if (logoUrl) {
      return (
        <div style={{ width: '42mm', height: '42mm' }}>
          <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
        </div>
      );
    }
    return (
      <div className="border-2 border-dashed border-gray-400 flex items-center justify-center bg-transparent rounded-md" style={{ width: '42mm', height: '42mm' }}>
        <span className="text-xs text-gray-500">شعار</span>
      </div>
    );
  };

  const Header = ({ mainTitle, subtitle, number }) => {
    const HEADER_WIDTH = '210mm';
    const HEADER_HEIGHT = '80mm';
    const WAVE_SHIFT_UP = '-6mm';

    return (
      <div className="relative print:p-4" style={{ borderRadius: '8px 8px 0 0', width: HEADER_WIDTH, height: HEADER_HEIGHT, margin: '0 auto' }}>
        <img
          src="/Assets/Images/wave-header-01.svg"
          alt="Header wave"
          className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
          style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT, objectFit: 'cover', transform: `translateY(${WAVE_SHIFT_UP})` }}
        />
        <div className="absolute inset-x-0 z-10 flex items-start justify-between px-6 print:px-4" style={{ top: '16mm' }}>
          <div className="flex items-start gap-3" style={{ position: 'absolute', left: `${config.logoPos.leftMm}mm`, top: `${config.logoPos.topMm}mm` }}>
            {renderLogo()}
          </div>
          <div className="text-left" dir="ltr" style={{ position: 'absolute', left: `${config.firmNamePos.leftMm}mm`, top: `${config.firmNamePos.topMm}mm` }}>
            <h2 className="font-bold whitespace-pre-line" style={{ fontSize: `${config.firmNameFontMm}mm`, lineHeight: 1.2, color: '#000', marginBottom: '1mm' }}>
              {firmData?.name || 'CABINET DE COMPTABILITÉ ET DE COMMISSAIRE AUX COMPTES'}
            </h2>
            <p className="opacity-90" style={{ fontSize: `${config.firmTitleFontMm}mm`, lineHeight: 1.3, color: '#000', position: 'absolute', left: `${config.firmTitlePos.leftMm - config.firmNamePos.leftMm}mm`, top: `${config.firmTitlePos.topMm - config.firmNamePos.topMm}mm` }}>
              {firmData?.title || 'MME KEBALI Amal'}
            </p>
          </div>
          <div className="text-left" style={{ position: 'absolute', left: `${config.mainTitlePos.leftMm}mm`, top: `${config.mainTitlePos.topMm}mm` }}>
            <h1 className="font-bold mb-1" style={{ fontSize: `${config.mainTitleFontMm}mm`, lineHeight: 1.1, color: '#fff', letterSpacing: '0.5px' }}>
              {subtitle ? `${mainTitle} ${subtitle}` : mainTitle}
            </h1>
          </div>
          {number ? (
            <p style={{ fontSize: `${config.numberFontMm}mm`, color: '#fff', fontWeight: '600', position: 'absolute', left: `${config.numberPos.leftMm}mm`, top: `${config.numberPos.topMm}mm` }} className="opacity-95">
              {number}
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  const PageContainer = ({ children, className = "" }) => (
    <div className={`print-area bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-lg print:shadow-none print:w-[210mm] print:min-h-[297mm] mb-8 last:mb-0 ${className}`} style={{ fontSize: '11pt', lineHeight: '1.4' }}>
      {children}
    </div>
  );

  const renderNoteHonoraires = () => {
    const calculateSubtotal = () => formData?.lineItems?.reduce((sum, item) => sum + (parseFloat(item?.total) || 0), 0) || 0;
    const calculateTVA = () => calculateSubtotal() * ((parseFloat(formData?.tvaRate) || 0) / 100);
    const calculateTotal = () => calculateSubtotal() + calculateTVA();

    return (
      <div id="document-preview-content">
        <PageContainer>
          <Header mainTitle="NOTE D'HONORAIRES" number={`N° ${formData?.documentNumber || '01/2025/HN'}`} />
          <div className="p-8 print:p-6">
            <div className="grid grid-cols-2 gap-8 mb-8 print:gap-4 print:mb-6">
              <div className={`p-4 rounded-lg border ${themeConfig?.border} ${themeConfig?.header} print:p-3`}>
                <h3 className={`font-semibold mb-3 ${themeConfig?.accent}`}>CABINET DE COMPTABILITÉ ET DE COMMISSAIRE AUX COMPTES</h3>
                <div className="space-y-1 text-sm">
                  <p>{firmData?.address || 'cité 13 Hectars 96 logts N°10 BARAKI'}</p>
                  <p>AGRÉMENT: {firmData?.agrement || 'N°4057/2019'}</p>
                  <p>NIF: {firmData?.nif || '27716050093014741680'}</p>
                  <p>NIS: {firmData?.nis || '29716050093031'}</p>
                  <p>AI: {firmData?.ai || 'N° 16149780121'}</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${themeConfig?.border} print:p-3`}>
                <h3 className={`font-semibold mb-3 ${themeConfig?.accent}`}>CLIENT:</h3>
                <div className="space-y-1 text-sm text-left" dir="ltr">
                  <p className="font-medium">{clientData?.name || 'Nom du client'}</p>
                  <p>{clientData?.address || 'Adresse du client'}</p>
                  <p>RC: {clientData?.rc || 'Registre de commerce'}</p>
                  <p>NIF: {clientData?.nif || 'Numéro d\'identification fiscale'}</p>
                  <p>NIS: {clientData?.nis || 'Numéro d\'identification statistique'}</p>
                </div>
              </div>
            </div>
            <div className="mb-8 print:mb-6">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className={`${themeConfig?.banner}`}>
                    <th className="border border-gray-300 p-3 text-left print:p-2">DÉSIGNATION</th>
                    <th className="border border-gray-300 p-3 text-center w-20 print:p-2">Prix unitaire</th>
                    <th className="border border-gray-300 p-3 text-center w-20 print:p-2">Quantité</th>
                    <th className="border border-gray-300 p-3 text-right w-24 print:p-2">Total TTC</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.lineItems?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 print:hover:bg-transparent">
                      <td className="border border-gray-300 p-3 print:p-2"><div className="whitespace-pre-wrap" style={{ minHeight: '40px' }}>{item?.description || 'Description du service'}</div></td>
                      <td className="border border-gray-300 p-3 text-center print:p-2">{formatCurrency(item?.unitPrice)}</td>
                      <td className="border border-gray-300 p-3 text-center print:p-2">{item?.quantity || 1}</td>
                      <td className="border border-gray-300 p-3 text-right font-medium print:p-2">{formatCurrency(item?.total)}</td>
                    </tr>
                  )) || (
                      <>
                        <tr><td className="border border-gray-300 p-3 print:p-2">Conseil</td><td className="border border-gray-300 p-3 text-center print:p-2">500 DA</td><td className="border border-gray-300 p-3 text-center print:p-2">1</td><td className="border border-gray-300 p-3 text-right font-medium print:p-2">500 DA</td></tr>
                        <tr><td className="border border-gray-300 p-3 print:p-2">Frais de dossier</td><td className="border border-gray-300 p-3 text-center print:p-2">100 DA</td><td className="border border-gray-300 p-3 text-center print:p-2">1</td><td className="border border-gray-300 p-3 text-right font-medium print:p-2">100 DA</td></tr>
                        <tr><td className="border border-gray-300 p-3 print:p-2">Autres</td><td className="border border-gray-300 p-3 text-center print:p-2">50 DA</td><td className="border border-gray-300 p-3 text-center print:p-2">1</td><td className="border border-gray-300 p-3 text-right font-medium print:p-2">50 DA</td></tr>
                      </>
                    )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mb-8 print:mb-6">
              <div className="w-80 print:w-64">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">{formatCurrency(calculateSubtotal())}</span></div>
                  <div className="flex justify-between"><span>TVA (0%)</span><span className="font-medium">0 DA</span></div>
                  <div className={`flex justify-between p-3 ${themeConfig?.pill} font-bold rounded-full print:p-2`}><span>Total</span><span>{formatCurrency(calculateTotal())}</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm print:gap-4 print:mb-6">
              <div><h4 className="font-semibold mb-2">Informations de paiement</h4><div className="space-y-1"><p>Paiement par virement bancaire</p><p>Compte : 0123 4567 8901</p></div></div>
              <div><h4 className="font-semibold mb-2">Termes & conditions</h4><p>Ce devis est valable 1 mois à compter de sa date d'émission</p></div>
            </div>
            <div className="flex justify-between items-end print:mt-8">
              <div className="text-sm"><p>Date: _______________</p></div>
              <div className="text-center"><p className="text-sm mb-8">Signature:</p><div className="w-32 h-16 border-b border-gray-400"></div></div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  };

  const renderRapportSpecial = () => {
    const sections = [
      { title: 'PRÉAMBULE', content: formData?.preambule || `Nous avons l'honneur de vous présenter notre rapport spécial concernant les opérations d'augmentation du capital social de votre société.` },
      { title: 'EXPOSÉ DES MOTIFS', content: formData?.exposMotifs || `Les raisons qui motivent cette augmentation de capital sont multiples et s'inscrivent dans une stratégie de développement à long terme.` },
      { title: 'RÉFÉRENCES RÉGLEMENTAIRES', content: formData?.referencesReglementaires || `• Article 691 du Code de commerce\n• Article 573 du Code de commerce\n• Dispositions légales en vigueur` },
      { title: 'RÉFÉRENCES INTERNES', content: formData?.referencesInternes || `Statuts de la société et délibérations antérieures du conseil d'administration.` },
      { title: 'MODALITÉ D\'AUGMENTATION DU CAPITAL SOCIAL', content: formData?.modaliteAugmentation || `L'augmentation du capital social s'effectuera par incorporation de réserves et émission de nouvelles parts sociales.` },
      { title: 'CONCLUSION', content: formData?.conclusion || `En conclusion, cette opération d'augmentation du capital social est conforme aux dispositions légales et statutaires en vigueur.` }
    ];

    const introSections = sections.slice(0, 5); // Preamble to Modalité
    const conclusionSection = sections[5]; // Conclusion

    return (
      <div id="document-preview-content">
        {/* Page 1: Introduction and Context */}
        <PageContainer>
          <Header mainTitle="RAPPORT SPECIAL" subtitle="PROJET D'AUGMENTATION DU CAPITAL SOCIAL" number={`N° ${formData?.reportNumber || '01/2025/RP'}`} />
          <div className="p-8 print:p-6">
            <div className="grid grid-cols-2 gap-8 mb-8 print:gap-4 print:mb-6">
              <div className={`p-4 rounded-lg border ${themeConfig?.border} ${themeConfig?.header} print:p-3`}>
                <h3 className={`font-semibold mb-3 ${themeConfig?.accent}`}>CABINET DE COMPTABILITÉ ET DE COMMISSAIRE AUX COMPTES</h3>
                <div className="space-y-1 text-sm">
                  <p>{firmData?.address || 'Adresse du cabinet'}</p>
                  <p>AGRÉMENT: {firmData?.agrement || 'N° d\'agrément'}</p>
                  {firmData?.nif && <p>NIF: {firmData?.nif}</p>}
                  {firmData?.nis && <p>NIS: {firmData?.nis}</p>}
                  {firmData?.ai && <p>AI: {firmData?.ai}</p>}
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${themeConfig?.border} print:p-3`}>
                <h3 className={`font-semibold mb-3 ${themeConfig?.accent}`}>Société</h3>
                <div className="space-y-1 text-sm text-left" dir="ltr">
                  <p className="font-medium">{clientData?.name || 'Nom de la société'}</p>
                  <p>{clientData?.address || 'Adresse de la société'}</p>
                  <p>RC: {clientData?.rc || 'Registre de commerce'}</p>
                  <p>Date: {formatDate(formData?.reportDate)}</p>
                </div>
              </div>
            </div>

            {introSections.map((section, index) => (
              <div key={index} className="mb-6 print:mb-4">
                <h3 className={`text-lg font-semibold mb-3 ${themeConfig?.accent} print:text-base`}>{section?.title}</h3>
                <div className="text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-2">{section?.content}</div>
              </div>
            ))}
          </div>
        </PageContainer>

        {/* Page 2: Tables */}
        <PageContainer>
          <div className="p-8 print:p-6 pt-12 print:pt-12">
            <div className="mb-8 print:mb-6">
              <h3 className={`text-lg font-semibold mb-4 ${themeConfig?.accent} print:text-base`}>AUGMENTATION DU CAPITAL SOCIAL PAR CAPITALISATION DU COMPTE COURANT</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className={`${themeConfig?.banner}`}>
                    <th className="border border-gray-300 p-3 text-left print:p-2">Libellé</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Passif avant</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Passif après</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Variation</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.table1?.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-3 print:p-2">{row?.libelle || `Libellé ${index + 1}`}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{formatCurrency(row?.passifAvant)}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{formatCurrency(row?.passifApres)}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{formatCurrency(row?.variation)}</td>
                    </tr>
                  )) || (
                      <>
                        <tr><td className="border border-gray-300 p-3 print:p-2">Capital social</td><td className="border border-gray-300 p-3 text-right print:p-2">1,000,000 DA</td><td className="border border-gray-300 p-3 text-right print:p-2">2,000,000 DA</td><td className="border border-gray-300 p-3 text-right print:p-2">+1,000,000 DA</td></tr>
                        <tr><td className="border border-gray-300 p-3 print:p-2">Compte courant associés</td><td className="border border-gray-300 p-3 text-right print:p-2">1,000,000 DA</td><td className="border border-gray-300 p-3 text-right print:p-2">0 DA</td><td className="border border-gray-300 p-3 text-right print:p-2">-1,000,000 DA</td></tr>
                      </>
                    )}
                </tbody>
              </table>
            </div>
            <div className="mb-8 print:mb-6">
              <h3 className={`text-lg font-semibold mb-4 ${themeConfig?.accent} print:text-base`}>LE DÉTAIL DE L'AUGMENTATION PAR ASSOCIÉS</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className={`${themeConfig?.banner}`}>
                    <th className="border border-gray-300 p-3 text-left print:p-2">Nom</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Nbr parts avant</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Valeur parts avant</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Nbr parts après</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Valeur parts après</th>
                    <th className="border border-gray-300 p-3 text-right print:p-2">Pourcentage</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.table2?.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-3 print:p-2">{row?.nom || `Associé ${index + 1}`}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{row?.nbrPartsAvant || 0}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{formatCurrency(row?.valeurPartsAvant)}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{row?.nbrPartsApres || 0}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{formatCurrency(row?.valeurPartsApres)}</td>
                      <td className="border border-gray-300 p-3 text-right print:p-2">{row?.pourcentage || 0}%</td>
                    </tr>
                  )) || (
                      <>
                        <tr><td className="border border-gray-300 p-3 print:p-2">Associé principal</td><td className="border border-gray-300 p-3 text-right print:p-2">100</td><td className="border border-gray-300 p-3 text-right print:p-2">1,000,000 DA</td><td className="border border-gray-300 p-3 text-right print:p-2">200</td><td className="border border-gray-300 p-3 text-right print:p-2">2,000,000 DA</td><td className="border border-gray-300 p-3 text-right print:p-2">100%</td></tr>
                      </>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </PageContainer>

        {/* Page 3: Conclusion & Signature */}
        <PageContainer>
          <div className="p-8 print:p-6 pt-12 print:pt-12">
            <div className="mb-6 print:mb-4">
              <h3 className={`text-lg font-semibold mb-3 ${themeConfig?.accent} print:text-base`}>{conclusionSection?.title}</h3>
              <div className="text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-2">{conclusionSection?.content}</div>
            </div>

            <div className="flex justify-end mt-12 print:mt-8">
              <div className="text-center">
                <p className="text-sm mb-8">Signature et cachet</p>
                <div className="w-32 h-16 border-b border-gray-400"></div>
                <p className="text-xs mt-2 text-gray-600">{firmData?.name || 'CABINET EXPERTISE COMPTABLE'}</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  };

  if (!documentType) {
    return (
      <div className="bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg print:shadow-none print:w-full print:min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center"><span className="text-2xl">📄</span></div>
          <p className="text-lg font-medium">Aperçu du Document</p>
          <p className="text-sm">Sélectionnez un type de document pour voir l'aperçu</p>
        </div>
      </div>
    );
  }

  return documentType === 'NOTE_HONORAIRES' ? renderNoteHonoraires() : renderRapportSpecial();
};

export default DocumentPreview;
