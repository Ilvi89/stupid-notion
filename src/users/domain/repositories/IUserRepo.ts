import { Email } from "../valueObjects/Email";
import { UserAggregate } from "../userAggregate";
import { Repository } from "../../../shared/domain/Repository";

export interface IUserRepo extends Repository<UserAggregate> {
  findUserByEmail(email: Email): Promise<UserAggregate>;

  findFirstFive(): Promise<UserAggregate[]>;
}

