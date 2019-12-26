import {
  Injectable,
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ResourceEntity } from "./resource.entity"
import { Repository } from "typeorm"
import { IPageReq, Pager } from "../utils/page"
import { MediaService } from "./media.service"

@Injectable()
export class ResourceService {
  @Inject()
  mediaService: MediaService

  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepo: Repository<ResourceEntity>
  ) {}

  async list(params: IPageReq) {
    const res = await new Pager(params, this.resourceRepo).getPage()

    if (res && res.data) {
      for (const item of res.data) {
        item.withUrl(this.mediaService)
      }
    }

    return res
  }

  async show(id: number, ignoreUrl?: boolean) {
    const item = await this.resourceRepo.findOne({
      id,
    })

    if (item == null) {
      throw new NotFoundException()
    }

    if (!ignoreUrl) {
      item.withUrl(this.mediaService)
    }
    return item
  }

  async update(id: number, description?: string) {
    const item = await this.show(id, true)
    if (description != null) {
      item.description = description
    }

    return this.resourceRepo.save(item)
  }

  async remove(id: number) {
    try {
      const item = await this.show(id, true)
      const key = item.key
      await this.resourceRepo.remove(item)
      await this.mediaService.deleteFile(key)
    } catch (err) {
      throw err
    }

    return {}
  }

  async upload(file: File) {
    let fileKey = null
    try {
      fileKey = await this.mediaService.uploadFile(file)
      const entity = new ResourceEntity(fileKey)
      return await this.resourceRepo.save(entity)
    } catch (err) {
      if (fileKey != null) {
        this.mediaService.deleteFile(fileKey)
      }
      throw err
    }
  }
}
