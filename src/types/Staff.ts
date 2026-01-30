export interface DepartmentWithPositions {
  id: string;
  order: number;
  name: string;
  email: string;
  positions: StaffPosition[];
}

export interface StaffPosition {
  departmentId: string;
  prefix: string;
  id: string;
  order: number;
  is_vacant: number;
  name: {
    en: string;
  };
  user: {
    id: number;
    name: {
      first: string;
      last: string | null;
    };
  } | null;
}