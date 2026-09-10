import React, { useState } from 'react';
import { X, Download, Copy, Check, FileSpreadsheet, CheckCircle2, Columns, Image as ImageIcon, Link, FileCode } from 'lucide-react';
import { ClubInfo, Competitor, LogoExportMode, TOURNAMENT_DATES } from '../types';
import { generateCompetitorsCSV, downloadCSV, CSV_TEMPLATE_HEADERS, resolveCSVLogoValue } from '../utils/csvExport';
import { getStandardLogoFileName, downloadLogoFile } from '../utils/imageUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: ClubInfo;
  competitors: Competitor[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  club,
  competitors,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeLogoMode, setActiveLogoMode] = useState<LogoExportMode>(club.logoMode || 'filename');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(club.logoExternalUrl || '');

  if (!isOpen) return null;

  const currentClubConfig: ClubInfo = {
    ...club,
    logoMode: activeLogoMode,
    logoExternalUrl: customLogoUrl,
  };

  const resolvedLogoValue = resolveCSVLogoValue(currentClubConfig, activeLogoMode);
  const rawCSV = generateCompetitorsCSV(currentClubConfig, competitors, resolvedLogoValue);

  const cleanClubName = (club.clubName || 'Club')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 30);
  const filename = `Inscripcion_CTG26_${cleanClubName}.csv`;
  const logoFileName = club.logoFileName || getStandardLogoFileName(club.clubName);

  const handleDownloadCSV = () => {
    downloadCSV(filename, rawCSV);
  };

  const handleDownloadLogo = () => {
    if (club.logoUrl) {
      downloadLogoFile(club.logoUrl, logoFileName);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCSV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="modal-export-csv"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Exportar Base de Datos Oficial (Plantilla CSV)
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span>Campeonato Nacional Interclubes CTG26</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">{TOURNAMENT_DATES}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Header Schema Notice */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold text-emerald-900">
                Plantilla oficial configurada para la plataforma de gestión:
              </strong>
              <p className="mt-0.5 text-emerald-800 text-[11px]">
                Estructura de 13 columnas exactas delimitadas por comas (compatible con carga automática masiva):
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {CSV_TEMPLATE_HEADERS.map((col) => (
                  <span
                    key={col}
                    className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                      col === 'logo_club'
                        ? 'bg-amber-100 text-amber-900 font-bold border-amber-300'
                        : 'bg-white text-emerald-900 font-medium border-emerald-300'
                    }`}
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Selector de Transmisión Eficiente de logo_club */}
          <div className="bg-amber-50/50 border border-amber-200/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-amber-600" />
                Modo de Transmisión en Columna <code className="font-mono text-amber-800 lowercase">logo_club</code>:
              </span>

              {/* Botones de Modo */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveLogoMode('filename')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeLogoMode === 'filename'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📁 Archivo ({logoFileName})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoMode('url')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeLogoMode === 'url'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🔗 URL Web
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoMode('base64')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeLogoMode === 'base64'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ Base64 Ligero
                </button>
              </div>
            </div>

            {/* Inputs complementarios según modo */}
            {activeLogoMode === 'url' && (
              <div className="flex items-center gap-2 pt-1">
                <Link className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="url"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  placeholder="https://ejemplo.com/logo-club.png"
                  className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-2 text-[11px] pt-0.5">
              <span className="text-slate-500">
                {activeLogoMode === 'filename' && 'Escribe el nombre del archivo para cotejar con la carpeta de imágenes entregada.'}
                {activeLogoMode === 'url' && 'Escribe la URL directa accesible por el servidor del torneo.'}
                {activeLogoMode === 'base64' && 'Inserta imagen compactada (<15KB) compatible con celdas de Excel y bases de datos relacionales.'}
              </span>
              <span className="shrink-0 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 truncate max-w-[240px]">
                {resolvedLogoValue ? resolvedLogoValue.substring(0, 35) + (resolvedLogoValue.length > 35 ? '...' : '') : '(sin logo)'}
              </span>
            </div>
          </div>

          {/* Preview Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Columns className="w-3.5 h-3.5 text-slate-500" />
                Vista previa del archivo ({competitors.length} deportistas):
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                {filename}
              </span>
            </div>

            <div className="bg-slate-900 text-slate-200 font-mono text-[11px] p-3.5 rounded-lg max-h-44 overflow-y-auto overflow-x-auto whitespace-pre leading-relaxed">
              {rawCSV.replace('\uFEFF', '')}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar CSV'}</span>
          </button>

          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            {club.logoUrl && (
              <button
                type="button"
                onClick={handleDownloadLogo}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors"
                title="Descarga la imagen del logo con el nombre correspondiente"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Descargar Logo ({logoFileName})</span>
              </button>
            )}

            <button
              id="btn-download-csv-modal"
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Archivo CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
