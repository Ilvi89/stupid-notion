import { Injectable } from "@nestjs/common";
import { Owner } from "../domain/Owner";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../../shared/infrastucture/prisma.service";
import { Workspace } from "@prisma/client";
import { Plan } from "../domain/Plan";
import { IWorkspaceRepo } from "../domain/repositories/IWorkspaceRepo";
import { WorkspaceAggregate } from "../domain/WorkspaceAggregate";

@Injectable()
export class WorkspaceRepository implements IWorkspaceRepo {

  constructor(private prisma: PrismaService) {
  }

  getNewId(): UniqueEntityID {
    return new UniqueEntityID(uuid());
  }

  exists(t: WorkspaceAggregate): Promise<boolean> {
    return Promise.resolve(false);
  }

  async find(id: UniqueEntityID): Promise<WorkspaceAggregate> {
    const raw = await this.prisma.workspace.findUnique({
      where: { id: id.toString() },

      include: {
        owner: {
          select: { plan: true, name: true }
        }
      }
    });

    return WorkspaceMapper.toDomain(raw);
  }

  async save(t: WorkspaceAggregate): Promise<WorkspaceAggregate> {

    var raw = await this.prisma.workspace.upsert({
      where: { id: t.id.toString() },
      create: {
        id: t.id.toString(),
        name: t.name,
        ownerId: t.ownerId.toString()
      },
      update: {
        id: t.id.toString(),
        ownerId: t.ownerId.toString(),
        name: t.name
      },
      include: {
        owner: { select: { plan: true, name: true } }
      }
    });

    return WorkspaceMapper.toDomain(raw);
  }

  async findByOwner(id: UniqueEntityID): Promise<WorkspaceAggregate[]> {
    return await this.prisma.workspace.findMany({
      where: { ownerId: id.toString() },
      include: { owner: { select: { plan: true, name: true } } }
    }).then(value => value.map(v => WorkspaceMapper.toDomain(v)));
  }


}

type WorkspaceRaw = Workspace & { owner: { plan: string, name: string } }

class WorkspaceMapper {
  static toDomain(raw: WorkspaceRaw): WorkspaceAggregate {
    return WorkspaceAggregate.create(new UniqueEntityID(raw.id), {
      owner: Owner.create(new UniqueEntityID(raw.ownerId.toString()), {
        plan: this.getPlan(raw.owner.plan),
        name: raw.name
      })
    });
  }

  static toDB(aggregate: WorkspaceAggregate): Workspace {
    return {
      id: aggregate.id.toString(),
      name: aggregate.name,
      ownerId: aggregate.ownerId.toString()
    };
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


