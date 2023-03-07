import { UseCase } from "../../shared/domain/UseCase";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { IEmailService } from "./IEmailService";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Email } from "../domain/valueObjects/Email";

export interface VerifyEmailDTO {
  userId: string
  email: string
}

type Response = void

export class VerifyEmail implements UseCase<VerifyEmailDTO, Promise<Response>> {
  private userRepo: IUserRepo
  private emailService: IEmailService
  async execute(req: VerifyEmailDTO): Promise<Response> {
    const user = await this.userRepo.find(new UniqueEntityID(req.userId))
    if (!user)
      throw new Error("User not found");

    const email = Email.create(req.email)
    const emailIsVerified = await this.emailService.verifyEmail(email)
    if (!emailIsVerified)
      throw new Error("User email is not verified");

    user.confirmEmail(email)

    return
  }
}