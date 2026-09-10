/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Info, Download, FileText, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { ClubInfo, Competitor, InformedConsent, CATEGORY_RULES, REGISTRATION_FEE_COP } from './types';
import { SAMPLE_CLUB_INFO, SAMPLE_COMPETITORS } from './data/sampleData';
import { Header } from './components/Header';
import { ClubForm } from './components/ClubForm';
import { CompetitorForm } from './components/CompetitorForm';
import { CompetitorList } from './components/CompetitorList';
import { FinancialSummary } from './components/FinancialSummary';
import { InformedConsentModal } from './components/InformedConsentModal';
import { ExportModal } from './components/ExportModal';
import { formatCOP } from './utils/formatters';

const STORAGE_KEY_CLUB = 'ctg26_club_info_v1';
const STORAGE_KEY_COMPETITORS = 'ctg26_competitors_v1';
const STORAGE_KEY_CONSENT = 'ctg26_consent_v1';

export default function App() {
  // Club Info State
  const [club, setClub] = useState<ClubInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLUB);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse club info from storage', e);
      }
    }
    return {
      clubName: '',
      coachName: '',
      delegateName: '',
      refereeName: '',
      email: '',
      phone: '',
      logoUrl: '',
      logoFileName: '',
    };
  });

  // Competitors Roster State
  const [competitors, setCompetitors] = useState<Competitor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COMPETITORS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse competitors from storage', e);
      }
    }
    return [];
  });

  // Informed Consent State
  const [consent, setConsent] = useState<InformedConsent>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONSENT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse consent from storage', e);
      }
    }
    return {
      acceptedVeracity: false,
      acceptedParentalAuth: false,
      acceptedLiabilityWaiver: false,
      signerName: '',
      signerId: '',
    };
  });

  // UI state
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showCategoryRules, setShowCategoryRules] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLUB, JSON.stringify(club));
  }, [club]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPETITORS, JSON.stringify(competitors));
  }, [competitors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONSENT, JSON.stringify(consent));
  }, [consent]);

  // Handlers for Club Form
  const handleClubChange = (field: keyof ClubInfo, value: string) => {
    setClub((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (dataUrl: string, fileName: string) => {
    setClub((prev) => ({ ...prev, logoUrl: dataUrl, logoFileName: fileName }));
  };

  const handleRemoveLogo = () => {
    setClub((prev) => ({ ...prev, logoUrl: '', logoFileName: '' }));
  };

  // Handlers for Competitors
  const handleAddCompetitor = (
    data: Omit<Competitor, 'id' | 'createdAt'>
  ) => {
    const newCompetitor: Competitor = {
      ...data,
      id: 'comp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
    };
    setCompetitors((prev) => [newCompetitor, ...prev]);
  };

  const handleUpdateCompetitor = (
    id: string,
    data: Omit<Competitor, 'id' | 'createdAt'>
  ) => {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    setEditingCompetitor(null);
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    if (editingCompetitor?.id === id) {
      setEditingCompetitor(null);
    }
  };

  const handleDuplicateCompetitor = (competitor: Competitor) => {
    const duplicated: Competitor = {
      ...competitor,
      id: 'comp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      fullName: `${competitor.fullName} (Copia)`,
      createdAt: Date.now(),
    };
    setCompetitors((prev) => [duplicated, ...prev]);
  };

  const handleEditCompetitor = (competitor: Competitor) => {
    setEditingCompetitor(competitor);
    // Smooth scroll to form
    const el = document.getElementById('section-competitor-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sample data loader
  const handleLoadSample = () => {
    setClub(SAMPLE_CLUB_INFO);
    setCompetitors(SAMPLE_COMPETITORS);
    setConsent({
      acceptedVeracity: true,
      acceptedParentalAuth: true,
      acceptedLiabilityWaiver: true,
      signerName: SAMPLE_CLUB_INFO.delegateName,
      signerId: '73.198.420',
      signedAt: new Date().toISOString(),
    });
  };

  // Reset data handler
  const handleReset = () => {
    if (
      competitors.length > 0 &&
      !window.confirm(
        '¿Deseas reiniciar y limpiar todos los datos del club y competidores registrados?'
      )
    ) {
      return;
    }
    setClub({
      clubName: '',
      coachName: '',
      delegateName: '',
      refereeName: '',
      email: '',
      phone: '',
      logoUrl: '',
      logoFileName: '',
    });
    setCompetitors([]);
    setConsent({
      acceptedVeracity: false,
      acceptedParentalAuth: false,
      acceptedLiabilityWaiver: false,
      signerName: '',
      signerId: '',
    });
    setEditingCompetitor(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top Header */}
      <Header
        athleteCount={competitors.length}
        clubName={club.clubName}
        onOpenConsent={() => setIsConsentModalOpen(true)}
        onExportCSV={() => setIsExportModalOpen(true)}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tournament Categories Quick Reference Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCategoryRules(!showCategoryRules)}
            className="w-full px-6 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Reglamento de Categorías y Divisiones de Peso CTG26
              </span>
              <span className="text-[11px] text-slate-500 hidden md:inline">
                (U9, U12, U15, U17 · Libre Masculino, Libre Femenino y Grecorromana)
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-700">
              <span>{showCategoryRules ? 'Ocultar detalles' : 'Ver divisiones de peso'}</span>
              {showCategoryRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showCategoryRules && (
            <div className="p-6 bg-slate-50/70 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* U9 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900 text-sm">U9</span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Sub-9
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-600">
                  <p>
                    <strong className="text-slate-800">Libre Masculino:</strong> 22kg, 30kg, 40kg
                  </p>
                  <p>
                    <strong className="text-slate-800">Libre Femenino:</strong> 22kg, 30kg, 40kg
                  </p>
                </div>
              </div>

              {/* U12 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900 text-sm">U12</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Sub-12
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-600">
                  <p>
                    <strong className="text-slate-800">Libre Masculino:</strong> 25kg, 33kg, 40kg, 48kg
                  </p>
                  <p>
                    <strong className="text-slate-800">Libre Femenino:</strong> 25kg, 33kg, 40kg, 48kg
                  </p>
                </div>
              </div>

              {/* U15 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900 text-sm">U15</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Sub-15
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-600">
                  <p>
                    <strong className="text-slate-800">Libre Masc. y Grecorromana:</strong> 41, 48, 57, 68, 75, 85kg
                  </p>
                  <p>
                    <strong className="text-slate-800">Libre Femenino:</strong> 33, 39, 46, 50, 55, 65kg
                  </p>
                </div>
              </div>

              {/* U17 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900 text-sm">U17</span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    Sub-17 (Cadetes)
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-600">
                  <p>
                    <strong className="text-slate-800">Libre Masc. y Grecorromana:</strong> 48, 55, 60, 65, 80, 110kg
                  </p>
                  <p>
                    <strong className="text-slate-800">Libre Femenino:</strong> 43, 49, 53, 57, 65, 73kg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 1. Club Form */}
        <ClubForm
          club={club}
          onChange={handleClubChange}
          onLogoUpload={handleLogoUpload}
          onRemoveLogo={handleRemoveLogo}
        />

        {/* 2. Competitor Form */}
        <CompetitorForm
          onAddCompetitor={handleAddCompetitor}
          onUpdateCompetitor={handleUpdateCompetitor}
          editingCompetitor={editingCompetitor}
          onCancelEdit={() => setEditingCompetitor(null)}
        />

        {/* 3. Competitor List Table */}
        <CompetitorList
          competitors={competitors}
          onDelete={handleDeleteCompetitor}
          onEdit={handleEditCompetitor}
          onDuplicate={handleDuplicateCompetitor}
        />

        {/* 4. Financial Summary */}
        <FinancialSummary
          competitors={competitors}
          onOpenConsent={() => setIsConsentModalOpen(true)}
          onExportCSV={() => setIsExportModalOpen(true)}
          consentSigned={!!consent.signedAt}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-200">
              Campeonato Nacional Interclubes CTG26
            </span>
            <span>· Sistema de Acreditación e Inscripción</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Inscripción oficial: $60.000 COP por participante · Incluye consentimiento informado y exportación CSV
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InformedConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        club={club}
        competitors={competitors}
        consent={consent}
        onSaveConsent={setConsent}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        club={club}
        competitors={competitors}
      />
    </div>
  );
}
