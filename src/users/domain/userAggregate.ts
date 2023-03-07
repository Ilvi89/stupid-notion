import { Email } from "./valueObjects/Email";
import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Password } from "./valueObjects/Password";


export interface UserProps {
  email: Email;
  password: Password;
  // Todo: move email verification props in EmailVO
  isEmailVerified?: boolean;
  username: string;
}


export class UserAggregate extends AggregateRoot<UserProps> {

  get email(): Email {
    return this.props.email;
  }

  get username(): string {
    return this.props.username;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified
  }

  private constructor(id: UniqueEntityID, props: UserProps) {
    super(id, props);
  }

  public static create(id: UniqueEntityID, props: UserProps): UserAggregate {
    // TODO: Add validation
    return new UserAggregate(id, props);
  }

  confirmEmail(email: Email) {
    this.props.email = email
    this.props.isEmailVerified = true
  }
}
