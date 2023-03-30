import { Module } from "@nestjs/common";
import { FakeDeviceConfirmService, FakeEmailConfirmService } from "./infrastructure/services";
import { Register } from "./useCases/register";
import { UserController } from "./api/user.controller";
import { ConfirmEmail } from "./useCases/confirmEmail";
import { ConfirmAccess } from "./useCases/confirmAccess";
import { UserRepository } from "./infrastructure/user.repository";
import { PrismaService } from "../shared/infrastucture/prisma.service";
import { DropSession } from "./useCases/dropSession";
import { DropAllSessions } from "./useCases/dropAllSessions";


@Module({
  providers: [
    Register, ConfirmEmail, ConfirmAccess, DropSession, DropAllSessions, PrismaService, {
      provide: "IUserRepo",
      useClass: UserRepository
    }, {
      provide: "IEmailConfirmService",
      useClass: FakeEmailConfirmService
    }, {
      provide: "IDeviceConfirmService",
      useClass: FakeDeviceConfirmService
    }],
  controllers: [UserController],
})
export class UserModule {
}
