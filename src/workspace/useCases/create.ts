import { UseCase } from "../../shared/domain/UseCase";
import { ApiProperty } from "@nestjs/swagger";
import { Inject, Injectable } from "@nestjs/common";
import { IOwnerRepo } from "../domain/repositories/IOwnerRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { IWorkspaceRepo } from "../domain/repositories/IWorkspaceRepo";
import { WorkspaceAggregate } from "../domain/WorkspaceAggregate";

export class CreateDTO {
  @ApiProperty()
  ownerId: string;
  @ApiProperty()
  name: string;
}

type Response = {
  id: string
}

@Injectable()
export class Create implements UseCase<CreateDTO, Response> {
  constructor(
    @Inject("IOwnerRepo") private readonly ownerRepo: IOwnerRepo,
  @Inject("IWorkspaceRepo") private readonly workspaceRepo: IWorkspaceRepo
  ) {
  }

  async execute(req: CreateDTO): Promise<Response> {
    const owner = await this.ownerRepo.find(new UniqueEntityID(req.ownerId));
    if (!owner)
      throw new Error("Owner not found");

    const workspace = WorkspaceAggregate.create(this.ownerRepo.getNewId(), { owner: owner })
    await this.workspaceRepo.save(workspace)

    return {id: workspace.id.toString()}
  }

}