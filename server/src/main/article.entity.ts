import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { ResourceEntity } from "../media/resource.entity"

export enum ArticleType {
  News = "news",
  Share = "share",
}

@Entity("article")
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column("enum", {
    enum: ArticleType,
    default: ArticleType.News,
  })
  type: ArticleType

  @Column()
  title: string

  @Column()
  titleEn: string

  @Column()
  subTitle: string

  @Column()
  subTitleEn: string

  @Column("longtext")
  content: string

  @Column("longtext")
  contentEn: string

  // 热门
  @Column()
  isHot: boolean

  // 置顶
  @Column()
  isTop: boolean

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date

  @Column()
  viewCount: number

  @ManyToOne(type => ResourceEntity)
  cover: ResourceEntity
}
