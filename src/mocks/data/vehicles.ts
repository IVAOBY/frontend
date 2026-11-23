import type { VehiclePermissionEntity } from '../../api/model';

import { people } from './users';
import { at } from './utils';

// Охватывает все статусы на /vehicles: активное (бессрочное и до даты), будущее, истёкшее, отозванное.
export const vehiclePermissions: VehiclePermissionEntity[] = [
  {
    id: '6f1c2a10-0001-4c7e-9a10-000000000001',
    vid: people.controllerA.id,
    validFrom: at(-120, 0),
    validUntil: null,
    issuedByVid: people.atcOps.id,
    issuedVia: 'web',
    issueReason:
      'Successfully parallel-parked between two Boeing 737s without scratching a single winglet',
    createdAt: at(-120, 9),
    revokedAt: null,
    revokedByVid: null,
  },
  {
    id: '6f1c2a10-0002-4c7e-9a10-000000000002',
    vid: people.controllerB.id,
    validFrom: at(-10, 0),
    validUntil: at(50, 0),
    issuedByVid: people.atcOps.id,
    issuedVia: 'web',
    issueReason:
      'Temporary permit for Minsk RFE — signed a blood oath not to drag-race A320s on RWY 31R',
    createdAt: at(-10, 12),
    revokedAt: null,
    revokedByVid: null,
  },
  {
    id: '6f1c2a10-0003-4c7e-9a10-000000000003',
    vid: people.controllerC.id,
    validFrom: at(7, 0),
    validUntil: at(37, 0),
    issuedByVid: people.trainingAdvisor.id,
    issuedVia: 'discord',
    issueReason: null,
    createdAt: at(-1, 15),
    revokedAt: null,
    revokedByVid: null,
  },
  {
    id: '6f1c2a10-0004-4c7e-9a10-000000000004',
    vid: 720004,
    validFrom: at(-90, 0),
    validUntil: at(-30, 0),
    issuedByVid: people.atcOps.id,
    issuedVia: 'web',
    issueReason: 'Summer apron drift season (strictly under 15 kt, allegedly)',
    createdAt: at(-90, 10),
    revokedAt: null,
    revokedByVid: null,
  },
  {
    id: '6f1c2a10-0005-4c7e-9a10-000000000005',
    vid: 720005,
    validFrom: at(-60, 0),
    validUntil: null,
    issuedByVid: people.atcOps.id,
    issuedVia: 'web',
    issueReason:
      'Revoked after attempting to give a Follow-Me escort to a hovering helicopter',
    createdAt: at(-60, 18),
    revokedAt: at(-5, 20),
    revokedByVid: people.director.id,
  },
];
