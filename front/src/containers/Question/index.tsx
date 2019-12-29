import * as React from "react"
import { useParams } from "react-router-dom"

import "./style.less"
import { IGlobalState, useGlobal } from "@/context/global"
import { autobind } from "core-decorators"
import { observer } from "mobx-react"
import { Loading } from "@/components/Loading"
import { IDE } from "@/components/IDE"
import { QuestionStore } from "./store"

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
  store = new QuestionStore(this.props.id)

  componentDidMount() {
    this.store.load()
    this.store.loadFolder()
  }

  componentWillUnmount() {
    this.store.dispose()
  }

  render() {
    const { loading } = this.store
    return <div className="page cont-question crt">{loading ? <Loading /> : this.renderQuestion()}</div>
  }

  renderQuestion() {
    const { question, rootFolder, loadFileContent, saveTempFileContent } = this.store
    return (
      <>
        <h1 className="title glow">
          #{this.props.id} [{question.status}] {question.title}
        </h1>
        <p className="glow">
          <span style={{ marginRight: 60 }}>
            <b>Language</b>: {question.language}
          </span>
          <span>
            <b>Due Date</b>: {new Date(question.due_date).toLocaleDateString()}
          </span>
        </p>
        <p className="glow" style={{ marginBottom: 20 }}>
          <b>Description</b>: {question.description}
        </p>

        <IDE root={rootFolder} onRetrieveFileContent={loadFileContent} onFileChange={saveTempFileContent} />
      </>
    )
  }
}
