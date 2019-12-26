import { Injectable, Global } from "@nestjs/common"

@Global()
@Injectable()
export class MediaService {
  // 上传文件到对象存储，成功返回key
  async uploadFile(file: any) {
    // const key = randomKey()
    // await this.getClient().put(key, file.buffer)
    // return key
  }

  // 获取文件URL
  getPublicUrl(key: string, process?: string, expires?: number) {
    // // 默认URL一小时过期
    // if (expires == null) {
    //   expires = 3600
    // }
    // return this.getClient().signatureUrl(key, {
    //   process,
    //   expires,
    // })
  }

  // 从对象存储删除文件
  deleteFile(key: string) {
    // return this.getClient().delete(key)
  }
}
