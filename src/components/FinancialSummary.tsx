import React from 'react';
import { DollarSign, FileText, Download, ShieldCheck, PieChart, Users } from 'lucide-react';
import { Competitor, REGISTRATION_FEE_COP, AgeCategory, Modality } from '../types';
import { formatCOP } from '../utils/formatters';

interface FinancialSummaryProps {
  competitors: Competitor[];
  onOpenConsent: () => void;
  onExportCSV: () => void;
  consentSigned: boolean;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  competitors,
  onOpenConsent,
  onExportCSV,
  consentSigned,
}) => {
  const count = competitors.length;
  const totalAmount = count * REGISTRATION_FEE_COP;

  const categories: AgeCategory[] = ['U9', 'U12', 'U15', 'U17'];
  const categoryBreakdown = categories.map((cat) => {
    const catCount = competitors.filter((c) => c.ageCategory === cat).length;
    return {
      category: cat,
      count: catCount,
      subtotal: catCount * REGISTRATION_FEE_COP,
    };
  });

  const modalities: Modality[] = ['Libre Masculino', 'Libre Femenino', 'Grecorromana'];
  const modalityBreakdown = modalities.map((mod) => {
    const modCount = competitors.filter((c) => c.modality === mod).length;
    return {
      modality: mod,
      count: modCount,
    };
  });

  return (
    <section
      id="section-financial-summary"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            4
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Resumen Financiero y Liquidación de Inscripción
            </h2>
            <p className="text-xs text-slate-400">
              Cálculo oficial de la tasa de participación para el Campeonato Nacional CTG26
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs font-mono text-amber-400">
          <span>Tarifa: {formatCOP(REGISTRATION_FEE_COP)} / participante</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Total Highlight Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                  Total a Cancelar
                </span>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  CTG26 Oficial
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2 font-mono">
                {formatCOP(totalAmount)}
              </div>

              <p className="text-xs text-slate-400 mb-6">
                Correspondiente a <strong className="text-white font-bold">{count}</strong> deportista{count === 1 ? '' : 's'} registrado{count === 1 ? '' : 's'} a razón de {formatCOP(REGISTRATION_FEE_COP)} cada uno.
              </p>
            </div>

            {/* Quick action buttons in card */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onOpenConsent}
                disabled={count === 0}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  consentSigned
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    : count > 0
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {consentSigned ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Consentimiento Firmado (Ver / Imprimir)</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Generar Consentimiento Informado</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onExportCSV}
                disabled={count === 0}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                  count > 0
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-slate-600'
                    : 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Descargar Base de Datos (.CSV)</span>
              </button>
            </div>
          </div>

          {/* Detailed Breakdown Tables (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* Breakdown by Age Category */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Desglose por Categoría de Edad
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {categoryBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                        {item.count}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-700">
                      {formatCOP(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown by Modality */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Distribución por Modalidad de Combate
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {modalityBreakdown.map((m) => (
                  <div
                    key={m.modality}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{m.modality}</p>
                      <p className="text-[10px] text-slate-500">
                        {m.count === 0 ? 'Sin registros' : `${m.count} participante${m.count > 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <span className="h-7 w-7 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                      {m.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification notice */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <span className="font-bold text-amber-700">Importante:</span>
              <p>
                Para formalizar la inscripción en el congresillo técnico del Campeonato Nacional CTG26, deberás presentar la base de datos CSV generada y el Consentimiento Informado debidamente firmado por el Delegado oficial del club.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
