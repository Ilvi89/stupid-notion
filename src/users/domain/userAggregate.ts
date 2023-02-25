import { Email } from "./valueObjects/Email";
import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Login } from "./valueObjects/Login";
import { Password } from "./valueObjects/Password";


export interface UserProps {
  email: Email;
  login: Login;
  password: Password;
  isEmailVerified?: boolean;
  username: string;
}


export class UserAggregate extends AggregateRoot<UserProps> {

  get email(): Email {
    return this.props.email;
  }


  get login(): Login {
    return this.props.login;
  }

  get username(): string {
    return this.props.username;
  }

  private constructor(id: UniqueEntityID, props: UserProps) {
    super(id, props);
  }

  public static create(id: UniqueEntityID, props: UserProps): UserAggregate {
    // TODO: Add validation
    return new UserAggregate(id, props);
  }
}
