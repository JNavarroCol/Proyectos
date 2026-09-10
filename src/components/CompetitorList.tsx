import React, { useState } from 'react';
import { Users, Search, Trash2, Edit2, Copy, Tag, Calendar, IdCard, Dumbbell } from 'lucide-react';
import { Competitor, AgeCategory, REGISTRATION_FEE_COP } from '../types';
import { calculateAge, formatCOP } from '../utils/formatters';

interface CompetitorListProps {
  competitors: Competitor[];
  onDelete: (id: string) => void;
  onEdit: (competitor: Competitor) => void;
  onDuplicate: (competitor: Competitor) => void;
}

export const CompetitorList: React.FC<CompetitorListProps> = ({
  competitors,
  onDelete,
  onEdit,
  onDuplicate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredCompetitors = competitors.filter((c) => {
    const matchesCategory =
      selectedFilter === 'all' || c.ageCategory === selectedFilter;
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.idDocument.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.weightDivision.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeClass = (category: AgeCategory) => {
    switch (category) {
      case 'U9':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'U12':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'U15':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'U17':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getModalityBadgeClass = (modality: string) => {
    if (modality === 'Grecorromana') {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    if (modality === 'Libre Femenino') {
      return 'bg-pink-50 text-pink-700 border-pink-200';
    }
    return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  };

  return (
    <section
      id="section-competitor-list"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Nómina de Deportistas Registrados</span>
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
                {competitors.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Listado consolidado de deportistas que integran la delegación del club
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 border-white'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Todos ({competitors.length})
          </button>
          {(['U9', 'U12', 'U15', 'U17'] as AgeCategory[]).map((cat) => {
            const count = competitors.filter((c) => c.ageCategory === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedFilter === cat
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, documento o peso..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900"
          />
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Mostrando <strong className="text-slate-800 font-bold">{filteredCompetitors.length}</strong> de {competitors.length} participantes
        </div>
      </div>

      {/* Table or Empty State */}
      {competitors.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Aún no has agregado deportistas
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Utiliza el formulario superior para añadir los integrantes de tu club indicando nombre, documento, fecha de nacimiento y categoría de peso.
          </p>
        </div>
      ) : filteredCompetitors.length === 0 ? (
        <div className="py-8 px-4 text-center text-xs text-slate-500">
          No se encontraron deportistas que coincidan con la búsqueda o filtro aplicado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Deportista</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Nacimiento / Edad</th>
                <th className="py-3 px-4">Categoría & Modalidad</th>
                <th className="py-3 px-4 text-center">División Peso</th>
                <th className="py-3 px-4 text-right">Inscripción</th>
                <th className="py-3 px-4 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCompetitors.map((comp, idx) => {
                const age = calculateAge(comp.birthDate);
                return (
                  <tr
                    key={comp.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3 px-4 text-center font-mono text-slate-400 font-semibold">
                      {idx + 1}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {comp.fullName}
                      </div>
                    </td>

                    {/* Document */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                        <IdCard className="w-3 h-3 text-slate-400 inline" />
                        <span>{comp.idDocument}</span>
                      </div>
                    </td>

                    {/* Birthdate & Age */}
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{comp.birthDate}</span>
                      </div>
                      {age !== null && (
                        <span className="text-[10px] text-slate-400">
                          ({age} años)
                        </span>
                      )}
                    </td>

                    {/* Category & Modality */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                            comp.ageCategory
                          )}`}
                        >
                          {comp.ageCategory}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getModalityBadgeClass(
                            comp.modality
                          )}`}
                        >
                          {comp.modality}
                        </span>
                      </div>
                    </td>

                    {/* Weight */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-mono font-black text-xs text-slate-950 bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-lg">
                        <Dumbbell className="w-3 h-3 text-amber-700" />
                        {comp.weightDivision}
                      </span>
                    </td>

                    {/* Fee */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                      {formatCOP(REGISTRATION_FEE_COP)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(comp)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
                          title="Editar deportista"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicate(comp)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
                          title="Duplicar para registrar en otra categoría"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(comp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Eliminar de la nómina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
