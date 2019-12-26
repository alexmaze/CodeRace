import { AccountEntity } from "../account/account.entity"

export interface IRequest extends Request {
  user?: AccountEntity
}
