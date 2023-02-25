import { ValueObject } from "../../../shared/domain/ValueObject";

export interface LoginProps {
  value: string;
}

export class Login extends ValueObject<LoginProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: LoginProps) {
    super(props);
  }

  public static create(login: string): Login {
    if (!!login === false || login.length === 0) {
      throw new Error("Must provide a login");
    } else {
      return new Login({ value: login });
    }
  }
}