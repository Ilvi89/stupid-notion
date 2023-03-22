import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { UseCase } from "../../shared/domain/UseCase";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { IEmailConfirmService } from "./IEmailConfirmService";
import { IDeviceConfirmService } from "./IDeviceConfirmService";
import { UserAggregate } from "../domain/userAggregate";
import { Device } from "../domain/valueObjects/Session";
import { Inject, Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ConfirmAccessDTO {
// todo: remove swagger decorators and create requestDTO
  @ApiProperty()
  type: ConfirmAccessType;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  code: string;
}

export enum ConfirmAccessType {
  Email,
  AnotherDevise,
}

type Response = void

@Injectable()
export class ConfirmAccess implements UseCase<ConfirmAccessDTO, Response> {

  constructor(
    @Inject("IUserRepo") private readonly userRepo: IUserRepo,
    @Inject("IEmailConfirmService") private readonly emailConfirmService: IEmailConfirmService,
    @Inject("IDeviceConfirmService") private readonly deviceConfirmService: IDeviceConfirmService) {
  }

  async execute(req: ConfirmAccessDTO): Promise<Response> {
    let id = new UniqueEntityID(req.userId);
    let user: UserAggregate = await this.userRepo.find(id);
    if (!user) throw new Error("User not found");

    const device = Device.create({ id: req.deviceId });
    let cc: string;
    // todo: ?split this to another use cases
    if (req.type == ConfirmAccessType.Email) {
      if (!user.isEmailVerified) throw new Error("User email is unconfirmed");
      cc = await this.emailConfirmService.getConfirmCode(user.email);
    } else {
      if (user.currentlyInUseDevices.length == 0) throw new Error("There are currently no devices in use");
      cc = await this.deviceConfirmService.getConfirmCode(device);
    }

    if (!cc || cc != req.code) throw new Error("Access is unconfirmed");
    user.createNewSession(device);
    await this.userRepo.save(user);
  }


}