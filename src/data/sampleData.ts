import { ClubInfo, Competitor } from '../types';

export const SAMPLE_CLUB_INFO: ClubInfo = {
  clubName: 'Club Gladiadores del Caribe',
  coachName: 'Prof. Carlos Mario Mendoza',
  delegateName: 'Lic. Andrés Felipe Gómez',
  refereeName: 'Juez Nac. Roberto Silva',
  email: 'gladiadores.caribe@gmail.com',
  phone: '+57 310 458 9921',
  logoUrl: '',
};

export const SAMPLE_COMPETITORS: Competitor[] = [
  {
    id: 'comp-1',
    fullName: 'Mateo Alejandro Torres Ruiz',
    birthDate: '2017-04-15',
    idDocument: '1.143.892.401',
    ageCategory: 'U9',
    modality: 'Libre Masculino',
    weightDivision: '30kg',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'comp-2',
    fullName: 'Valeria Sofía Herrera Castro',
    birthDate: '2014-08-22',
    idDocument: '1.098.456.120',
    ageCategory: 'U12',
    modality: 'Libre Femenino',
    weightDivision: '33kg',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'comp-3',
    fullName: 'Juan David Martínez Ospina',
    birthDate: '2011-02-10',
    idDocument: '1.045.789.332',
    ageCategory: 'U15',
    modality: 'Grecorromana',
    weightDivision: '57kg',
    createdAt: Date.now() - 1000 * 60 * 50,
  },
  {
    id: 'comp-4',
    fullName: 'Camila Andrea Barrios Pineda',
    birthDate: '2012-11-05',
    idDocument: '1.082.901.543',
    ageCategory: 'U15',
    modality: 'Libre Femenino',
    weightDivision: '50kg',
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'comp-5',
    fullName: 'Santiago Morales Gutiérrez',
    birthDate: '2009-06-18',
    idDocument: '1.002.345.890',
    ageCategory: 'U17',
    modality: 'Libre Masculino',
    weightDivision: '65kg',
    createdAt: Date.now() - 1000 * 60 * 10,
  },
];
