import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { UseCase } from "../../shared/domain/UseCase";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { IEmailConfirmService } from "./IEmailConfirmService";
import { IDeviceConfirmService } from "./IDeviceConfirmService";
import { UserAggregate } from "../domain/userAggregate";
import { Device } from "../domain/valueObjects/Session";

interface ConfirmAccessDTO {
  type: ConfirmAccessType;
  userId: UniqueEntityID;
  deviceId: string;
  code: string;
}

export enum ConfirmAccessType {
  Email,
  AnotherDevise,
}

type Response = void

export class ConfirmAccess implements UseCase<ConfirmAccessDTO, Response> {

  constructor(
    private readonly userRepo: IUserRepo,
    private readonly emailConfirmService: IEmailConfirmService,
    private readonly deviceConfirmService: IDeviceConfirmService) {
  }

  async execute(req: ConfirmAccessDTO): Promise<Response> {
    const user: UserAggregate = await this.userRepo.find(req.userId);
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