import { NestFactory } from "@nestjs/core"
import { Logger } from "@nestjs/common"
import { AppModule } from "./app.module"
import { ConfigService } from "./config/config.service"

import * as bodyParser from "body-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const { config, mode } = app.get(ConfigService)

  app.use(bodyParser.json({ limit: "50mb" }))
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

  await app.listen(config.port)

  Logger.log(`Running on :${config.port} in ${mode} mode.`)
}
bootstrap()
