import { UseCase } from "../../shared/domain/UseCase";
import { UserAggregate } from "../domain/userAggregate";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { IEmailConfirmService } from "./IEmailConfirmService";

export type Result = void;

export interface ConfirmEmailDTO {
  userId: string;
  code: string;
}

export class ConfirmEmail implements UseCase<ConfirmEmailDTO, Result> {
  private readonly userRepo: IUserRepo;
  private readonly emailConfirmService: IEmailConfirmService;

  async execute(req: ConfirmEmailDTO): Promise<Result> {
    let id = new UniqueEntityID(req.userId);
    let user: UserAggregate = await this.userRepo.find(id);

    let cc = await this.emailConfirmService.getConfirmCode(user.email);
    if (!cc || cc != req.code) throw new Error("Email is unconfirmed");

    user.confirmEmail(user.email);
    await this.userRepo.save(user);
  }
}