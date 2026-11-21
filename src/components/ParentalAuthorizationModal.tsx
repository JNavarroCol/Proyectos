import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  FileSignature,
  Calendar,
  Hotel,
  Bus,
  UserCheck,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ClubInfo,
  Competitor,
  DelegationTravelInfo,
  ParentGuardianInfo,
  TOURNAMENT_DATES,
  TOURNAMENT_LOCATION,
} from '../types';
import { calculateAge } from '../utils/formatters';

interface ParentalAuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: ClubInfo;
  competitors: Competitor[];
  initialCompetitorId?: string | null;
  travelInfo: DelegationTravelInfo;
  onUpdateTravelInfo: (info: DelegationTravelInfo) => void;
  parentInfos: Record<string, ParentGuardianInfo>;
  onUpdateParentInfo: (competitorId: string, info: ParentGuardianInfo) => void;
}

type PrintMode = 'single' | 'all' | 'blank';

const EMPTY_PARENT_INFO: ParentGuardianInfo = {
  parentName: '',
  parentId: '',
  parentPhone: '',
  relationship: 'Padre / Madre',
  epsName: '',
};

interface AuthorizationDocumentPageProps {
  club: ClubInfo;
  competitor: Competitor | null;
  travelInfo: DelegationTravelInfo;
  parentInfo: ParentGuardianInfo;
  isLast: boolean;
}

