import React from "react"
import { CodeLanguage } from "@/types"
import { autobind } from "core-decorators"
import MonacoEditor from "react-monaco-editor"
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api"
import { initVimMode } from "monaco-vim"
import "./style.less"

export interface IFile {
  name: string
  language?: CodeLanguage
  readonly?: boolean
  files?: IFile[]
  content?: string
  isFolder: boolean
}

interface IIDEProps {
  root: IFile
  onRetrieveFileContent: (path: string) => Promise<string>
  onFileChange: (path: string, content: string) => void
}

@autobind
export class IDE extends React.Component<IIDEProps, {}> {
  vimStatusElPromiseRes: (el: any) => void
  vimStatusElPromise = new Promise(res => {
    this.vimStatusElPromiseRes = res
  })
  vimMode: any

  componentWillUnmount() {
    if (this.vimMode) {
      this.vimMode.dispose()
    }
  }

  render() {
    const code = ""
    const options = {
      selectOnLineNumbers: true,
    }

    return (
      <div className="comp-ide">
        <MonacoEditor
          width="100%"
          height="600"
          language={"go"}
          theme="hc-black"
          value={code}
          options={options}
          onChange={this.handleEditorChange}
          editorDidMount={this.handleEditorDidMount}
        />
        <div ref={v => this.vimStatusElPromiseRes(v)}></div>
      </div>
    )
  }

  handleEditorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor) {
    this.vimStatusElPromise.then(el => {
      console.log("editor did mount", el)
      initVimMode(editor, el)
    })
  }

  handleEditorChange(v: any) {
    console.log(v)
  }
}
