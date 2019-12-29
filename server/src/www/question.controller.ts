import { Controller, Get, Param, ParseIntPipe, Res, Query, Post } from "@nestjs/common"
import { Response } from "express"
import { sleep } from "src/utils/sleep"
import * as fs from "fs"
import * as path from "path"

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
    const rootPath = path.join(__dirname, `../../workspace/${id}`)
    const data = readFileInfoRecursively(rootPath)
    data.name = "workspace"

    return res.json({
      data,
    })
  }

  @Get("/:id/file")
  async showFileContent(@Res() res: Response, @Param("id", new ParseIntPipe()) id: number, @Query("path") p: string) {
    const filePath = path.join(__dirname, `../../workspace/${id}${p}`)

    const buf = fs.readFileSync(filePath)
    return res.json({
      data: buf.toString(),
    })
  }

  @Post("/:id/submit")
  async submit(@Res() res: Response, @Param("id", new ParseIntPipe()) path: string) {
    await sleep(1)
    return res.json({
      data: "success!",
    })
  }
}

interface IFile {
  name: string
  language?: string
  readonly?: boolean
  files?: IFile[]
  content?: string
  isFolder: boolean
}

function readFileInfoRecursively(path: string): IFile {
  const pathArr = path.split("/")
  const name = pathArr[pathArr.length - 1]

  const stat = fs.statSync(path)

  if (stat.isDirectory()) {
    const subFiles = fs.readdirSync(path)

    return {
      name,
      isFolder: true,
      files: subFiles.map(v => readFileInfoRecursively(path + "/" + v)),
    }
  }

  return {
    name,
    language: name.substr(name.lastIndexOf(".") + 1),
    isFolder: false,
  }
}
