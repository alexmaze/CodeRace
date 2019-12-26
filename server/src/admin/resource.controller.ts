import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  UseInterceptors,
  UploadedFile,
  Query,
  Param,
  Delete,
  Patch,
  Logger,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common"
import { ResourceService } from "../media/resource.service"
import { IPageReq } from "../utils/page"
import { ResourceEntity } from "../media/resource.entity"
import { AuthGuard } from "@nestjs/passport"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller("/api/admin/resource")
export class ResourceController {
  @Inject()
  resourceService: ResourceService

  @Post("upload")
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file) {
    try {
      const data = await this.resourceService.upload(file)
      return data
    } catch (err) {
      Logger.log(err)
      throw err
    }
  }

  @Get("/")
  @UseGuards(AuthGuard())
  list(@Query() query: IPageReq) {
    return this.resourceService.list(query)
  }

  @Get("/:id")
  @UseGuards(AuthGuard())
  show(@Param("id", ParseIntPipe) id) {
    return this.resourceService.show(id)
  }

  @Patch("/:id")
  @UseGuards(AuthGuard())
  update(@Param("id", ParseIntPipe) id, @Body() { description }: ResourceEntity) {
    return this.resourceService.update(id, description)
  }

  @Delete("/:id")
  @UseGuards(AuthGuard())
  remove(@Param("id", ParseIntPipe) id) {
    return this.resourceService.remove(id)
  }
}
