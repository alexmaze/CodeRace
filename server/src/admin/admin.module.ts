import { Module } from "@nestjs/common"
import { SessionController } from "./session.controller"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./jwt.strategy"
import { PassportModule } from "@nestjs/passport"
import { MainModule } from "../main/main.module"
import { AccountModule } from "../account/account.module"
import { ConfigService } from "../config/config.service"
import { ArticleController } from "./article.controller"
import { ResourceController } from "./resource.controller"
import { MediaModule } from "../media/media.module"

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: true }),
    JwtModule.registerAsync({
      useExisting: ConfigService,
    }),
    MainModule,
    MediaModule,
    AccountModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [SessionController, ArticleController, ResourceController],
})
export class AdminModule {}
