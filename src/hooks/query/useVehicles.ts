import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Http from '../../utils/Http';

/**
 * DTO от backend
 * (/vehicles/active — урезанный,
 *  /vehicles/all — полный)
 */
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

/**
 * Возможные статусы разрешения
 */
export type VehiclePermissionStatus = 'active' | 'inactive' | 'revoked';

/**
 * UI-модель
 */
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

/**
 * Определение статуса (ТОЛЬКО для /vehicles/all)
 */
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

/**
 * GET /vehicles/active
 */
const fetchActiveVehicles = async (): Promise<VehiclePermission[]> => {
  const data = await Http<VehiclePermissionDto[]>({
    method: 'GET',
    url: '/vehicles/active',
  });

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

/**
 * GET /vehicles/all
 */
const fetchAllVehicles = async (): Promise<VehiclePermission[]> => {
  const data = await Http<VehiclePermissionDto[]>({
    method: 'GET',
    url: '/vehicles/all',
  });

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

/**
 * React Query hook (read)
 */
export const useVehicles = (adminMode: boolean = false) => {
  return useQuery<VehiclePermission[], Error>({
    queryKey: ['vehicles', adminMode ? 'all' : 'active'],
    queryFn: adminMode ? fetchAllVehicles : fetchActiveVehicles,
    staleTime: adminMode ? 2 * 60 * 1000 : 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/* ============================================================
   MUTATIONS
   ============================================================ */

/**
 * POST /vehicles
 */
const createVehiclePermission = async (payload: {
  vid: number;
  validFrom: string;
  validUntil: string | null;
  issueReason: string | null;
}) => {
  return Http({
    method: 'POST',
    url: '/vehicles',
    data: payload,
  });
};

/**
 * POST /vehicles/revoke
 */
const revokeVehiclePermission = async (id: string) => {
  return Http({
    method: 'POST',
    url: '/vehicles/revoke',
    data: { id },
  });
};

/**
 * Create hook
 */
export const useCreateVehiclePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVehiclePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

/**
 * Revoke hook
 */
export const useRevokeVehiclePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeVehiclePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
