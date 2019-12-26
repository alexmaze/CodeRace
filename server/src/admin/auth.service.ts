import { Injectable, Inject, InternalServerErrorException, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AccountEntity, AccountType } from "../account/account.entity"
import { AccountService } from "../account/account.service"

@Injectable()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService

  @Inject()
  private readonly accountService: AccountService

  async login(
    email: string,
    password: string
  ): Promise<{
    account: AccountEntity
    accessToken: string
  }> {
    let account: AccountEntity

    try {
      account = await this.accountService.findByEmail(email)
    } catch (e) {
      throw new InternalServerErrorException()
    }

    if (account == null || account.password !== password || account.type !== AccountType.Admin || !account.isActive) {
      throw new UnauthorizedException()
    }

    return {
      account: {
        ...account,
        password: undefined,
      },
      accessToken: this.jwtService.sign({ email }),
    }
  }

  async validateUser(payload: { email: string }): Promise<AccountEntity> {
    const account = await this.accountService.findByEmail(payload.email)
    if (account == null) {
      throw new UnauthorizedException()
    }

    return account
  }
}
