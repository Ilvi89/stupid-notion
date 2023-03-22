import { Identifier } from "./Identifier";

export class UniqueEntityID extends Identifier<string | number>{
  constructor (id: string | number) {
    super(id)
  }

  toString(): string {
    return super.toString();
  }
}