import { IUserRepo } from "../domain/repositories/IUserRepo";
import { User } from "../domain/User";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/infrastucture/prisma.service";

@Injectable()
export class UserRepository implements IUserRepo {
  constructor(private prisma: PrismaService) {
  }

  exists(t: User): Promise<boolean> {
    return Promise.resolve(false);
  }

  async find(id: UniqueEntityID): Promise<User> {
    const raw = await this.prisma.user.findUnique({
      where: { id: id.toString() },
      select: { id: true }
    });
    return UserMapper.toDomain(raw);
  }

  getNewId(): UniqueEntityID {
    return undefined;
  }

}

type UserRaw = {
  id: string
}

class UserMapper {
  static toDomain(raw: UserRaw): User {
    return User.create(new UniqueEntityID(raw.id));
  }
}