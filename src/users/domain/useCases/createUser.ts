import { UseCase } from "../../../shared/domain/UseCase";
import { IUserRepo } from "../repositories/IUserRepo";
import { Email } from "../valueObjects/Email";
import { Login } from "../valueObjects/Login";
import { Password } from "../valueObjects/Password";
import { UserAggregate } from "../userAggregate";

// TODO: add typed Response
type Response = void

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  login: string;
}

export class CreateUser implements UseCase<CreateUserDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(req: CreateUserDTO): Promise<Response> {


    const email = Email.create(req.email);
    const login = Login.create(req.login);
    const password = Password.create({ value: req.password });


    const user = UserAggregate.create(this.userRepo.getNewId(), {
      email, login, password, isEmailVerified: false, username: req.username
    });

    const userAlreadyExists = await this.userRepo.exists(user);
    if (userAlreadyExists) {
      throw new Error("The user account already exists");
    }

    try {
      await this.userRepo.save(user);
    } catch (err) {
      throw err;
    }

    return;
  }
}