import { ReadRepository } from "../../../shared/domain/Repository";
import { User } from "../User";

export interface IUserRepo extends ReadRepository<User> {

}