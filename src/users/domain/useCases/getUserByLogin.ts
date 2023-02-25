import { IUserRepo } from "../repositories/IUserRepo";
import { UseCase } from "../../../shared/domain/UseCase";
import { Login } from "../valueObjects/Login";
import { UserAggregate } from "../userAggregate";

type Response = UserAggregate

export interface GetUserByLoginDTO {
  login: string;
}

export class GetUserByLogin implements UseCase<GetUserByLoginDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: GetUserByLoginDTO): Promise<Response> {
    const login = Login.create(request.login);
    const user = await this.userRepo.findUserByLogin(login);
    const userFound = !!user === true;

    if (!userFound) {
      throw new Error("User not found");
    }
    return user;
  }
}