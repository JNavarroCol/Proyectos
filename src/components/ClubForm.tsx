import React, { useRef, useState } from 'react';
import { Shield, Upload, X, Check, Building2, User, Phone, Mail, Award, Scale } from 'lucide-react';
import { ClubInfo } from '../types';

interface ClubFormProps {
  club: ClubInfo;
  onChange: (field: keyof ClubInfo, value: string) => void;
  onLogoUpload: (dataUrl: string, fileName: string) => void;
  onRemoveLogo: () => void;
}

export const ClubForm: React.FC<ClubFormProps> = ({
  club,
  onChange,
  onLogoUpload,
  onRemoveLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona una imagen válida (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('El tamaño del logo debe ser menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLogoUpload(reader.result, file.name);
      }
    };
    reader.onerror = () => {
      setUploadError('Error al leer el archivo. Intenta de nuevo.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

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
              Información oficial de la delegación para acreditación y contacto del torneo
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Logo / Crest Upload Zone (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Escudo / Logo del Club
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex-1 min-h-[190px] rounded-xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-amber-500 bg-amber-50/50'
                  : club.logoUrl
                  ? 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/60'
                  : 'border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              {club.logoUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={club.logoUrl}
                      alt="Escudo del Club"
                      className="h-24 w-24 object-contain rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveLogo();
                      }}
                      className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full shadow-md transition-colors"
                      title="Eliminar logo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-2 truncate max-w-[200px]">
                    {club.logoFileName || 'Escudo cargado'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Clic para cambiar imagen</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Subir Escudo o Logo
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-[190px]">
                    Arrastra aquí o haz clic para examinar (PNG, JPG, SVG hasta 5MB)
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                    <Upload className="w-3 h-3" /> Seleccionar imagen
                  </span>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-rose-600 mt-2 font-medium">{uploadError}</p>
            )}
          </div>

          {/* Form Fields (8 cols on lg) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Club Name (Full width) */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="input-club-name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Nombre del Club o Escuela <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    id="input-club-name"
                    type="text"
                    required
                    value={club.clubName}
                    onChange={(e) => onChange('clubName', e.target.value)}
                    placeholder="Ej. Club Gladiadores del Caribe, Escuela CTG Lucha..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium text-slate-900 transition-all placeholder:text-slate-400"
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
              <div className="sm:col-span-2">
                <label
                  htmlFor="input-referee-name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Nombre del Árbitro / Juez Propuesto <span className="text-rose-500">*</span>
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
                <p className="text-[11px] text-slate-500 mt-1">
                  Cada club o escuela debe suministrar un árbitro/juez colegiado para el campeonato.
                </p>
              </div>

              {/* Correo Electronico */}
              <div>
                <label
                  htmlFor="input-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Correo Electrónico <span className="text-rose-500">*</span>
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
              <div>
                <label
                  htmlFor="input-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Teléfono / WhatsApp <span className="text-rose-500">*</span>
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
          </div>
        </div>
      </div>
    </section>
  );
};
