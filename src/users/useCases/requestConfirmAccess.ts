import { UseCase } from "../../shared/domain/UseCase";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { UserAggregate } from "../domain/userAggregate";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { IEmailCheckService } from "./IEmailVerifyService";
import { IDeviceCheckService } from "./IDeviceCheckService";
import { Device } from "../domain/valueObjects/Session";


interface RequestConfirmAccessDTO {
  type: ConfirmAccessType;
  userId: UniqueEntityID;
  deviceId: string;
}

export enum ConfirmAccessType {
  Email,
  AnotherDevise,
}

type Response = void

export class RequestConfirmAccess implements UseCase<RequestConfirmAccessDTO, Response> {
  private userRepo: IUserRepo;
  private emailCheckService: IEmailCheckService;
  private deviceCheckService: IDeviceCheckService;

  constructor(userRepo: IUserRepo, emailCheckService: IEmailCheckService, deviceCheckService: IDeviceCheckService) {
    this.userRepo = userRepo;
    this.emailCheckService = emailCheckService;
    this.deviceCheckService = deviceCheckService;

  }

  async execute(req: RequestConfirmAccessDTO): Promise<Response> {
    const user: UserAggregate = await this.userRepo.find(req.userId);
    if (!user)
      throw new Error("User not found");


    if (req.type == ConfirmAccessType.Email) {
      if (!user.isEmailVerified) {
        throw new Error("User email is unconfirmed");
      }
      this.emailCheckService.requestConfirm(user.email);
    } else {
      if (user.currentlyInUseDevices.length == 0) {
        throw new Error("There are currently no devices in use");
      }
      const device = Device.create({ id: req.deviceId });
      this.deviceCheckService.requestConfirm(device);
    }
  }
}