const AuthorizationDocumentPage: React.FC<AuthorizationDocumentPageProps> = ({
  club,
  competitor,
  travelInfo,
  parentInfo,
  isLast,
}) => {
  const age = competitor ? calculateAge(competitor.birthDate) : null;
  const blankLine = '________________________________________';
  const shortBlank = '______________________';

  const displayAthleteName = competitor?.fullName || blankLine;
  const displayAthleteDoc = competitor?.idDocument || shortBlank;
  const displayAthleteBirth = competitor?.birthDate || shortBlank;
  const displayAthleteAge = age !== null ? `${age} años` : '____ años';
  const displayCategory = competitor
    ? `${competitor.ageCategory} · ${competitor.modality} · ${competitor.weightDivision}`
    : '____________________________';

  const displayParentName = parentInfo.parentName.trim() || blankLine;
  const displayParentId = parentInfo.parentId.trim() || shortBlank;
  const displayParentPhone = parentInfo.parentPhone.trim() || shortBlank;
  const displayRelationship = parentInfo.relationship.trim() || 'Padre / Madre / Acudiente';
  const displayEps = parentInfo.epsName.trim() || shortBlank;

  const displayClubName = club.clubName.trim() || '________________________________';
  const displayCoachName = club.coachName.trim() || '________________________________';
  const displayCoachId = travelInfo.coachIdDocument.trim() || shortBlank;
  const displayDelegateName = club.delegateName.trim() || '________________________________';
  const displayClubPhone = club.phone.trim() || shortBlank;

  const displayHotelName = travelInfo.hotelName.trim() || '________________________________________';
  const displayHotelAddress = travelInfo.hotelAddress.trim() || '________________________________________';
  const displayOriginCity = travelInfo.originCity.trim() || '________________________';
  const displayTransport = travelInfo.transportMode.trim() || 'Terrestre / Aéreo';
  const displayTravelDates = travelInfo.travelDates.trim() || TOURNAMENT_DATES;

  return (
    <article
      className={`bg-white text-slate-800 space-y-4 text-xs leading-relaxed ${
        !isLast ? 'pb-10 mb-10 border-b-4 border-dashed border-slate-300 print:pb-0 print:mb-0 print:border-none print-break-after' : ''
      }`}
    >
      {/* Printable Official Document Header */}
      <div className="border-b-2 border-slate-900 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
              Autorización Oficial de Padres de Familia y/o Tutores
            </span>
            <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight mt-0.5 leading-snug">
              Permiso de Participación, Viaje con Entrenador y Alojamiento en Hotel
            </h1>
            <p className="text-xs font-bold text-slate-700 mt-1">
              Campeonato Nacional Interclubes CTG26 · Lucha Olímpica
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-700">
              <span className="inline-flex items-center gap-1 font-bold bg-amber-100 text-amber-950 px-2 py-0.5 rounded border border-amber-300 print:bg-slate-100 print:border-slate-400 print:text-slate-900">
                <Calendar className="w-3 h-3 text-amber-700 print:text-slate-800" />
                Fecha del Evento: {TOURNAMENT_DATES}
              </span>
              <span>·</span>
              <span className="font-semibold text-slate-600">{TOURNAMENT_LOCATION}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-end">
            <img
              src="/assets/aistudio/CTG26_logo_transparente_2d5cee03.png"
              alt="Campeonato Nacional Interclubes CTG26"
              className="h-16 sm:h-20 w-auto object-contain print:h-16"
            />
          </div>
        </div>
      </div>

      {/* Section 1: Parent & Athlete Identification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-300 print:bg-white">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            I. Datos del Padre, Madre o Acudiente Legal
          </h3>
          <div className="space-y-1.5 text-[11px]">
            <p>
              <span className="text-slate-500 font-semibold">Nombre completo: </span>
              <strong className="text-slate-950">{displayParentName}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold">Documento (C.C.): </span>
              <strong className="text-slate-950 font-mono">{displayParentId}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold">Parentesco / Calidad: </span>
              <strong className="text-slate-950">{displayRelationship}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold">Teléfono de contacto: </span>
              <strong className="text-slate-950 font-mono">{displayParentPhone}</strong>
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-300 print:bg-white">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            II. Datos del Deportista Autorizado
          </h3>
          <div className="space-y-1.5 text-[11px]">
            <p>
              <span className="text-slate-500 font-semibold">Deportista: </span>
              <strong className="text-slate-950">{displayAthleteName}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold">Documento (TI / RC / CC): </span>
              <strong className="text-slate-950 font-mono">{displayAthleteDoc}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold">Nacimiento / Edad: </span>
              <strong className="text-slate-950 font-mono">{displayAthleteBirth}</strong>{' '}
              <span className="text-slate-700">({displayAthleteAge})</span>
            </p>
            <p>
              <span className="text-slate-500 font-semibold">Prueba / Categoría: </span>
              <strong className="text-slate-950">{displayCategory}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold">EPS / Seguro Médico: </span>
              <strong className="text-slate-950">{displayEps}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Delegation, Coach & Hotel Info */}
      <div className="bg-amber-50/50 rounded-xl p-3.5 border border-amber-300/80 print:bg-slate-50 print:border-slate-300">
        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 border-b border-amber-200 print:border-slate-300 pb-1 mb-2">
          III. Delegación, Entrenador Responsable y Hotel de Alojamiento
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <p>
            <span className="text-slate-600 font-semibold">Club / Escuela: </span>
            <strong className="text-slate-950">{displayClubName}</strong>
          </p>
          <p>
            <span className="text-slate-600 font-semibold">Delegado Oficial: </span>
            <strong className="text-slate-950">{displayDelegateName}</strong>
          </p>
          <p>
            <span className="text-slate-600 font-semibold">Entrenador Responsable: </span>
            <strong className="text-slate-950">{displayCoachName}</strong>
          </p>
          <p>
            <span className="text-slate-600 font-semibold">C.C. Entrenador / Tel. Club: </span>
            <strong className="text-slate-950 font-mono">
              {displayCoachId} · {displayClubPhone}
            </strong>
          </p>
          <p>
            <span className="text-slate-600 font-semibold">Hotel de la Delegación: </span>
            <strong className="text-slate-950">{displayHotelName}</strong>
          </p>
          <p>
            <span className="text-slate-600 font-semibold">Dirección / Sector Hotel: </span>
            <strong className="text-slate-950">{displayHotelAddress}</strong>
          </p>
          <p>
            <span className="text-slate-600 font-semibold">Ciudad de Origen / Transporte: </span>
            <strong className="text-slate-950">
              {displayOriginCity} ({displayTransport})
            </strong>
          </p>
          <p>
            <span className="text-slate-600 font-semibold">Fechas de Viaje y Estadía: </span>
            <strong className="text-slate-950">{displayTravelDates}</strong>
          </p>
        </div>
      </div>

      {/* Section 3: Explicit Legal Authorizations */}
      <div className="space-y-2.5 text-[11.5px] leading-relaxed text-slate-800 text-justify">
        <p>
          Yo, <strong>{displayParentName}</strong>, mayor de edad, identificado(a) con documento de identidad N°{' '}
          <strong className="font-mono">{displayParentId}</strong>, actuando en mi calidad de{' '}
          <strong>{displayRelationship}</strong> y representante legal del(de la) deportista{' '}
          <strong>{displayAthleteName}</strong>, identificado(a) con documento N°{' '}
          <strong className="font-mono">{displayAthleteDoc}</strong>, por medio del presente documento manifiesto de
          manera libre, expresa y voluntaria que <strong>AUTORIZO</strong> lo siguiente:
        </p>

        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Participación en el Campeonato Nacional Interclubes CTG26:</strong> Autorizo su inscripción y
            participación deportiva en el <strong>Campeonato Nacional Interclubes CTG26</strong> de Lucha Olímpica, a
            realizarse del <strong>{TOURNAMENT_DATES}</strong> en <strong>{TOURNAMENT_LOCATION}</strong>, en
            representación del club/escuela <strong>{displayClubName}</strong>, dentro de la categoría{' '}
            <strong>{displayCategory}</strong>, declarando que se encuentra en condiciones físicas y de salud aptas para
            la competencia y asumiendo los riesgos propios de la disciplina.
          </li>
          <li>
            <strong>Viaje y Desplazamiento bajo Responsabilidad del Entrenador:</strong> Autorizo expresamente al
            deportista para desplazarse y viajar (ida y regreso) desde la ciudad de <strong>{displayOriginCity}</strong>{' '}
            hacia la ciudad de Cartagena de Indias y retornar a su lugar de origen en el medio de transporte{' '}
            <strong>{displayTransport}</strong> durante las fechas <strong>{displayTravelDates}</strong>, bajo la
            supervisión, cuidado, acompañamiento y responsabilidad directa de su entrenador oficial{' '}
            <strong>{displayCoachName}</strong> (C.C. <span className="font-mono">{displayCoachId}</span>), quien actuará
            como adulto responsable del grupo durante todo el desplazamiento y las jornadas deportivas.
          </li>
          <li>
            <strong>Alojamiento en el Hotel de la Delegación:</strong> Autorizo expresamente para que el(la) deportista
            se aloje y pernocte en el establecimiento hotelero asignado a la delegación:{' '}
            <strong>{displayHotelName}</strong> (ubicado en <strong>{displayHotelAddress}</strong>), durante toda la
            permanencia del equipo en la ciudad sede, comprometiéndose el deportista a acatar los reglamentos internos del
            hotel, los horarios de descanso y las instrucciones disciplinarias impartidas por el entrenador responsable y
            el delegado oficial (<strong>{displayDelegateName}</strong>).
          </li>
          <li>
            <strong>Atención Médica de Urgencia y Autoridad Disciplinaria:</strong> Autorizo al entrenador responsable y
            al delegado de la delegación para que, ante cualquier eventualidad médica, lesión o emergencia durante el
            viaje, la estadía en el hotel o la competencia, gestionen su atención inmediata ante los servicios médicos y
            su EPS/aseguradora (<strong>{displayEps}</strong>), manteniéndome informado(a) de manera oportuna al teléfono{' '}
            <span className="font-mono">{displayParentPhone}</span>. Eximo de responsabilidad al Comité Organizador del
            CTG26 por contingencias ocurridas fuera de los escenarios de competencia, traslados o estadía hotelera.
          </li>
        </ol>
      </div>

      {/* Section 4: Signatures */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 text-center text-[11px] text-slate-700">
        <div>
          <div className="h-14 border-b border-slate-500 mb-1.5" />
          <p className="font-bold text-slate-950">Firma Padre / Madre o Acudiente</p>
          <p className="text-[10px] text-slate-600 mt-0.5">
            Nombre: {parentInfo.parentName.trim() || '_____________________'}
          </p>
          <p className="text-[10px] text-slate-600 font-mono">
            C.C.: {parentInfo.parentId.trim() || '___________________'}
          </p>
        </div>

        <div className="flex flex-col items-center justify-end">
          <div className="w-20 h-16 border border-slate-400 rounded-md mb-1 flex items-center justify-center text-[9px] text-slate-400 uppercase font-semibold">
            Huella Índice
          </div>
          <p className="text-[10px] text-slate-500">Opcional / Validación</p>
        </div>

        <div>
          <div className="h-14 border-b border-slate-500 mb-1.5" />
          <p className="font-bold text-slate-950">Vo.Bo. Entrenador Responsable</p>
          <p className="text-[10px] text-slate-600 mt-0.5">
            {club.coachName.trim() || '_____________________'}
          </p>
          <p className="text-[10px] text-slate-600 font-mono">
            C.C.: {travelInfo.coachIdDocument.trim() || '___________________'}
          </p>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 text-center pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-1">
        <span>
          Ciudad y fecha de firma: __________________________, ____ de __________________ de 2026
        </span>
        <span>Sistema Oficial CTG26 · Cartagena de Indias</span>
      </div>
    </article>
  );
};

export const ParentalAuthorizationModal: React.FC<ParentalAuthorizationModalProps> = ({
  isOpen,
  onClose,
  club,
  competitors,
  initialCompetitorId,
  travelInfo,
  onUpdateTravelInfo,
  parentInfos,
  onUpdateParentInfo,
}) => {
  const [printMode, setPrintMode] = useState<PrintMode>(
    competitors.length > 0 ? 'single' : 'blank'
  );
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>(
    initialCompetitorId || competitors[0]?.id || ''
  );
  const [showConfig, setShowConfig] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    if (initialCompetitorId) {
      setSelectedCompetitorId(initialCompetitorId);
      setPrintMode('single');
    } else if (competitors.length === 0) {
      setPrintMode('blank');
    } else {
      setPrintMode((prev) => (prev === 'blank' ? 'single' : prev));
      if (!selectedCompetitorId || !competitors.some((c) => c.id === selectedCompetitorId)) {
        setSelectedCompetitorId(competitors[0].id);
      }
    }
  }, [isOpen, initialCompetitorId, competitors, selectedCompetitorId]);

  if (!isOpen) return null;

  const selectedCompetitor =
    competitors.find((c) => c.id === selectedCompetitorId) || competitors[0] || null;

  const currentParentInfo =
    selectedCompetitor && parentInfos[selectedCompetitor.id]
      ? parentInfos[selectedCompetitor.id]
      : EMPTY_PARENT_INFO;

  const handleTravelField = (field: keyof DelegationTravelInfo, value: string) => {
    onUpdateTravelInfo({ ...travelInfo, [field]: value });
  };

  const handleParentField = (field: keyof ParentGuardianInfo, value: string) => {
    if (!selectedCompetitor) return;
    onUpdateParentInfo(selectedCompetitor.id, {
      ...currentParentInfo,
      [field]: value,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const pagesToRender: Array<{ competitor: Competitor | null; parentInfo: ParentGuardianInfo; key: string }> =
    printMode === 'all' && competitors.length > 0
      ? competitors.map((comp) => ({
          competitor: comp,
          parentInfo: parentInfos[comp.id] || EMPTY_PARENT_INFO,
          key: comp.id,
        }))
      : printMode === 'single' && selectedCompetitor
      ? [
          {
            competitor: selectedCompetitor,
            parentInfo: currentParentInfo,
            key: selectedCompetitor.id,
          },
        ]
      : [
          {
            competitor: null,
            parentInfo: EMPTY_PARENT_INFO,
            key: 'blank-template',
          },
        ];

  return (
    <div
      id="modal-parental-authorization"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Header - Screen only */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Autorización de Padres: Participación, Viaje y Hotel
              </h2>
              <p className="text-xs text-slate-400">
                Permiso oficial para viajar con el entrenador responsable y alojarse con la delegación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-xs transition-colors"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-8 overflow-y-auto print:p-0 print:overflow-visible space-y-6">
          {/* Screen-only Configuration Toolbar */}
          <div className="print:hidden bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {/* Mode selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                {competitors.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPrintMode('single')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        printMode === 'single'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Por Deportista</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintMode('all')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        printMode === 'all'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Toda la Nómina ({competitors.length} págs.)</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setPrintMode('blank')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    printMode === 'blank'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Formato en Blanco</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
              >
                <span>{showConfig ? 'Ocultar datos editables' : 'Editar hotel, viaje y acudiente'}</span>
                {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showConfig && (
              <div className="p-4 space-y-4">
                {/* Athlete selector when in single mode */}
                {printMode === 'single' && competitors.length > 0 && (
                  <div>
                    <label
                      htmlFor="select-auth-athlete"
                      className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Deportista seleccionado para esta autorización
                    </label>
                    <select
                      id="select-auth-athlete"
                      value={selectedCompetitor?.id || ''}
                      onChange={(e) => setSelectedCompetitorId(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    >
                      {competitors.map((comp) => (
                        <option key={comp.id} value={comp.id}>
                          {comp.fullName} — {comp.ageCategory} · {comp.modality} ({comp.weightDivision}) · Doc: {comp.idDocument}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Delegation Travel & Hotel Config */}
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-amber-600" />
                      Logística de Viaje y Hotel de la Delegación
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Nombre del Hotel
                        </label>
                        <input
                          type="text"
                          value={travelInfo.hotelName}
                          onChange={(e) => handleTravelField('hotelName', e.target.value)}
                          placeholder="Ej. Hotel Caribe Cartagena"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Dirección / Sector del Hotel
                        </label>
                        <input
                          type="text"
                          value={travelInfo.hotelAddress}
                          onChange={(e) => handleTravelField('hotelAddress', e.target.value)}
                          placeholder="Ej. Bocagrande Cra. 1 # 2-87"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Ciudad de Origen
                        </label>
                        <input
                          type="text"
                          value={travelInfo.originCity}
                          onChange={(e) => handleTravelField('originCity', e.target.value)}
                          placeholder="Ej. Bogotá D.C. / Medellín"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Medio de Transporte
                        </label>
                        <input
                          type="text"
                          value={travelInfo.transportMode}
                          onChange={(e) => handleTravelField('transportMode', e.target.value)}
                          placeholder="Ej. Aéreo / Bus Expreso"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          C.C. Entrenador Responsable
                        </label>
                        <input
                          type="text"
                          value={travelInfo.coachIdDocument}
                          onChange={(e) => handleTravelField('coachIdDocument', e.target.value)}
                          placeholder="Cédula del entrenador"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Fechas de Viaje y Estadía
                        </label>
                        <input
                          type="text"
                          value={travelInfo.travelDates}
                          onChange={(e) => handleTravelField('travelDates', e.target.value)}
                          placeholder="Ej. 2 al 7 de diciembre del 2026"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parent Info for Selected Athlete */}
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-amber-600" />
                      Datos del Padre / Acudiente{' '}
                      {printMode === 'single' && selectedCompetitor ? '(Opcional - o llenar a mano)' : ''}
                    </h4>
                    {printMode === 'single' && selectedCompetitor ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Nombre Completo del Padre / Madre / Tutor
                          </label>
                          <input
                            type="text"
                            value={currentParentInfo.parentName}
                            onChange={(e) => handleParentField('parentName', e.target.value)}
                            placeholder="Dejar vacío para imprimir línea de firma manual"
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Cédula del Padre / Tutor
                          </label>
                          <input
                            type="text"
                            value={currentParentInfo.parentId}
                            onChange={(e) => handleParentField('parentId', e.target.value)}
                            placeholder="Número de C.C."
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Parentesco
                          </label>
                          <select
                            value={currentParentInfo.relationship}
                            onChange={(e) => handleParentField('relationship', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                          >
                            <option value="Padre / Madre">Padre / Madre</option>
                            <option value="Padre">Padre</option>
                            <option value="Madre">Madre</option>
                            <option value="Representante Legal">Representante Legal</option>
                            <option value="Acudiente Autorizado">Acudiente Autorizado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Teléfono de Emergencia
                          </label>
                          <input
                            type="tel"
                            value={currentParentInfo.parentPhone}
                            onChange={(e) => handleParentField('parentPhone', e.target.value)}
                            placeholder="Celular del acudiente"
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            EPS / Seguro Médico del Deportista
                          </label>
                          <input
                            type="text"
                            value={currentParentInfo.epsName}
                            onChange={(e) => handleParentField('epsName', e.target.value)}
                            placeholder="Ej. Sura / Sanitas / Nueva EPS"
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-amber-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 py-3">
                        {printMode === 'all'
                          ? 'En el modo "Toda la Nómina" se generará una hoja individual por cada deportista registrado, conservando los datos del hotel y entrenador de la delegación para que cada padre firme su documento.'
                          : 'El formato en blanco incluye los datos del club, entrenador y hotel de la delegación, dejando espacios listos para diligenciar a mano los datos del deportista y su acudiente.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Preview & Printable Pages */}
          <div className="space-y-8 print:space-y-0">
            {pagesToRender.map((page, index) => (
              <AuthorizationDocumentPage
                key={page.key}
                club={club}
                competitor={page.competitor}
                travelInfo={travelInfo}
                parentInfo={page.parentInfo}
                isLast={index === pagesToRender.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Modal Footer - Screen only */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between print:hidden shrink-0">
          <span className="text-xs text-slate-500">
            Documento listo para imprimir o guardar en PDF y entregar firmado por los padres antes del viaje.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
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
