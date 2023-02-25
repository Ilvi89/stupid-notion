import { UniqueEntityID } from "./UniqueEntityID";

export interface Repository<T> {
  find(id: UniqueEntityID): Promise<T>
  exists(t: T): Promise<boolean>;
  save(t: T): Promise<T>;
  getNewId(): UniqueEntityID;
}