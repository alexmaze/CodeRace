import { Store } from "@/stores/core/store"
import { autobind } from "core-decorators"
import { QuestionAPI } from "@/apis"
import { message } from "antd"
import { observable } from "mobx"
import { IQuestion } from "@/types"
import { IFile } from "@/components/IDE"
import { Log } from "@/utils"

const l = Log("QuestionStore")

@autobind
export class QuestionStore extends Store {
  @observable loading = true
  @observable question: IQuestion

  @observable loadingRootFolder = true
  @observable rootFolder: IFile

  @observable output: string[] = []

  @observable changedFiles: { [path: string]: string } = {}

  constructor(private id: string) {
    super()
  }

  async load() {
    this.loading = true

    try {
      const res = await QuestionAPI.show(this.id)
      this.question = res.data
    } catch (e) {
      message.error("加载问题失败")
    }

    this.loading = false
  }

  async loadFolder() {
    this.loadingRootFolder = true

    try {
      const res = await QuestionAPI.showFolder(this.id)
      this.rootFolder = res.data
    } catch (e) {
      message.error("加载问题目录数据失败")
    }

    this.loadingRootFolder = false
  }

  async loadFileContent(path: string): Promise<IFile> {
    const file = this.findFile(path)

    if (file.content) {
      return file
    }

    if (file.isFolder) {
      file.content = ""
      return file
    }

    try {
      const res = await QuestionAPI.showFileContent(this.id, path)
      file.content = res.data
    } catch (e) {
      message.error("加载文件内容失败: " + path)
    }

    return file
  }

  async saveTempFileContent(path: string, content: string) {
    const file = this.findFile(path)

    if (file.isFolder) {
      return
    }

    if (file.readonly) {
      return
    }

    l.debug("保存")
    this.changedFiles[path] = content
  }

  async submit() {
    l.debug("提交", this.changedFiles)
    try {
      const res = await QuestionAPI.submit(this.id, this.changedFiles)
      this.output = [...this.output, res.data]
      l.debug(this.output)
    } catch (e) {
      message.error("执行失败")
    }
  }

  findFile(path: string): IFile {
    if (path.charAt(0) === "/") {
      path = path.substr(1)
    }

    if (path === "") {
      return this.rootFolder
    }

    const pathArr = path.split("/")
    let file = this.rootFolder
    for (const p of pathArr) {
      if (file == null || !file.isFolder) {
        throw new Error("路径错误: " + path)
      }

      file = file.files.find(v => v.name === p)
    }

    return file
  }
}
