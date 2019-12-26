import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

export enum AccountType {
  Admin = "admin",
  Coder = "coder",
}

@Entity("account")
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    unique: true,
    nullable: false,
  })
  email: string

  @Column()
  password: string

  @Column("longtext")
  description: string

  @Column("enum", {
    enum: AccountType,
  })
  type: AccountType

  @Column({ default: true })
  isActive: boolean
}
