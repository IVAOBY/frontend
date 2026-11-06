import { useQuery } from '@tanstack/react-query';

import { Airport } from '../../types/Airport';
import {
  airportsControllerGetAllAirports,
  airportsControllerSearchAirport,
} from '../../api/airports/airports';

export const fetchAirport = async () => {
  return airportsControllerGetAllAirports() as unknown as Promise<Airport[]>;
};

export const fetchAirportById = (icao: string | undefined) => {
  return airportsControllerSearchAirport({
    search: encodeURIComponent(icao!),
  }) as unknown as Promise<Airport[]>;
};

export const useAirports = () => {
  return useQuery({
    queryKey: ['airports'],
    queryFn: async () => {
      return await fetchAirport();
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
  });
};

export const useAirportById = (icao: string | undefined = undefined) => {
  return useQuery({
    queryKey: ['airports', icao],
    queryFn: async () => {
      if (!icao) throw new Error('Airport ICAO is required for fetching data.');
      return await fetchAirportById(icao);
    },
    enabled: !!icao,
    staleTime: 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
  });
};
