import { UseCase } from "../../shared/domain/UseCase";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { Email } from "../domain/valueObjects/Email";
import { Password } from "../domain/valueObjects/Password";
import { UserAggregate } from "../domain/userAggregate";

// TODO: add typed Response
type Response = void

export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}

export class RegisterUser implements UseCase<RegisterUserDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(req: RegisterUserDTO): Promise<Response> {
    const email = Email.create(req.email);
    const password = Password.create({ value: req.password });

    const userWithSameEmail = await this.userRepo.findUserByEmail(email);
    if (userWithSameEmail) {
      throw new Error("The user with this email already exists");
    }

    const user = UserAggregate.create(this.userRepo.getNewId(), {
      email, password, isEmailVerified: false, username: req.username || email.value
    });

    await this.userRepo.save(user);
  }
}