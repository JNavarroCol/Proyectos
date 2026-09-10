import React, { useState } from 'react';
import { X, Printer, Check, ShieldAlert, FileCheck, Building, UserCheck } from 'lucide-react';
import { ClubInfo, Competitor, InformedConsent } from '../types';
import { formatDateSpanish } from '../utils/formatters';

interface InformedConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: ClubInfo;
  competitors: Competitor[];
  consent: InformedConsent;
  onSaveConsent: (consent: InformedConsent) => void;
}

export const InformedConsentModal: React.FC<InformedConsentModalProps> = ({
  isOpen,
  onClose,
  club,
  competitors,
  consent,
  onSaveConsent,
}) => {
  const [acceptedVeracity, setAcceptedVeracity] = useState(consent.acceptedVeracity);
  const [acceptedParentalAuth, setAcceptedParentalAuth] = useState(consent.acceptedParentalAuth);
  const [acceptedLiabilityWaiver, setAcceptedLiabilityWaiver] = useState(consent.acceptedLiabilityWaiver);
  const [signerName, setSignerName] = useState(consent.signerName || club.delegateName || '');
  const [signerId, setSignerId] = useState(consent.signerId || '');
  const [justSigned, setJustSigned] = useState(false);

  if (!isOpen) return null;

  const isFormComplete =
    acceptedVeracity &&
    acceptedParentalAuth &&
    acceptedLiabilityWaiver &&
    signerName.trim().length > 0 &&
    signerId.trim().length > 0;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    const updated: InformedConsent = {
      acceptedVeracity,
      acceptedParentalAuth,
      acceptedLiabilityWaiver,
      signerName: signerName.trim(),
      signerId: signerId.trim(),
      signedAt: consent.signedAt || new Date().toISOString(),
    };
    onSaveConsent(updated);
    setJustSigned(true);
    setTimeout(() => setJustSigned(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="modal-informed-consent"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Header - Screen only */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Consentimiento Informado y Exoneración de Responsabilidad
              </h2>
              <p className="text-xs text-slate-400">
                Campeonato Nacional Interclubes CTG26 · Documento Oficial de la Delegación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible space-y-6 text-slate-800">
          {/* Printable Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                  Documento Oficial de Acreditación
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-1">
                  Campeonato Nacional Interclubes CTG26
                </h1>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Lucha Olímpica · Categorías U9 - U12 - U15 - U17
                </p>
                <p className="text-xs text-slate-500">
                  Cartagena de Indias, Colombia
                </p>
              </div>

              {club.logoUrl && (
                <div className="shrink-0">
                  <img
                    src={club.logoUrl}
                    alt={club.clubName || 'Logo Club'}
                    className="h-20 w-20 object-contain rounded-lg border border-slate-200 p-1 bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Club Info Identification Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-3 print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Club / Escuela</span>
              <span className="font-bold text-slate-900 text-sm">{club.clubName || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Delegado Responsable</span>
              <span className="font-semibold text-slate-900">{club.delegateName || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Entrenador Oficial</span>
              <span className="font-semibold text-slate-900">{club.coachName || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Árbitro / Juez Colegiado</span>
              <span className="font-semibold text-slate-900">{club.refereeName || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Teléfono / Celular</span>
              <span className="font-semibold text-slate-900">{club.phone || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Correo Electrónico</span>
              <span className="font-semibold text-slate-900">{club.email || 'No especificado'}</span>
            </div>
          </div>

          {/* Legal Declarations (User prompt specifics) */}
          <div className="space-y-4 text-xs leading-relaxed text-slate-700 text-justify">
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Declaración Jurada y Responsabilidad del Delegado
              </h3>
              <p>
                Yo, <strong>{club.delegateName || '[Nombre del Delegado]'}</strong>, actuando en calidad de Delegado Oficial debidamente acreditado del Club/Escuela <strong>{club.clubName || '[Nombre del Club/Escuela]'}</strong>, por medio del presente documento declaro formalmente ante el Comité Organizador del <strong>Campeonato Nacional Interclubes CTG26</strong> lo siguiente:
              </p>
            </div>

            <ol className="list-decimal pl-5 space-y-2.5">
              <li>
                <strong>Veracidad y Manejo de la Información:</strong> Asumo la plena y exclusiva responsabilidad del manejo, autenticidad y veracidad de toda la información y datos personales consignados en este registro respecto a cada uno de los deportistas inscritos en la nómina anexa.
              </li>
              <li>
                <strong>Exoneración de Responsabilidad de la Organización:</strong> Declaro y acepto expresamente que <strong>la organización del Campeonato Nacional Interclubes CTG26 NO se hará responsable</strong> por ninguna eventualidad, accidente fortuito, lesión deportiva, daño físico o contingencia que ocurra durante el traslado, desarrollo o conclusión del evento deportivo.
              </li>
              <li>
                <strong>Autorización Previa de Padres de Familia / Tutores:</strong> Certifico bajo juramento que <strong>los padres de familia y/o representantes legales de cada uno de los atletas</strong> relacionados a continuación <strong>han firmado previamente la debida autorización escrita</strong> para su participación en este campeonato deportivo, asumiendo los riesgos inherentes a la disciplina de Lucha Olímpica.
              </li>
            </ol>
          </div>

          {/* Athletes Roster Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Nómina Oficial de Deportistas Acreditados ({competitors.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Tarifa total: {competitors.length} × $60.000 COP
              </span>
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2 px-3 text-center w-10">N°</th>
                    <th className="py-2 px-3">Nombre Completo del Deportista</th>
                    <th className="py-2 px-3">Documento de Identidad</th>
                    <th className="py-2 px-3">Categoría</th>
                    <th className="py-2 px-3">Modalidad</th>
                    <th className="py-2 px-3 text-center">Peso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {competitors.map((comp, idx) => (
                    <tr key={comp.id} className="text-slate-800">
                      <td className="py-2 px-3 text-center font-mono text-slate-500 font-semibold">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {comp.fullName}
                      </td>
                      <td className="py-2 px-3 font-mono">
                        {comp.idDocument}
                      </td>
                      <td className="py-2 px-3 font-semibold">
                        {comp.ageCategory}
                      </td>
                      <td className="py-2 px-3">
                        {comp.modality}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold">
                        {comp.weightDivision}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checkboxes & Endorsement Form - Screen only */}
          <div className="print:hidden bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Validación y Firma Digital del Delegado
            </h4>

            <div className="space-y-2.5 text-xs text-slate-700 mb-4">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedVeracity}
                  onChange={(e) => setAcceptedVeracity(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span>
                  <strong>Certifico la veracidad:</strong> Me hago responsable del manejo y veracidad de toda la información ingresada en la inscripción.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedLiabilityWaiver}
                  onChange={(e) => setAcceptedLiabilityWaiver(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span>
                  <strong>Acepto exoneración:</strong> Entiendo y acepto que la organización no se hará responsable por las eventualidades o lesiones que ocurran durante el evento.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedParentalAuth}
                  onChange={(e) => setAcceptedParentalAuth(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span>
                  <strong>Autorizaciones previas firmadas:</strong> Confirmo bajo juramento que los padres de familia de cada atleta han firmado previamente la autorización de participación en el torneo.
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre del Delegado Firmante
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Documento de Identidad del Delegado
                </label>
                <input
                  type="text"
                  value={signerId}
                  onChange={(e) => setSignerId(e.target.value)}
                  placeholder="Número de Cédula de Ciudadanía"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              {consent.signedAt ? (
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>
                    Firmado digitalmente el {formatDateSpanish(consent.signedAt)} por {consent.signerName} (C.C. {consent.signerId})
                  </span>
                </div>
              ) : (
                <div className="text-xs text-amber-700 font-medium">
                  Pendiente de firma del delegado
                </div>
              )}

              <button
                type="button"
                onClick={handleSign}
                disabled={!isFormComplete}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isFormComplete
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Guardar y Ratificar Consentimiento</span>
              </button>
            </div>
          </div>

          {/* Physical Signatures Section - Visible both screen and print */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs text-slate-600">
            <div>
              <div className="h-16 border-b border-slate-400 flex items-end justify-center pb-1">
                {consent.signedAt && (
                  <span className="font-mono text-emerald-700 font-bold text-[11px]">
                    FIRMADO DIGITALMENTE
                  </span>
                )}
              </div>
              <p className="font-bold text-slate-900 mt-1">{signerName || club.delegateName || 'Firma Delegado'}</p>
              <p className="text-[10px] text-slate-500">
                {signerId ? `C.C. ${signerId}` : 'Delegado Oficial del Club'}
              </p>
            </div>

            <div>
              <div className="h-16 border-b border-slate-400 flex items-end justify-center pb-1"></div>
              <p className="font-bold text-slate-900 mt-1">{club.coachName || 'Firma Entrenador'}</p>
              <p className="text-[10px] text-slate-500">Entrenador Responsable</p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="h-16 border-b border-slate-400 flex items-end justify-center pb-1"></div>
              <p className="font-bold text-slate-900 mt-1">Comité Organizador CTG26</p>
              <p className="text-[10px] text-slate-500">Recepción y Acreditación</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-4 border-t border-slate-200">
            Documento generado por el Sistema Oficial de Inscripción del Campeonato Nacional Interclubes CTG26. Fecha de emisión: {new Date().toLocaleDateString('es-CO')}
          </div>
        </div>

        {/* Modal Footer - Screen only */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            Puedes imprimir este documento o guardarlo en formato PDF para el congresillo técnico.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir Documento</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
