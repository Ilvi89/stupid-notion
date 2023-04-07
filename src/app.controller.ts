import { Controller, Get, Post, Render, UseInterceptors } from "@nestjs/common";
import { TransformationInterceptor } from "./logging.interceptor";

@Controller()
export class AppController {
  constructor() {
  }

  @Get()
  @Render("index")
  @UseInterceptors(TransformationInterceptor)
  get() {
    return { message: "HElllo world!" , authorised: false};
  }

  @Get("/user")
  @Render("index")
  @UseInterceptors(TransformationInterceptor)
  getUser() {
    return { message: "HElllo world!" , authorised: true, user: {name: "Ilya"}};
  }

}
