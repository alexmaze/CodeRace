import { Controller, Get, Inject, Param, ParseIntPipe, Res } from "@nestjs/common"
import { ArticleService } from "../main/article.service"
import { Response } from "express"

@Controller("/article")
export class ArticleController {
  @Inject()
  articleServ: ArticleService

  @Get("/")
  async index(@Res() res: Response) {
    const defaultPageSize = 6

    const items = await this.articleServ.list({ page: 1, size: defaultPageSize })

    return res.json(items)
  }

  @Get("/:id")
  async show(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    const data: any = await this.articleServ.show(id)

    return res.json(data)
  }
}
