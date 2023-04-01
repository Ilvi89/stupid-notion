import { IOwnerRepo } from "../domain/repositories/IOwnerRepo";
import { Injectable } from "@nestjs/common";
import { Owner } from "../domain/Owner";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../../shared/infrastucture/prisma.service";
import { User } from "@prisma/client";
import { Plan } from "../domain/Plan";

@Injectable()
export class OwnerRepository implements IOwnerRepo {

  constructor(private prisma: PrismaService) {
  }

  getNewId(): UniqueEntityID {
    return new UniqueEntityID(uuid());
  }

  exists(t: Owner): Promise<boolean> {
    return Promise.resolve(false);
  }

  async find(id: UniqueEntityID): Promise<Owner> {
    const raw = await this.prisma.user.findUnique({
      where: { id: id.toString() },
      include: {
        _count: {
          select: { workspaces: true }
        }
      }
    });
    return OwnerMapper.toDomain(raw);
  }

  save(t: Owner): Promise<Owner> {
    return Promise.resolve(undefined);
  }
}

class OwnerMapper {
  static toDomain(raw: User & { _count: { workspaces: number } }): Owner {
    return Owner.create(new UniqueEntityID(raw.id.toString()), {
      plan: this.getPlan(raw.plan),
      name: raw.name,
      wsCount: raw._count.workspaces
    });
  }


  private static getPlan(s: string): Plan {
    switch (s) {
      case "BASE":
        return Plan.Base();
      case "PRO":
        return Plan.Pro();
    }
  }
}


