import { Test } from "@nestjs/testing"
import { AccountService } from "./account.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountModule } from "./account.module"
import { ConfigModule } from "../config/config.module"
import { ConfigService } from "../config/config.service"
import { AccountEntity, AccountType } from "./account.entity"

describe("AccountService", () => {
  let service: AccountService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          useExisting: ConfigService,
        }),
        AccountModule,
      ],
    }).compile()

    service = module.get(AccountService)
  })

  describe("crud", () => {
    it("create one", async () => {
      const account = new AccountEntity()
      account.name = "alex"
      account.email = "alex@fun.com"
      account.password = "123"
      account.description = ""
      account.type = AccountType.Admin
      const res = await service.saveOrUpdate(account)
      expect(res.id).not.toBeNull()
      expect(res.email).toBe(account.email)
    })
    it("find one", async () => {
      const account = await service.findByEmail("alex@fun.com")
      expect(account).not.toBeUndefined()
      expect(account.password).toBe("123")
    })
    it("remove one", async () => {
      const account = await service.findByEmail("alex@fun.com")
      await service.removeById(account.id)
    })
  })
})
