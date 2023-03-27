import { ValueObject } from "../../../shared/domain/ValueObject";
import * as bcrypt from "bcrypt";

export interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class Password extends ValueObject<IUserPasswordProps> {

  public static minLength: number = 8;

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(props: IUserPasswordProps): Password {
    if (props.value === null || !this.isAppropriateLength(props.value)) {
      throw new Error("Password doesnt meet criteria [8 chars min].");
    }

    return new Password({
      value: props.value,
      hashed: !!props.hashed === true
    });
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  public getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value);
      } else {
        return resolve(this.hashPassword(this.props.value));
      }
    });
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return reject(false);
        return resolve(compareResult);
      });
    });
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  }
}