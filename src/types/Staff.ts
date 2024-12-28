export interface DepartmentStaff {
  id: string;
  name: string;
  email: string;
}

export interface PositionStaff {
  departmentId: string;
  id: string;
  name: {
    en: string;
    ru: string | null;
  };
  prefix: string;
  order: number;
  user: {
    id: number;
    name: {
      first: string;
      last: string;
    };
  };
  description: {
    en: string;
    ru: string | null;
  } | null;
  is_vacant: number;
}
