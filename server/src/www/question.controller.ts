import { Controller, Get, Param, ParseIntPipe, Res, Query, Post } from "@nestjs/common"
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
          language: "go",
          status: "Racing",
          due_date: "2019-12-31 14:00:00",
          created_at: "2019-12-18 14:00:00",
          updated_at: "2019-12-18 14:00:00",
        },
        {
          id: 2,
          title: "SMS Content Sensitive Words Recognition",
          description: "Recognize sensitive words in sms text content accurately and rapidly.",
          language: "go",
          status: "Planing",
          due_date: "2020-01-31 14:00:00",
          created_at: "2019-12-18 14:00:00",
          updated_at: "2019-12-18 14:00:00",
        },
      ],
    })
  }

  @Get("/:id")
  async show(@Res() res: Response, @Param("id", new ParseIntPipe()) id: number) {
    await sleep(1)
    return res.json({
      data: {
        id: 1,
        title: "SMS Content Links Recognition",
        description: "Recognize links in sms text content accurately and rapidly.",
        language: "go",
        status: "Racing",
        due_date: "2019-12-31 14:00:00",
        created_at: "2019-12-18 14:00:00",
        updated_at: "2019-12-18 14:00:00",
      },
    })
  }

  @Get("/:id/folder")
  async showFolder(@Res() res: Response, @Param("id", new ParseIntPipe()) id: number) {
    interface IFile {
      name: string
      language?: string
      readonly?: boolean
      files?: IFile[]
      content?: string
      isFolder: boolean
    }

    return res.json({
      data: {
        name: "CODE RACE",
        isFolder: true,
        files: [
          {
            name: "input.json",
            language: "json",
            readonly: true,
          },
          {
            name: "main.go",
            language: "go",
            readonly: false,
          },
          {
            name: "output",
            isFolder: true,
            files: [
              {
                name: "xxx",
              },
            ],
          },
        ],
      },
    })
  }

  @Get("/:id/file")
  async showFileContent(@Res() res: Response, @Query("path") path: string) {
    if (path === "/input.json") {
      return res.json({
        data: `
{
    "name": "alex"
}
            `,
      })
    } else {
      return res.json({
        data: `
package main

import (
    "fmt"
)

func main() {
    fmt.Println("hell")
}
            `,
      })
    }
  }

  @Post("/:id/submit")
  async submit(@Res() res: Response, @Param("id", new ParseIntPipe()) path: string) {
    await sleep(1)
    return res.json({
      data: "success!",
    })
  }
}
