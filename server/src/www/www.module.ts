import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { MediaModule } from "../media/media.module"
import { MainModule } from "../main/main.module"

import * as cookieParser from "cookie-parser"
import { ArticleController } from "./article.controller"
import { QuestionController } from "./question.controller"

@Module({
  imports: [MainModule, MediaModule],
  providers: [],
  controllers: [QuestionController, ArticleController],
})
export class WwwModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
