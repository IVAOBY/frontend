import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';

import { EventEntity, PartsEntity } from '../../types/Events';
import Http from '../../utils/Http';

const fetchEvent = (id: string | undefined) => {
  return Http<EventEntity>({
    method: 'GET',
    url: `/events/${id}`,
  });
};

const fetchEventPart = (id: string) => {
  return Http<PartsEntity[]>({
    method: 'GET',
    url: `/events-parts/event/${id}`,
  });
};

export const useEvents = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required for fetching data.');
      return await fetchEvent(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useEventDetails = (id: string) => {
  const { data, error, isLoading } = useEvents(id);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    if (data) {
      if (typeof data === 'object' && !Array.isArray(data)) {
        notifications.hide('load-data');

        const eventStartDate = new Date(data.startDate);
        const currentTime = new Date();
        const sixHoursBeforeEvent = new Date(
          eventStartDate.getTime() - 6 * 60 * 60 * 1000,
        );

        if (currentTime < sixHoursBeforeEvent) {
          setRegistrationStatus('open');
        } else if (currentTime >= eventStartDate) {
          setRegistrationStatus('closed');
        }
      }
    }
  }, [data, error, isLoading]);

  return { data, registrationStatus, isLoading, error };
};

export const useEventParts = (id: string) => {
  return useQuery({
    queryKey: ['event-parts', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required for fetching data.');
      return await fetchEventPart(id);
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 3600000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
