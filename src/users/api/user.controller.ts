import { Body, Controller, Get, Inject, Param, Post, Res } from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";
import { IUserRepo } from "../domain/repositories/IUserRepo";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Register, RegisterUserDTO } from "../useCases/register";
import { Response } from "express";
import { ConfirmEmail, ConfirmEmailDTO } from "../useCases/confirmEmail";
import { ConfirmAccess, ConfirmAccessDTO } from "../useCases/confirmAccess";


@ApiTags("users")
@Controller("users")
export class UserController {

  constructor(
    private readonly registerUC: Register,
    private readonly confirmEmailUC: ConfirmEmail,
    private readonly confirmAccessUC: ConfirmAccess,
    @Inject("IUserRepo") private readonly userRepo: IUserRepo) {
  }

  @Get()
  async getAll() {
    let user = await this.userRepo.findFirstFive();
    return { users: user || "123" };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    let user = await this.userRepo.find(new UniqueEntityID(id));
    return { user: user || "123" };
  }

  @Post("register")
  async register(@Body() user: RegisterUserDTO, @Res() res: Response) {
    let { id } = await this.registerUC.execute(user);
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
}
