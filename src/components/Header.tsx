import React from 'react';
import { Shield, Trophy, Download, FileText, Sparkles, RotateCcw, Calendar, MapPin } from 'lucide-react';
import { formatCOP } from '../utils/formatters';
import { REGISTRATION_FEE_COP, TOURNAMENT_DATES, TOURNAMENT_LOCATION } from '../types';

interface HeaderProps {
  athleteCount: number;
  clubName: string;
  onOpenConsent: () => void;
  onExportCSV: () => void;
  onLoadSample: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  athleteCount,
  clubName,
  onOpenConsent,
  onExportCSV,
  onLoadSample,
  onReset,
}) => {
  const totalCost = athleteCount * REGISTRATION_FEE_COP;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Torneo Oficial CTG26
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {TOURNAMENT_DATES}
                </span>
                <span className="text-xs text-slate-400 font-medium hidden lg:inline-block">
                  Lucha Olímpica (Libre & Grecorromana)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Campeonato Nacional Interclubes CTG26
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span>Sistema Oficial de Inscripción · Categorías U9, U12, U15 y U17</span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {TOURNAMENT_LOCATION}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Counter badge */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center gap-3">
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Deportistas
                </p>
                <p className="text-lg font-bold text-amber-400 leading-none mt-0.5">
                  {athleteCount}
                </p>
              </div>
              <div className="h-7 w-px bg-slate-700"></div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Total Inscripción
                </p>
                <p className="text-lg font-bold text-white leading-none mt-0.5">
                  {formatCOP(totalCost)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-header-sample"
                type="button"
                onClick={onLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Cargar datos de prueba para demostración rápida"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Ejemplo</span>
              </button>

              <button
                id="btn-header-consent"
                type="button"
                onClick={onOpenConsent}
                disabled={athleteCount === 0}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  athleteCount > 0
                    ? 'text-white bg-slate-800 hover:bg-slate-700 border-slate-600 shadow-sm'
                    : 'text-slate-500 bg-slate-800/40 border-slate-800 cursor-not-allowed'
                }`}
                title="Ver y generar consentimiento informado"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Consentimiento</span>
              </button>

              <button
                id="btn-header-export"
                type="button"
                onClick={onExportCSV}
                disabled={athleteCount === 0}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  athleteCount > 0
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                title="Exportar archivo CSV para la organización"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>

              <button
                id="btn-header-reset"
                type="button"
                onClick={onReset}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reiniciar o limpiar formulario"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
