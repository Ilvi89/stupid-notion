import { Module } from "@nestjs/common";
import { Create } from "./useCases/create";
import { OwnerRepository } from "./infrastructure/owner.repository";
import { WorkspaceRepository } from "./infrastructure/workspace.repository";
import { WorkspacesController } from "./api/workspace.controller";
import { PrismaService } from "../shared/infrastucture/prisma.service";
import { AddMember } from "./useCases/addMember";
import { UserRepository } from "./infrastructure/user.repository";


@Module({
  providers: [
    Create, AddMember, PrismaService, {
      provide: "IOwnerRepo",
      useClass: OwnerRepository
    }, {
      provide: "IWorkspaceRepo",
      useClass: WorkspaceRepository
    }, {
      provide: "IUserRepo",
      useClass: UserRepository
    }],
  controllers: [WorkspacesController]
})
export class WorkspaceModule {
}
