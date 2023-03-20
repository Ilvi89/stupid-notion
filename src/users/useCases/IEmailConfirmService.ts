import { Email } from "../domain/valueObjects/Email";


export interface IEmailConfirmService {
  requestConfirm(email: Email): void;
  getConfirmCode(email: Email): Promise<string>;
}