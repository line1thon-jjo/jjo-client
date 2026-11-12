export class ApiError extends Error {
  status: number;
  code: string;
  fields: string[];

  constructor(status: number, code: string, fields: string[] = []) {
    super(code);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
