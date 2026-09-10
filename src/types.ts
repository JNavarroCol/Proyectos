export type AgeCategory = 'U9' | 'U12' | 'U15' | 'U17';

export type Modality = 'Libre Masculino' | 'Libre Femenino' | 'Grecorromana';

export interface ClubInfo {
  clubName: string;
  coachName: string;
  delegateName: string;
  refereeName: string;
  email: string;
  phone: string;
  logoUrl?: string;
  logoFileName?: string;
}

export interface Competitor {
  id: string;
  fullName: string;
  birthDate: string;
  idDocument: string;
  ageCategory: AgeCategory;
  modality: Modality;
  weightDivision: string;
  createdAt: number;
}

export interface InformedConsent {
  acceptedVeracity: boolean;
  acceptedParentalAuth: boolean;
  acceptedLiabilityWaiver: boolean;
  signerName: string;
  signerId: string;
  signedAt?: string;
}

export const REGISTRATION_FEE_COP = 60000;

export const CATEGORY_RULES: Record<
  AgeCategory,
  {
    modalities: Modality[];
    weights: Partial<Record<Modality, string[]>>;
    description: string;
  }
> = {
  U9: {
    description: 'Sub-9 (Libre Masculino y Femenino)',
    modalities: ['Libre Masculino', 'Libre Femenino'],
    weights: {
      'Libre Masculino': ['22kg', '30kg', '40kg'],
      'Libre Femenino': ['22kg', '30kg', '40kg'],
    },
  },
  U12: {
    description: 'Sub-12 (Libre Masculino y Femenino)',
    modalities: ['Libre Masculino', 'Libre Femenino'],
    weights: {
      'Libre Masculino': ['25kg', '33kg', '40kg', '48kg'],
      'Libre Femenino': ['25kg', '33kg', '40kg', '48kg'],
    },
  },
  U15: {
    description: 'Sub-15 (Libre Masc./Fem. y Grecorromana)',
    modalities: ['Libre Masculino', 'Grecorromana', 'Libre Femenino'],
    weights: {
      'Libre Masculino': ['41kg', '48kg', '57kg', '68kg', '75kg', '85kg'],
      'Grecorromana': ['41kg', '48kg', '57kg', '68kg', '75kg', '85kg'],
      'Libre Femenino': ['33kg', '39kg', '46kg', '50kg', '55kg', '65kg'],
    },
  },
  U17: {
    description: 'Sub-17 (Cadetes - Libre Masc./Fem. y Grecorromana)',
    modalities: ['Libre Masculino', 'Grecorromana', 'Libre Femenino'],
    weights: {
      'Libre Masculino': ['48kg', '55kg', '60kg', '65kg', '80kg', '110kg'],
      'Grecorromana': ['48kg', '55kg', '60kg', '65kg', '80kg', '110kg'],
      'Libre Femenino': ['43kg', '49kg', '53kg', '57kg', '65kg', '73kg'],
    },
  },
};
