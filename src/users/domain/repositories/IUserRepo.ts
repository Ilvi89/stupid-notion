import { Email } from "../valueObjects/Email";
import { UserAggregate } from "../userAggregate";
import { Repository } from "../../../shared/domain/Repository";
import { Login } from "../valueObjects/Login";

export interface IUserRepo extends Repository<UserAggregate> {
  findUserByEmail(email: Email): Promise<UserAggregate>;

  findUserByLogin(login: Login): Promise<UserAggregate>;
}

