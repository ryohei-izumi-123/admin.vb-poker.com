export interface IResult {
  result?: boolean;
}
export interface IResultData<T> {
  data?: T;
  pagination?: IResultPagination;
}
export interface IResultPagination {
  page?: number;
  per_page?: number;
  total?: number;
}
