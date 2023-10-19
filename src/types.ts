export interface User {
  name: string;
  id: number;
  age: number;
}

export interface Query {
  name: string;
  age: string;
  limit: number;
  offset: number;
}

export interface FiltersData {
  name: string;
  age: string;
};

export interface PaginationData {
  offset: number;
  limit: number;
}