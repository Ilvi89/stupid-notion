import { Module } from "@nestjs/common";
import { Create } from "./useCases/create";
import { OwnerRepository } from "./infrastructure/owner.repository";
import { WorkspaceRepository } from "./infrastructure/workspace.repository";
import { WorkspacesController } from "./api/workspace.controller";
import { PrismaService } from "../shared/infrastucture/prisma.service";


@Module({
  providers: [
    Create, PrismaService, {
      provide: "IOwnerRepo",
      useClass: OwnerRepository
    }, {
      provide: "IWorkspaceRepo",
      useClass: WorkspaceRepository
    }],
  controllers: [WorkspacesController]
})
export class WorkspaceModule {
}
