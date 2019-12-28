import * as React from "react"
import { useParams } from "react-router-dom"

import "./style.less"
import { IGlobalState, useGlobal } from "@/context/global"
import { autobind } from "core-decorators"
import { observer } from "mobx-react"
import { observable } from "mobx"
import { IQuestion } from "@/types"
import { message } from "antd"
import { QuestionAPI } from "@/apis"
import { Loading } from "@/components/Loading"

export const Question: React.FC = () => {
  const { id } = useParams()
  const global = useGlobal()
  return <QuestionImpl id={id} global={global}></QuestionImpl>
}

@observer
@autobind
class QuestionImpl extends React.Component<
  {
    id: string
    global: IGlobalState
  },
  {}
> {
  @observable loading = true
  @observable question: IQuestion

  componentDidMount() {
    this.load()
  }

  async load() {
    this.loading = true

    try {
      const res = await QuestionAPI.show(this.props.id)
      this.question = res.data
    } catch (e) {
      message.error("加载问题失败")
    }

    this.loading = false
  }

  render() {
    return <div className="page cont-question crt">{this.loading ? <Loading /> : this.renderQuestion()}</div>
  }

  renderQuestion() {
    return (
      <>
        <h1 className="title glow">
          #{this.props.id} [{this.question.status}] {this.question.title}
        </h1>
        <p className="glow">
          <span style={{ marginRight: 60 }}>
            <b>Language</b>: {this.question.language}
          </span>
          <span>
            <b>Due Date</b>: {new Date(this.question.due_date).toLocaleDateString()}
          </span>
        </p>
        <p className="glow">
          <b>Description</b>: {this.question.description}
        </p>
      </>
    )
  }
}
