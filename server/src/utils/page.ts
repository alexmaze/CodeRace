import { Repository } from "typeorm"

export interface IPageReq {
  page: number
  size: number
  query?: string
}

export interface IPageRes<T> extends IPageReq {
  total: number
  data: T[]
}

export class Pager<T> {
  constructor(private params: IPageReq, private repo: Repository<T>) {}

  async getPage(where?: any, sort?: string, order?: "ASC" | "DESC"): Promise<IPageRes<T>> {
    const skip = (this.params.page - 1) * this.params.size

    let query = this.repo.createQueryBuilder("r")

    if (sort != null) {
      query = query.addOrderBy(sort, order || "DESC")
    }

    query = query
      .where(where)
      .offset(skip)
      .limit(this.params.size)

    const [data, total] = await query.getManyAndCount()

    return {
      ...this.params,
      total,
      data,
    }
  }

  async getPage2(
    where?: any,
    sort?: string,
    order?: "ASC" | "DESC",
    sort2?: string,
    order2?: "ASC" | "DESC"
  ): Promise<IPageRes<T>> {
    const skip = (this.params.page - 1) * this.params.size

    let query = this.repo.createQueryBuilder("r")

    if (sort != null) {
      query = query.addOrderBy(sort, order || "DESC")
    }
    if (sort2 != null) {
      query = query.addOrderBy(sort2, order2 || "DESC")
    }

    query = query
      .where(where)
      .offset(skip)
      .limit(this.params.size)

    const [data, total] = await query.getManyAndCount()

    return {
      ...this.params,
      total,
      data,
    }
  }
}
