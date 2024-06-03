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
  metar?: IvaoMetar;
  taf?: IvaoTAF;
}
