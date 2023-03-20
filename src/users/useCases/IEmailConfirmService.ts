import { Email } from "../domain/valueObjects/Email";

export interface ConfirmCode {
  value: string;
  createdAt: Date;
}


export interface IEmailConfirmService {
  requestConfirm(email: Email): void;

  getConfirmCode(email: Email): Promise<ConfirmCode>;
}