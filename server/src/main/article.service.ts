import { Injectable, Inject, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { MediaService } from "../media/media.service"
import { ArticleEntity } from "./article.entity"
import { IPageReq, Pager } from "../utils/page"

@Injectable()
export class ArticleService {
  @Inject()
  mediaService: MediaService

  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repo: Repository<ArticleEntity>
  ) {}

  async list(params: IPageReq) {
    const res = await new Pager(params, this.repo).getPage()
    return res
  }

  async create(data: ArticleEntity) {
    data.createdAt = new Date()
    data.updatedAt = data.createdAt
    data.viewCount = 0
    return this.repo.save(data)
  }

  async show(id: number) {
    const item = await this.repo.findOne({
      id,
    })

    if (item == null) {
      throw new NotFoundException()
    }

    return item
  }

  async update(data: ArticleEntity) {
    const item = await this.show(data.id)

    if (item == null) {
      throw new NotFoundException()
    }

    return this.repo.save(data)
  }

  async remove(id: number) {
    try {
      const item = await this.show(id)
      await this.repo.remove(item)
    } catch (err) {
      throw err
    }

    return {}
  }
}
