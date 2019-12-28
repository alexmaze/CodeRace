import { Controller, Get, Param, ParseIntPipe, Res, Query } from "@nestjs/common"
import { Response } from "express"
import { sleep } from "src/utils/sleep"

@Controller("/api/question")
export class QuestionController {
  @Get("/")
  async index(@Res() res: Response, @Query("page", new ParseIntPipe()) page, @Query("size", new ParseIntPipe()) size) {
    await sleep(3)

    return res.json({
      page,
      size,
      total: 2,
      data: [
        {
          id: 1,
          title: "SMS Content Links Recognition",
          description: "Recognize links in sms text content accurately and rapidly.",
          language: "golang",
          status: "Racing",
          due_date: "2019-12-31 14:00:00",
          created_at: "2019-12-18 14:00:00",
          updated_at: "2019-12-18 14:00:00",
        },
        {
          id: 2,
          title: "SMS Content Sensitive Words Recognition",
          description: "Recognize sensitive words in sms text content accurately and rapidly.",
          language: "golang",
          status: "Planing",
          due_date: "2020-01-31 14:00:00",
          created_at: "2019-12-18 14:00:00",
          updated_at: "2019-12-18 14:00:00",
        },
      ],
    })
  }

  @Get("/:id")
  async show(@Res() res: Response, @Param("id", ParseIntPipe) id: number) {
    await sleep(1)
    return res.json({
      data: {
        id: 1,
        title: "SMS Content Links Recognition",
        description: "Recognize links in sms text content accurately and rapidly.",
        language: "golang",
        status: "Racing",
        due_date: "2019-12-31 14:00:00",
        created_at: "2019-12-18 14:00:00",
        updated_at: "2019-12-18 14:00:00",
      },
    })
  }
}
