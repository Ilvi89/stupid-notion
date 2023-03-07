import { UseCase } from "../../shared/domain/UseCase";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Email } from "../domain/valueObjects/Email";
import { IEmailService } from "./IEmailService";

type Response = void

export interface ChangeEmailDTO {
  userId: string;
  newEmail: string;
}

export class ChangeEmail implements UseCase<ChangeEmailDTO, Response> {
  private userRepo: IUserRepo;
  private emailService: IEmailService;

  async execute(req: ChangeEmailDTO): Promise<Response> {

    const user = await this.userRepo.find(new UniqueEntityID(req.userId));
    if (!user)
      throw new Error("User not found");

    const newEmail = Email.create(req.newEmail);
    const emailIsVerified = await this.emailService.verifyEmail(newEmail);
    if (!emailIsVerified)
      throw new Error("User email is not verified");

    user.confirmEmail(newEmail);
    await this.userRepo.save(user);
  }

}