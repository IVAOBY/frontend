import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';

import { usePartFindOneEvent } from '../../api/event-parts/event-parts';
import { useEventFindOne } from '../../api/events/events';

export const useEvents = (id: string) => {
  return useEventFindOne(Number(id), {
    query: { enabled: !!id, staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
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
  return usePartFindOneEvent(Number(id), {
    query: {
      enabled: !!id,
      staleTime: 0,
      gcTime: 3600000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  });
};
