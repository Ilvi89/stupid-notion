import { UseCase } from "../../shared/domain/UseCase";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { Email } from "../domain/valueObjects/Email";
import { Password } from "../domain/valueObjects/Password";
import { UserAggregate } from "../domain/userAggregate";
import { IEmailConfirmService } from "./IEmailConfirmService";

// TODO: add typed Response
type Response = void

export interface RegisterUserDTO {
  username?: string;
  email: string;
  password: string;
}

export class Register implements UseCase<RegisterUserDTO, Promise<Response>> {
  constructor(
    private readonly userRepo: IUserRepo,
    private emailConfirmService: IEmailConfirmService) {
  }


  async execute(req: RegisterUserDTO): Promise<Response> {
    const email = Email.create(req.email);
    const password = Password.create({ value: req.password });

    const userWithSameEmail: UserAggregate = await this.userRepo.findUserByEmail(email);
    if (userWithSameEmail) {
      throw new Error("The user with this email already exists");
    }

    const user = UserAggregate.create(this.userRepo.getNewId(), {
      email: email,
      password: password,
      username: req.username
    });

    this.emailConfirmService.requestConfirm(email);
    await this.userRepo.save(user);
  }
}