import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export interface IJwtOptions {
  expiresIn: string
  secret: string
}

export interface IConfig {
  name: string
  port: number
  database: TypeOrmModuleOptions
  jwt: IJwtOptions
}
