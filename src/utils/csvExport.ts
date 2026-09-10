import { ClubInfo, Competitor } from '../types';
import { getStandardLogoFileName } from './imageUtils';

export const CSV_TEMPLATE_HEADERS = [
  'nombre_club',
  'logo_club',
  'nombre_entrenador',
  'nombre_delegado',
  'nombre_arbitro',
  'correo_club',
  'telefono_club',
  'nombre_deportista',
  'fecha_nacimiento',
  'numero_documento',
  'categoria',
  'estilo',
  'division_peso',
];

/**
 * Resolves the most efficient value for the logo_club column based on mode and availability
 */
export function resolveCSVLogoValue(club: ClubInfo, explicitMode?: 'filename' | 'url' | 'base64'): string {
  const mode = explicitMode || club.logoMode || 'filename';

  if (mode === 'url') {
    if (club.logoExternalUrl && club.logoExternalUrl.trim().length > 0) {
      return club.logoExternalUrl.trim();
    }
    if (club.logoUrl && (club.logoUrl.startsWith('http://') || club.logoUrl.startsWith('https://'))) {
      return club.logoUrl;
    }
    // Fallback if no URL was provided
    return getStandardLogoFileName(club.clubName, club.logoFileName);
  }

  if (mode === 'base64') {
    // Prefer compact base64 if available to keep CSV lightweight and within cell constraints
    if (club.logoCompactBase64) {
      return club.logoCompactBase64;
    }
    if (club.logoUrl && club.logoUrl.startsWith('data:image')) {
      return club.logoUrl;
    }
    return '';
  }

  // Default: standardized clean filename for asset bundle matching
  return club.logoFileName || getStandardLogoFileName(club.clubName, club.logoFileName);
}

export function generateCompetitorsCSV(
  club: ClubInfo,
  competitors: Competitor[],
  overrideLogoValue?: string
): string {
  // UTF-8 Byte Order Mark (BOM) for correct international character encoding in spreadsheet and management platforms
  const BOM = '\uFEFF';

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '';
    const str = String(value).trim();
    // Wrap in quotes if it contains commas, double quotes, or line breaks
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = CSV_TEMPLATE_HEADERS.join(',');

  // Resolve efficient logo representation
  const logoValue = overrideLogoValue !== undefined ? overrideLogoValue : resolveCSVLogoValue(club);

  const dataRows = competitors.map((comp) =>
    [
      escapeCSV(club.clubName || ''),
      escapeCSV(logoValue),
      escapeCSV(club.coachName || ''),
      escapeCSV(club.delegateName || ''),
      escapeCSV(club.refereeName || ''),
      escapeCSV(club.email || ''),
      escapeCSV(club.phone || ''),
      escapeCSV(comp.fullName || ''),
      escapeCSV(comp.birthDate || ''),
      escapeCSV(comp.idDocument || ''),
      escapeCSV(comp.ageCategory || ''),
      escapeCSV(comp.modality || ''),
      escapeCSV(comp.weightDivision || ''),
    ].join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\r\n');
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

