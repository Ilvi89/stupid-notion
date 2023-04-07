import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../shared/domain/UseCase";
import { ApiProperty } from "@nestjs/swagger";
import { IWorkspaceRepo } from "../domain/repositories/IWorkspaceRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { Member } from "../domain/Member";
import { AccessLevel, AccessMode } from "../domain/AccessLevel";

export class AddMemberDTO {
  @ApiProperty()
  workspaceId: string;
  @ApiProperty()
  memberId: string;
  @ApiProperty()
  accessLevel?: AccessMode;
}

type Response = void

@Injectable()
export class AddMember implements UseCase<AddMemberDTO, Response> {

  constructor(
    @Inject("IUserRepo") private readonly userRepo: IUserRepo,
    @Inject("IWorkspaceRepo") private readonly workspaceRepo: IWorkspaceRepo
  ) {
  }

  async execute(req: AddMemberDTO): Promise<Response> {
    const workspace = await this.workspaceRepo.find(new UniqueEntityID(req.workspaceId));
    if (!workspace)
      throw new Error("Workspace not found");

    const user = await this.userRepo.find(new UniqueEntityID((req.memberId)));

    if (!user)
      throw new Error("User not found");
    const al = AccessLevel.FromString(req.accessLevel) || AccessLevel.Read();

    workspace.addMember(Member.create(new UniqueEntityID(user.id.toString()), {}), al);
    await this.workspaceRepo.save(workspace);
  }
}