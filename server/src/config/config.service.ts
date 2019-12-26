import { Injectable, Logger } from "@nestjs/common"
import * as path from "path"
import { NodeEnv, parseNodeEnv } from "./env"
import { IConfig } from "./config.interface"
import { TypeOrmOptionsFactory } from "@nestjs/typeorm"
import { JwtOptionsFactory } from "@nestjs/jwt"

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory, JwtOptionsFactory {
  public config: Readonly<IConfig>
  public readonly mode: NodeEnv

  createTypeOrmOptions() {
    return {
      entities: [path.join(__dirname, "../**/*.entity.*")],
      ...this.config.database,
    }
  }

  createJwtOptions() {
    return {
      secretOrPrivateKey: this.config.jwt.secret,
      signOptions: {
        expiresIn: this.config.jwt.expiresIn,
      },
    }
  }

  constructor() {
    this.mode = parseNodeEnv(process.env.NODE_ENV)
    Logger.log(`MODE: ${this.mode}`)
    this.config = require(path.join(__dirname, `../../config/${this.mode}.json`))
  }

  get isDevMode() {
    return this.mode === NodeEnv.Development
  }
}
