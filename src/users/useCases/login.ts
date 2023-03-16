import { UseCase } from "../../shared/domain/UseCase";
import { Email } from "../domain/valueObjects/Email";
import { Password } from "../domain/valueObjects/Password";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { Device } from "../domain/valueObjects/Session";
import { IEmailCheckService } from "./IEmailVerifyService";

interface LoginDTO {
  deviceId: string;
  email: string;
  password: string;
}

type Response = void

export class Login implements UseCase<LoginDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private emailCheckService: IEmailCheckService;

  constructor(userRepo: IUserRepo, emailCheckService: IEmailCheckService) {
    this.userRepo = userRepo;
    this.emailCheckService = emailCheckService;
  }

  async execute(req: LoginDTO): Promise<Response> {
    const email = Email.create(req.email);
    const password = Password.create({ value: req.password });

    const user = await this.userRepo.findUserByEmail(email);
    if (!user)
      throw new Error("User not found");

    const passIsEquals = await user.password.comparePassword(password.value);
    if (!passIsEquals)
      throw new Error("Incorrect password");

    if (!user.isEmailVerified) {
      this.emailCheckService.requestConfirm(user.email);
      throw new Error("User email is unconfirmed");
    }

    const device = Device.create({ id: req.deviceId });
    if (!user.hasUsedDeviceInPast(device)) {
      throw new Error("device used for the first time");
    }

    user.createNewSession(device);
  }

}