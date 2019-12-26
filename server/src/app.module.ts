import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { MainModule } from "./main/main.module"
import { WwwModule } from "./www/www.module"
import { AdminModule } from "./admin/admin.module"
import { ConfigModule } from "./config/config.module"
import { AccountModule } from "./account/account.module"
import { MediaModule } from "./media/media.module"
import { ConfigService } from "./config/config.service"

import { AppController } from "./app.controller"

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useExisting: ConfigService,
    }),
    MediaModule,
    AccountModule,
    WwwModule,
    MainModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
