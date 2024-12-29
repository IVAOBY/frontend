export interface DecodedTokenInt {
  userData: {
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
  };
  iat: number;
  exp: number;
}

export interface MessagesType {
  title: string;
  message: string;
  link: string;
  linkTitle: string;
}
