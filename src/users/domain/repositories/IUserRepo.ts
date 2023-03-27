import { Email } from "../valueObjects/Email";
import { UserAggregate } from "../UserAggregate";
import { Repository } from "../../../shared/domain/Repository";

export interface IUserRepo extends Repository<UserAggregate> {
  findUserByEmail(email: Email): Promise<UserAggregate>;
}

