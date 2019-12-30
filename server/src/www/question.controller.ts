import { Controller, Get, Param, ParseIntPipe, Res, Query, Post, Body } from "@nestjs/common"
import { Response } from "express"
import { sleep } from "src/utils/sleep"
import * as fs from "fs"
import * as path from "path"
import * as process from "child_process"
import { v1 as uuid } from "uuid"
import { ncp } from "ncp"
import * as rimraf from "rimraf"

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
  async submit(@Res() res: Response, @Param("id", new ParseIntPipe()) id: number, @Body() changedFiles) {
    const timeStr = new Date()
      .toISOString()
      .replace(/\D/g, "")
      .substr(0, 14)
    // 1. 准备目录
    const commonFilesPath = path.join(__dirname, `../../workspace/common`)
    const rootPath = path.join(__dirname, `../../workspace/${id}`)

    const homedir = require("os").homedir()

    const workPath = path.join(homedir, `coderace/${id}_${timeStr}_${uuid()}`)

    await cp(rootPath, workPath)
    await cp(commonFilesPath, workPath)

    // 2. 写入改动
    Object.keys(changedFiles).forEach(file => {
      fs.writeFileSync(path.join(workPath, file), changedFiles[file])
    })

    // 3. 执行
    process.execSync(`cd ${workPath} && ${workPath}/docker.sh`)

    const buildLog = fs.readFileSync(path.join(workPath, "log/build.log")).toString()
    const runLog = fs.readFileSync(path.join(workPath, "log/run.log")).toString()
    const timeLog = fs.readFileSync(path.join(workPath, "log/time.log")).toString()

    // 4. 清理
    rimraf.sync(workPath)

    return res.json({
      data: {
        build: buildLog,
        run: runLog,
        time: timeLog,
      },
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

function cp(src: string, dest: string) {
  return new Promise((res, rej) => {
    ncp(src, dest, err => {
      if (err != null) {
        rej(err)
      } else {
        res()
      }
    })
  })
}
