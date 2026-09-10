import React, { useState, useEffect } from 'react';
import { UserPlus, Calendar, IdCard, CheckCircle, AlertCircle, Weight, Flame } from 'lucide-react';
import { AgeCategory, Modality, Competitor, CATEGORY_RULES } from '../types';
import { calculateAge } from '../utils/formatters';

interface CompetitorFormProps {
  onAddCompetitor: (competitorData: Omit<Competitor, 'id' | 'createdAt'>) => void;
  onUpdateCompetitor?: (id: string, competitorData: Omit<Competitor, 'id' | 'createdAt'>) => void;
  editingCompetitor?: Competitor | null;
  onCancelEdit?: () => void;
}

export const CompetitorForm: React.FC<CompetitorFormProps> = ({
  onAddCompetitor,
  onUpdateCompetitor,
  editingCompetitor,
  onCancelEdit,
}) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('U15');
  const [modality, setModality] = useState<Modality>('Libre Masculino');
  const [weightDivision, setWeightDivision] = useState<string>('57kg');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successPing, setSuccessPing] = useState(false);

  // If category changes and selected modality isn't allowed (e.g., Greco on U9), reset modality
  useEffect(() => {
    const allowedModalities = CATEGORY_RULES[ageCategory].modalities;
    if (!allowedModalities.includes(modality)) {
      setModality(allowedModalities[0]);
    }
  }, [ageCategory, modality]);

  // If modality or category changes, verify weight division is valid
  useEffect(() => {
    const allowedWeights = CATEGORY_RULES[ageCategory].weights[modality] || [];
    if (!allowedWeights.includes(weightDivision) && allowedWeights.length > 0) {
      setWeightDivision(allowedWeights[0]);
    }
  }, [ageCategory, modality, weightDivision]);

  // Handle edit mode populated values
  useEffect(() => {
    if (editingCompetitor) {
      setFullName(editingCompetitor.fullName);
      setBirthDate(editingCompetitor.birthDate);
      setIdDocument(editingCompetitor.idDocument);
      setAgeCategory(editingCompetitor.ageCategory);
      setModality(editingCompetitor.modality);
      setWeightDivision(editingCompetitor.weightDivision);
    }
  }, [editingCompetitor]);

  const availableModalities = CATEGORY_RULES[ageCategory].modalities;
  const availableWeights = CATEGORY_RULES[ageCategory].weights[modality] || [];
  const calculatedAge = calculateAge(birthDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Por favor ingresa el nombre completo del deportista.');
      return;
    }
    if (!birthDate) {
      setErrorMsg('Por favor ingresa la fecha de nacimiento.');
      return;
    }
    if (!idDocument.trim()) {
      setErrorMsg('Por favor ingresa el número de documento de identidad.');
      return;
    }
    if (!weightDivision) {
      setErrorMsg('Por favor selecciona la división de peso.');
      return;
    }

    if (editingCompetitor && onUpdateCompetitor) {
      onUpdateCompetitor(editingCompetitor.id, {
        fullName: fullName.trim(),
        birthDate,
        idDocument: idDocument.trim(),
        ageCategory,
        modality,
        weightDivision,
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      onAddCompetitor({
        fullName: fullName.trim(),
        birthDate,
        idDocument: idDocument.trim(),
        ageCategory,
        modality,
        weightDivision,
      });

      // Clear input fields for next entry
      setFullName('');
      setBirthDate('');
      setIdDocument('');
      setSuccessPing(true);
      setTimeout(() => setSuccessPing(false), 2500);
    }
  };

  return (
    <section
      id="section-competitor-form"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {editingCompetitor ? 'Modificar Datos de Deportista' : 'Registrar Nuevo Deportista'}
            </h2>
            <p className="text-xs text-slate-400">
              Ingresa los datos personales y asigna la categoría y división de peso reglamentaria
            </p>
          </div>
        </div>

        {editingCompetitor && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            Cancelar Edición
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successPing && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>¡Deportista añadido exitosamente a la nómina oficial!</span>
          </div>
        )}

        {/* Competitor Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
          {/* Nombre completo */}
          <div className="sm:col-span-6">
            <label
              htmlFor="input-athlete-fullname"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nombre Completo del Deportista <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-athlete-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Mateo Alejandro Torres Ruiz"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="sm:col-span-3">
            <label
              htmlFor="input-athlete-birthdate"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Fecha de Nacimiento <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="input-athlete-birthdate"
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all"
              />
            </div>
            {calculatedAge !== null && (
              <p className="text-[11px] font-semibold text-amber-700 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Edad calculada: {calculatedAge} años
              </p>
            )}
          </div>

          {/* Documento de Identidad */}
          <div className="sm:col-span-3">
            <label
              htmlFor="input-athlete-document"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Documento de Identidad <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IdCard className="w-4 h-4" />
              </div>
              <input
                id="input-athlete-document"
                type="text"
                required
                value={idDocument}
                onChange={(e) => setIdDocument(e.target.value)}
                placeholder="TI / CC / RC / Pasaporte"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all font-mono placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Division & Categories Selector Box */}
        <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Categoría y División de Peso Oficial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: Age Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Categoría de Edad
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['U9', 'U12', 'U15', 'U17'] as AgeCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAgeCategory(cat)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                      ageCategory === cat
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-sm font-black">{cat}</span>
                    <span className="text-[10px] font-normal opacity-80 block truncate">
                      {cat === 'U9' ? 'Sub-9' : cat === 'U12' ? 'Sub-12' : cat === 'U15' ? 'Sub-15' : 'Sub-17'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Modality */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                2. Modalidad de Lucha
              </label>
              <div className="flex flex-col gap-2">
                {availableModalities.map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setModality(mod)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      modality === mod
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{mod}</span>
                    {modality === mod && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Weight Division */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                3. División de Peso Reglamentaria
              </label>
              <div className="flex flex-wrap gap-2">
                {availableWeights.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeightDivision(w)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                      weightDivision === w
                        ? 'bg-slate-900 text-amber-400 border-slate-900 ring-2 ring-amber-500/40 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <Weight className="w-3 h-3 text-slate-400" />
                Reglamento oficial: {ageCategory} · {modality}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Valor de inscripción: <strong className="text-slate-900 font-bold">$60.000 COP</strong> por participante
          </div>

          <button
            id="btn-add-athlete"
            type="submit"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-98"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>
              {editingCompetitor
                ? 'Guardar Cambios del Deportista'
                : 'Adicionar Deportista a la Inscripción'}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
};
