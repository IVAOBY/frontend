import { useQueryClient } from '@tanstack/react-query';

import type {
  ActiveVehiclePermissionDto,
  VehiclePermissionWithStatusDto,
} from '../../api/model';

import {
  getVehiclesGetActiveQueryKey,
  getVehiclesGetAllQueryKey,
  useVehiclesCreate,
  useVehiclesGetActive,
  useVehiclesGetAll,
  useVehiclesRevoke,
} from '../../api/vehicles/vehicles';

// The OpenAPI spec doesn't describe these fields yet, so they are declared here.
type VehiclePermissionDto = {
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
};

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

const mapActive = (data: ActiveVehiclePermissionDto[]): VehiclePermission[] =>
  (data as VehiclePermissionDto[]).map((p) => ({
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

const mapAll = (
  data: VehiclePermissionWithStatusDto[],
): VehiclePermission[] => {
  const now = new Date();

  return (
    data as (VehiclePermissionWithStatusDto & VehiclePermissionDto)[]
  ).map((p) => ({
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
  const allQuery = useVehiclesGetAll({
    query: {
      enabled: adminMode,
      select: mapAll,
      staleTime: 2 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  });
  const activeQuery = useVehiclesGetActive({
    query: {
      enabled: !adminMode,
      select: mapActive,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  });

  return adminMode ? allQuery : activeQuery;
};

const useInvalidateVehicles = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: getVehiclesGetActiveQueryKey(),
      }),
      queryClient.invalidateQueries({ queryKey: getVehiclesGetAllQueryKey() }),
    ]);
};

export const useCreateVehiclePermission = () => {
  const invalidate = useInvalidateVehicles();
  return useVehiclesCreate({ mutation: { onSuccess: invalidate } });
};

export const useRevokeVehiclePermission = () => {
  const invalidate = useInvalidateVehicles();
  return useVehiclesRevoke({ mutation: { onSuccess: invalidate } });
};
