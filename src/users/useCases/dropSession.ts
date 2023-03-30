import { UseCase } from "../../shared/domain/UseCase";
import { ApiProperty } from "@nestjs/swagger";
import { Inject, Injectable } from "@nestjs/common";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Device } from "../domain/valueObjects/Session";


export class DropSessionDTO {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  deviceId: string;
}

type Response = void

@Injectable()
export class DropSession implements UseCase<DropSessionDTO, Response> {
  constructor(
    @Inject("IUserRepo") private readonly userRepo: IUserRepo) {
  }

  async execute(req: DropSessionDTO): Promise<Response> {
    const user = await this.userRepo.find(new UniqueEntityID(req.userId));
    user.dropSessionOnDevice(Device.create({ id: req.deviceId }));
    await this.userRepo.save(user)
  }
}
