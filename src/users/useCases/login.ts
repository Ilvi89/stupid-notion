import { UseCase } from "../../shared/domain/UseCase";
import { Email } from "../domain/valueObjects/Email";
import { Password } from "../domain/valueObjects/Password";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { Device } from "../domain/valueObjects/Session";
import { IEmailConfirmService } from "./IEmailConfirmService";
import { IDeviceConfirmService } from "./IDeviceConfirmService";
import { ApiProperty } from "@nestjs/swagger";
import { Inject } from "@nestjs/common";

export class LoginDTO {
  @ApiProperty()
  deviceId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

type Response = {
  id: string;
}

export class Login implements UseCase<LoginDTO, Promise<Response>> {
  constructor(
    @Inject("IUserRepo") private readonly userRepo: IUserRepo,
    @Inject("IEmailConfirmService") private readonly emailConfirmService: IEmailConfirmService,
    @Inject("IDeviceConfirmService") private readonly deviceConfirmService: IDeviceConfirmService) {
  }

  async execute(req: LoginDTO): Promise<Response> {
    const email = Email.create(req.email);
    const password = Password.create({ value: req.password });
    const device = Device.create({ id: req.deviceId });

    const user = await this.userRepo.findUserByEmail(email);
    if (!user)
      throw new Error("User not found");

    const passIsEquals = user.password.comparePassword(password.value);

    if (!passIsEquals)
      throw new Error("Incorrect password");

    if (!user.isEmailVerified) {
      this.emailConfirmService.requestConfirm(user.email);
      throw new Error("User email is unconfirmed");
    }

    if (!user.isTrusted(device)) {
      this.deviceConfirmService.requestConfirm(user.currentlyInUseDevices);
      throw new Error("device used for the first time");
    }

    user.createNewSession(device);
    await this.userRepo.save(user);

    return { id: user.id.toString() };
  }

}