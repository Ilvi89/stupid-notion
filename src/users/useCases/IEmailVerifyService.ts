import { Email } from "../domain/valueObjects/Email";

export interface IEmailCheckService {
  requestConfirm(user: Email): void;
  isConfirmed(email: Email): Promise<boolean>;
  setUnconfirmed(email: Email): void
}