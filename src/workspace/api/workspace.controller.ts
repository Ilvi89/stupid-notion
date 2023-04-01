import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Inject, Param, Post, Res } from "@nestjs/common";
import { IWorkspaceRepo } from "../domain/repositories/IWorkspaceRepo";
import { Create, CreateDTO } from "../useCases/create";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Response } from "express";

@ApiTags("workspaces")
@Controller("workspaces")
export class WorkspacesController {
  constructor(
    private readonly createUC: Create,
    @Inject("IWorkspaceRepo") private readonly workspaceRepo: IWorkspaceRepo) {
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    let workspace = await this.workspaceRepo.find(new UniqueEntityID(id));
    return { workspace: workspace };
  }

  @Post("create")
  async create(@Body() req: CreateDTO, @Res() res: Response) {
    let { id } = await this.createUC.execute(req);
    return res.redirect(`/workspaces/${id}`);
  }
}