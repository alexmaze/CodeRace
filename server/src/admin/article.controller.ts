import {
  Controller,
  Get,
  Body,
  Inject,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ArticleService } from "../main/article.service"
import { ArticleEntity, ArticleType } from "../main/article.entity"
import { IPageReq } from "../utils/page"
import { AuthGuard } from "@nestjs/passport"

@Controller("/api/admin/article")
export class ArticleController {
  @Inject()
  service: ArticleService

  @Get("/")
  @UseGuards(AuthGuard())
  list(
    @Query()
    query: IPageReq
  ) {
    return this.service.list(query)
  }

  @Post("/")
  @UseGuards(AuthGuard())
  create(@Body() data: ArticleEntity) {
    return this.service.create(data)
  }

  @Get("/:id")
  @UseGuards(AuthGuard())
  show(@Param("id", ParseIntPipe) id: number) {
    return this.service.show(id)
  }

  @Patch("/:id")
  @UseGuards(AuthGuard())
  update(@Param("id", ParseIntPipe) id, @Body() data: ArticleEntity) {
    data.id = id
    return this.service.update(data)
  }

  @Delete("/:id")
  @UseGuards(AuthGuard())
  remove(@Param("id", ParseIntPipe) id) {
    return this.service.remove(id)
  }
}
