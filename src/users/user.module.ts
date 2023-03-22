import { Module } from "@nestjs/common";
import { FakeUserRepo } from "./infrastructure/repositories/UserRepo";
import { FakeDeviceConfirmService, FakeEmailConfirmService } from "./infrastructure/services";
import { Register } from "./useCases/register";
import { UserController } from "./api/user.controller";
import { ConfirmEmail } from "./useCases/confirmEmail";
import { ConfirmAccess } from "./useCases/confirmAccess";


@Module({
  providers: [
    Register, ConfirmEmail, ConfirmAccess, {
      provide: "IUserRepo",
      useClass: FakeUserRepo
    }, {
      provide: "IEmailConfirmService",
      useClass: FakeEmailConfirmService
    }, {
      provide: "IDeviceConfirmService",
      useClass: FakeDeviceConfirmService
    }],
  controllers: [UserController]
})
export class UserModule {
}