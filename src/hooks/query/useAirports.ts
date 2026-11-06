import { useQuery } from '@tanstack/react-query';

import { Airport } from '../../types/Airport';
import Http from '../../utils/Http';

export const fetchAirport = async () => {
  return Http<Airport[]>({
    method: 'GET',
    url: `/airports/all`,
  });
};

export const fetchAirportById = (icao: string | undefined) => {
  return Http<Airport[]>({
    method: 'GET',
    url: `/airports?search=${encodeURIComponent(icao)}`,
  });
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
  {
    /*TODO: Use airport from useAirports, if this exist*/
  }
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
