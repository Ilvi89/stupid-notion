import { Email } from "../domain/valueObjects/Email";

export interface IEmailService {
  verifyEmail(email: Email): Promise<boolean>;
}