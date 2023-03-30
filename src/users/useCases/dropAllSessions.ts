import { UseCase } from "../../shared/domain/UseCase";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Inject } from "@nestjs/common";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { ApiProperty } from "@nestjs/swagger";


class DropAllSessionsDTO {
  @ApiProperty()
  userId: string;
}

type Response = void;

export class DropAllSessions implements UseCase<DropAllSessionsDTO, Response> {
  constructor(
    @Inject("IUserRepo") private readonly userRepo: IUserRepo) {
  }

  async execute(req: DropAllSessionsDTO): Promise<Response> {
    const user = await this.userRepo.find(new UniqueEntityID(req.userId));
    user.dropAllSessions();
    await this.userRepo.save(user);
  }

}