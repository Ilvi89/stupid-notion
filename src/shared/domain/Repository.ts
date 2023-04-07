import { UniqueEntityID } from "./UniqueEntityID";

export interface ReadRepository<T> {
  find(id: UniqueEntityID): Promise<T>
  exists(t: T): Promise<boolean>;
}

export interface Repository<T> extends ReadRepository<T>{
  save(t: T): Promise<T>;
  getNewId(): UniqueEntityID;
}

