import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  vehiclesControllerCancel,
  vehiclesControllerCreate,
  vehiclesControllerEdit,
  vehiclesControllerGetActive,
  vehiclesControllerGetAll,
  vehiclesControllerRevoke,
} from '../../api/vehicles/vehicles';

interface VehiclePermissionDto {
  id: string;
  vid: number;
  validFrom: string;
  validUntil: string | null;

  issuedByVid?: number;
  issuedVia?: string;
  issueReason?: string | null;
  createdAt?: string;

  revokedAt?: string | null;
  revokedByVid?: number | null;
}

export type VehiclePermissionStatus = 'active' | 'inactive' | 'revoked';

export interface VehiclePermission {
  id: string;
  vid: number;

  validFrom: Date;
  validUntil: Date | null;

  issuedByVid: number | null;
  issuedVia: string | null;
  issueReason: string | null;
  createdAt: Date | null;

  revokedAt: Date | null;
  revokedByVid: number | null;

  status: VehiclePermissionStatus;
}

const resolveStatus = (
  dto: VehiclePermissionDto,
  now: Date,
): VehiclePermissionStatus => {
  if (dto.revokedAt) return 'revoked';

  const validFrom = new Date(dto.validFrom);
  const validUntil = dto.validUntil ? new Date(dto.validUntil) : null;

  if (validFrom > now) return 'inactive';
  if (validUntil && validUntil < now) return 'inactive';

  return 'active';
};

const fetchActiveVehicles = async (): Promise<VehiclePermission[]> => {
  const data = await (vehiclesControllerGetActive() as unknown as Promise<
    VehiclePermissionDto[]
  >);

  if (!Array.isArray(data)) return [];

  return data.map((p) => ({
    id: p.id,
    vid: p.vid,

    validFrom: new Date(p.validFrom),
    validUntil: p.validUntil ? new Date(p.validUntil) : null,

    issuedByVid: null,
    issuedVia: null,
    issueReason: null,
    createdAt: null,

    revokedAt: null,
    revokedByVid: null,

    status: 'active',
  }));
};

const fetchAllVehicles = async (): Promise<VehiclePermission[]> => {
  const data = await (vehiclesControllerGetAll() as unknown as Promise<
    VehiclePermissionDto[]
  >);

  if (!Array.isArray(data)) return [];

  const now = new Date();

  return data.map((p) => ({
    id: p.id,
    vid: p.vid,

    validFrom: new Date(p.validFrom),
    validUntil: p.validUntil ? new Date(p.validUntil) : null,

    issuedByVid: p.issuedByVid ?? null,
    issuedVia: p.issuedVia ?? null,
    issueReason: p.issueReason ?? null,
    createdAt: p.createdAt ? new Date(p.createdAt) : null,

    revokedAt: p.revokedAt ? new Date(p.revokedAt) : null,
    revokedByVid: p.revokedByVid ?? null,

    status: resolveStatus(p, now),
  }));
};

export const useVehicles = (adminMode: boolean = false) => {
  return useQuery<VehiclePermission[], Error>({
    queryKey: ['vehicles', adminMode ? 'all' : 'active'],
    queryFn: adminMode ? fetchAllVehicles : fetchActiveVehicles,
    staleTime: adminMode ? 2 * 60 * 1000 : 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCreateVehiclePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      vid: number;
      validFrom: string;
      validUntil: string | null;
      issueReason: string | null;
    }) =>
      vehiclesControllerCreate({
        vid: payload.vid,
        validFrom: payload.validFrom,
        validUntil: payload.validUntil ?? undefined,
        issueReason: payload.issueReason ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useEditVehiclePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: string;
      validFrom?: string;
      validUntil?: string | null;
      issueReason?: string | null;
    }) =>
      vehiclesControllerEdit({
        id: payload.id,
        validFrom: payload.validFrom!,
        validUntil: payload.validUntil ?? undefined,
        issueReason: payload.issueReason ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useCancelVehiclePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehiclesControllerCancel({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useRevokeVehiclePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehiclesControllerRevoke({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
