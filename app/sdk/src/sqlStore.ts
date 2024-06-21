export interface SqlStore {
  query(stmt: string, params: (string | number)[]): any[];
}
