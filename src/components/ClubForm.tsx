import React from 'react';
import { Building2, User, Phone, Mail, Award, Scale, Check, Shield } from 'lucide-react';
import { ClubInfo } from '../types';

interface ClubFormProps {
  club: ClubInfo;
  onChange: (field: keyof ClubInfo, value: string) => void;
}

export const ClubForm: React.FC<ClubFormProps> = ({
  club,
  onChange,
}) => {
  return (
    <section
      id="section-club-info"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Datos del Club o Escuela Representada
            </h2>
            <p className="text-xs text-slate-400">
              Información oficial de la delegación para las columnas de club en la plantilla CSV
            </p>
          </div>
        </div>
        {club.clubName && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
            <Check className="w-3 h-3" /> Delegación activa
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Club Name (Full width on md/lg or 2 cols) */}
          <div className="md:col-span-2 lg:col-span-3">
            <label
              htmlFor="input-club-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nombre del Club o Escuela <span className="text-rose-500">*</span>
              <span className="ml-2 font-mono text-[10px] text-amber-700 lowercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                nombre_club
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                id="input-club-name"
                type="text"
                required
                value={club.clubName}
                onChange={(e) => onChange('clubName', e.target.value)}
                placeholder="Ej. Club Gladiadores del Caribe, Escuela CTG Lucha..."
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Entrenador */}
          <div>
            <label
              htmlFor="input-coach-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nombre del Entrenador <span className="text-rose-500">*</span>
              <span className="ml-1.5 font-mono text-[10px] text-amber-700 lowercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                nombre_entrenador
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-coach-name"
                type="text"
                required
                value={club.coachName}
                onChange={(e) => onChange('coachName', e.target.value)}
                placeholder="Ej. Carlos Mario Mendoza"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Delegado */}
          <div>
            <label
              htmlFor="input-delegate-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nombre del Delegado <span className="text-rose-500">*</span>
              <span className="ml-1.5 font-mono text-[10px] text-amber-700 lowercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                nombre_delegado
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Award className="w-4 h-4" />
              </div>
              <input
                id="input-delegate-name"
                type="text"
                required
                value={club.delegateName}
                onChange={(e) => onChange('delegateName', e.target.value)}
                placeholder="Ej. Andrés Felipe Gómez"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Arbitro / Juez */}
          <div>
            <label
              htmlFor="input-referee-name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nombre del Árbitro / Juez <span className="text-rose-500">*</span>
              <span className="ml-1.5 font-mono text-[10px] text-amber-700 lowercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                nombre_arbitro
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Scale className="w-4 h-4" />
              </div>
              <input
                id="input-referee-name"
                type="text"
                required
                value={club.refereeName}
                onChange={(e) => onChange('refereeName', e.target.value)}
                placeholder="Ej. Juez Nacional Roberto Silva"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Correo Electronico */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="input-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Correo Electrónico <span className="text-rose-500">*</span>
              <span className="ml-1.5 font-mono text-[10px] text-amber-700 lowercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                correo_club
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="input-email"
                type="email"
                required
                value={club.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="contacto@club.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Telefono */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="input-phone"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Teléfono / WhatsApp <span className="text-rose-500">*</span>
              <span className="ml-1.5 font-mono text-[10px] text-amber-700 lowercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                telefono_club
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="input-phone"
                type="tel"
                required
                value={club.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="+57 300 123 4567"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Note on official CSV schema */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            Todos los datos del club se replican automáticamente en cada registro de deportista exportado.
          </span>
          <span className="text-[11px] font-mono font-medium text-slate-500 hidden sm:inline">
            Formato oficial CTG26
          </span>
        </div>
      </div>
    </section>
  );
};
