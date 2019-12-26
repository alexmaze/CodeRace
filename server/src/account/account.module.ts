import { Module } from "@nestjs/common"
import { AccountService } from "./account.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountEntity } from "./account.entity"

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
