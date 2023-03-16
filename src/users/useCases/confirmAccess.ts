import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { UseCase } from "../../shared/domain/UseCase";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { IEmailCheckService } from "./IEmailVerifyService";
import { IDeviceCheckService } from "./IDeviceCheckService";
import { UserAggregate } from "../domain/userAggregate";
import { Device } from "../domain/valueObjects/Session";

interface ConfirmAccessDTO {
  type: ConfirmAccessType;
  userId: UniqueEntityID;
  deviceId: string;
}

export enum ConfirmAccessType {
  Email,
  AnotherDevise,
}

type Response = void

export class ConfirmAccess implements UseCase<ConfirmAccessDTO, Response> {
  private userRepo: IUserRepo;
  private emailCheckService: IEmailCheckService;
  private deviceCheckService: IDeviceCheckService;

  constructor(userRepo: IUserRepo, emailCheckService: IEmailCheckService, deviceCheckService: IDeviceCheckService) {
    this.userRepo = userRepo;
    this.emailCheckService = emailCheckService;
    this.deviceCheckService = deviceCheckService;
  }

  async execute(req: ConfirmAccessDTO): Promise<Response> {
    const user: UserAggregate = await this.userRepo.find(req.userId);
    if (!user)
      throw new Error("User not found");

    // Todo: refactor this shit
    const device = Device.create({ id: req.deviceId });
    if (req.type == ConfirmAccessType.Email) {
      if (!user.isEmailVerified) {
        throw new Error("User email is unconfirmed");
      }
      if (await this.emailCheckService.isConfirmed(user.email)) {
        user.createNewSession(device);
        await this.userRepo.save(user);
      }
    } else {
      if (user.currentlyInUseDevices.length == 0) {
        throw new Error("There are currently no devices in use");
      }
      if (await this.deviceCheckService.isConfirmed(device)) {
        user.createNewSession(device);
        await this.userRepo.save(user);
      }
    }
  }
}