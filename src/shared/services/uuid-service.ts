import { v4 as uuid } from "uuid";

export class UuidService {
  static generate() {
    return uuid();
  }
}
