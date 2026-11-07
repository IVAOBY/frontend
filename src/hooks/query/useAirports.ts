import {
  useAirportsGetAllAirports,
  useAirportsSearchAirport,
} from '../../api/airports/airports';

const STALE_TIME = 60 * 60 * 1000;
const GC_TIME = 6 * 60 * 60 * 1000;

export const useAirports = () => {
  return useAirportsGetAllAirports({
    query: { staleTime: STALE_TIME, gcTime: GC_TIME },
  });
};

export const useAirportById = (icao: string | undefined = undefined) => {
  return useAirportsSearchAirport(
    { search: icao ?? '' },
    { query: { enabled: !!icao, staleTime: STALE_TIME, gcTime: GC_TIME } },
  );
};
