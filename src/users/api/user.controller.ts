import { Body, Controller, Delete, Get, Inject, Param, Post, Res } from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Register, RegisterUserDTO } from "../useCases/register";
import { Response } from "express";
import { ConfirmEmail, ConfirmEmailDTO } from "../useCases/confirmEmail";
import { ConfirmAccess, ConfirmAccessDTO } from "../useCases/confirmAccess";
import { DropSession } from "../useCases/dropSession";
import { DropAllSessions } from "../useCases/dropAllSessions";
import { Login, LoginDTO } from "../useCases/login";


@ApiTags("users")
@Controller("users")
export class UserController {

  constructor(
    private readonly registerUC: Register,
    private readonly loginUC: Login,
    private readonly confirmEmailUC: ConfirmEmail,
    private readonly confirmAccessUC: ConfirmAccess,
    private readonly dropSessionUC: DropSession,
    private readonly dropAllSessionsUC: DropAllSessions,
    @Inject("IUserRepo") private readonly userRepo: IUserRepo) {
  }


  @Get(":id")
  async get(@Param("id") id: string) {
    let user = await this.userRepo.find(new UniqueEntityID(id));
    return { user: user };
  }

  @Post("register")
  async register(@Body() user: RegisterUserDTO, @Res() res: Response) {
    let { id } = await this.registerUC.execute(user);
    return res.redirect(`/users/${id}`);
  }

  @Post("login")
  async login(@Body() user: LoginDTO, @Res() res: Response) {
    let { id } = await this.loginUC.execute(user);
    return res.redirect(`/users/${id}`);
  }

  @Post("confirm/email")
  async confirmEmail(@Body() confirmEmailDTO: ConfirmEmailDTO, @Res() res: Response) {
    await this.confirmEmailUC.execute(confirmEmailDTO);
    return res.redirect(`/users/${confirmEmailDTO.userId}`);
  }

  @Post("confirm/device")
  async confirmDevice(@Body() confirmAccessDTO: ConfirmAccessDTO, @Res() res: Response) {
    await this.confirmAccessUC.execute(confirmAccessDTO);
    return res.redirect(`/users/${confirmAccessDTO.userId}`);
  }


  @Delete(":id/sessions")
  async dropSession(@Param("id") id: string, @Body() body: { deviceId?: string }, @Res() res: Response) {
    if (body.deviceId)
      await this.dropSessionUC.execute({ userId: id, deviceId: body.deviceId });
    else
      await this.dropAllSessionsUC.execute({ userId: id });

    return res.redirect(`/users/${id}`);
  }
}