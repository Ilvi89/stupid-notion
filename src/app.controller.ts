import { Controller, Get, Render, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { TransformationInterceptor } from "./logging.interceptor";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @Render("index")
  @UseInterceptors(TransformationInterceptor)
  getHello() {
    return { message: "HElllo world!" , authorised: false, user: {name: "adad"}};
  }
}
