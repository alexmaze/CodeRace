import * as React from "react"
import { Log } from "@/utils"

import { Loading } from "@/components/Loading"
import { IPageResponse, IQuestion, QuestionStatus } from "@/types"
import { QuestionAPI } from "@/apis"
import { message } from "antd"
import { Link } from "react-router-dom"
import "./style.less"

const l = Log("Home")

export const Home: React.FC = () => {
  l.debug("render Home")

  const [page] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [response, setResponse] = React.useState(null as IPageResponse<IQuestion>)

  React.useEffect(() => {
    setLoading(true)

    QuestionAPI.list({ page, size: 10 })
      .then(
        res => {
          setResponse(res)
        },
        err => {
          message.error("加载失败")
        }
      )
      .then(() => {
        setLoading(false)
      })
  }, [page])

  return (
    <div className="page cont-home crt">
      <h1 className="glow">Hello Coder,</h1>
      <p className="glow">
        Welcome to <b>code race playground</b>.
      </p>
      <p className="glow">Please select your race:</p>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <ul className="question-list">
            {response?.data?.map(item => {
              return (
                <li key={item.id} className="question-item">
                  <Link to={"/question/" + item.id}>
                    <div className={"question-item-title " + (item.status === QuestionStatus.Racing ? "glow" : "")}>
                      #{item.id} [{item.status}] {item.title}
                    </div>
                    <div className="question-item-description">{item.description}</div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
