import {
  IvaoMetar,
  IvaoTAF,
} from '@ivaoby/common/types/data/internal/ivao-weather';

export interface Airport {
  icao: string;
  iata: string | null;
  airportTypeId: number | null;
  description: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  magnetic: number;
  status: boolean | null;
  atcPositions: {
    id: number;
    callsign: string;
    frequency: string;
    airportIcao: string;
    fra: number;
    name: {
      en: string | null;
      ru: string | null;
      be: string | null;
    };
  }[];
  sceneries: {
    id: number;
    title: string;
    license: 'freeware' | 'payware';
    link: string;
    simulator: 'fs9' | 'fsx' | 'p3d' | 'xp11' | 'xp12' | 'msfs';
    icao: string;
  }[];
  runways: {
    id: number;
    airportIcao: string;
    designation: string;
    heading: number;
    tora: number;
    ils: string;
    ilsCat: '2' | '3';
    gls: string;
    ndb: string;
    vorDme: string;
    loc: string;
    vor: string;
    rnp: string;
  }[];
  metar?: IvaoMetar;
  taf?: IvaoTAF;
}
