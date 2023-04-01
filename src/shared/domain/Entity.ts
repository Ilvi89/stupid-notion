import { UniqueEntityID } from "./UniqueEntityID";

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;
  protected readonly props: T;

  constructor(id: UniqueEntityID, props: T) {
    this._id = id;
    this.props = props;
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  public equals(object?: Entity<T>): boolean {

    if (object == null) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}