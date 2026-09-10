import { ClubInfo, Competitor, REGISTRATION_FEE_COP } from '../types';

export function generateCompetitorsCSV(club: ClubInfo, competitors: Competitor[]): string {
  // Add UTF-8 Byte Order Mark (BOM) so Excel in Spanish opens special characters cleanly
  const BOM = '\uFEFF';

  const headers = [
    'N°',
    'Club / Escuela',
    'Entrenador',
    'Delegado',
    'Árbitro / Juez',
    'Email Contacto',
    'Teléfono Contacto',
    'Nombre Completo Deportista',
    'Documento Identidad',
    'Fecha Nacimiento',
    'Categoría Edad',
    'Modalidad',
    'División de Peso',
    'Costo Inscripción (COP)',
    'Fecha de Registro',
  ];

  const escapeCSV = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = competitors.map((comp, index) => [
    escapeCSV(index + 1),
    escapeCSV(club.clubName || 'Sin especificar'),
    escapeCSV(club.coachName || 'Sin especificar'),
    escapeCSV(club.delegateName || 'Sin especificar'),
    escapeCSV(club.refereeName || 'Sin especificar'),
    escapeCSV(club.email || 'Sin especificar'),
    escapeCSV(club.phone || 'Sin especificar'),
    escapeCSV(comp.fullName),
    escapeCSV(comp.idDocument),
    escapeCSV(comp.birthDate),
    escapeCSV(comp.ageCategory),
    escapeCSV(comp.modality),
    escapeCSV(comp.weightDivision),
    escapeCSV(REGISTRATION_FEE_COP),
    escapeCSV(new Date(comp.createdAt).toLocaleDateString('es-CO')),
  ]);

  const csvContent = [
    headers.map((h) => `"${h}"`).join(';'),
    ...rows.map((r) => r.join(';')),
  ].join('\r\n');

  return BOM + csvContent;
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
