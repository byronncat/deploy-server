export enum QueryCondition {
  Or,
  And,
}

export type QueryOptions = {
  condition?: QueryCondition;
  excludeCondition?: boolean;
  findById?: boolean;
  skip?: number | null;
  limit?: number | null;
  random?: boolean;
};

export const DEFAULT_OPTIONS: QueryOptions = {
  condition: QueryCondition.And,
  excludeCondition: false,
  findById: false,
  skip: null,
  limit: null,
  random: false,
};

export function mapObjectToQuery(data: Object): Object[] {
  return Object.entries(data).map(([key, value]) => ({ [key]: value }));
}
