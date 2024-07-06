import {
  IvaoMetar,
  IvaoTAF,
} from '@ivaoby/common/types/data/internal/ivao-weather';

export interface Airport {
  icao: string;
  iata: string | null;
  airportTypeId: number | null;
  description: {
    en: string | null;
    ru: string | null;
    be: string | null;
  };
  name: {
    en: string | null;
    ru: string | null;
    be: string | null;
  };
  latitude: number;
  longitude: number;
  elevation: number;
  magnetic: number;
  status: boolean | null;
  image_url: string | null;
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
  metar?: IvaoMetar;
  taf?: IvaoTAF;
}
