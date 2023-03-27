import { UseCase } from "../../shared/domain/UseCase";
import { UserAggregate } from "../domain/UserAggregate";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { IEmailConfirmService } from "./IEmailConfirmService";
import { Inject, Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export type Result = void;

export class ConfirmEmailDTO {

  @ApiProperty()
  userId: string;

  @ApiProperty()
  code: string;
}
@Injectable()
export class ConfirmEmail implements UseCase<ConfirmEmailDTO, Result> {
  @Inject("IUserRepo") private readonly userRepo: IUserRepo;
  @Inject("IEmailConfirmService") private readonly emailConfirmService: IEmailConfirmService;

  async execute(req: ConfirmEmailDTO): Promise<Result> {
    let id = new UniqueEntityID(req.userId);
    let user: UserAggregate = await this.userRepo.find(id);
    if (!user) throw new Error("User not found");
    let cc = await this.emailConfirmService.getConfirmCode(user.email);
    if (!cc || cc != req.code) throw new Error("Email is unconfirmed");

    user.confirmEmail(user.email);
    await this.userRepo.save(user);
  }
}