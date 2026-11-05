export interface User {
  id: number;
  ratings: {
    atc: {
      id: number;
      name: string;
      shortName: string;
    };
    pilot: {
      id: number;
      name: string;
      shortName: string;
    };
  };
  hours: {
    atc: number;
    pilot: number;
    staff: number;
  };
  staffPositions: string[];
  staffDepartments: (string | null)[];
  name: {
    first: string;
    last: string;
  };
  centerId: string;
  countryId: string;
  divisionId: string;
}

export interface PartsEntity {
  id: number;
  eventId: number;
  event: EventEntity;
  startDate: Date;
  endDate: Date;
  positions: EventAtcPositions[];
  booking: BookingEntity[];
}

export interface EventTag {
  id: number;
  category: 'user' | 'int' | 'div';
  type:
    | 'Airbridge'
    | 'FlyOut'
    | 'FlyIn'
    | 'Online'
    | 'MSE'
    | 'RFO'
    | 'RFE'
    | 'Pass'
    | 'PDE'
    | 'VFR'
    | 'IRL'
    | 'SO';
  hq: boolean;
}

export interface EventEntity {
  id: number;
  startDate: Date;
  endDate: Date;
  name: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  imageUrl: string;
  infoUrl: string;
  airport: string;
  tags?: EventTag | null;
}

export interface BookingEntity {
  id: number;
  eventId: number;
  event: EventEntity;
  eventPartId: PartsEntity;
  bookedUserId: number | null;
  bookedUser: User | null;
  atcPositionId: number;
  atcPosition: EventAtcPositions;
  status: number;
  statusUserId: number | null;
  statusUser: User | null;
}

export interface BookingCreateData {
  eventId: number;
  eventPartId: number;
  atcPositionId: number;
}

export interface EventAtcPositions {
  id: number;
  eventId: number;
  eventPartId: PartsEntity;
  atcPositionId: number;
  position: AtcEntity;
}

export interface AtcEntity {
  id: number;
  callsign: string;
  frequency: string;
  airportIcao: string;
  fra: number;
  name: {
    en: string | null;
    ru: string | null;
    be: string | null;
  };
}
