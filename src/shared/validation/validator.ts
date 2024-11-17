export interface Validator<T> {
  validate(data: any): T;
}
