import { Entity } from "../../shared/domain/Entity";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";


type UserProps = {}
export class User extends Entity<UserProps> {
  static  create(id: UniqueEntityID): User {
    return new User(id, {});
  }
}