import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./users/user.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import { PrismaService } from "./shared/infrastucture/prisma.service";

@Module({

  providers: [AppService, PrismaService],
  imports: [
    UserModule, WorkspaceModule
  ],
  controllers: [AppController],
})
export class AppModule {
}
