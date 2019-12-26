import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { MediaModule } from "../media/media.module"
import { MainModule } from "../main/main.module"

import * as cookieParser from "cookie-parser"
import { ArticleController } from "./article.controller"

@Module({
  imports: [MainModule, MediaModule],
  providers: [],
  controllers: [ArticleController],
})
export class WwwModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
