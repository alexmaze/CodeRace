import React from "react"
import { CodeLanguage } from "@/types"
import { autobind } from "core-decorators"
import MonacoEditor from "react-monaco-editor"
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api"
import { initVimMode } from "monaco-vim"
import { Tree, Icon, Tooltip } from "antd"

import { observable } from "mobx"
import { observer } from "mobx-react"
import { Log } from "@/utils"
import "./style.less"
import { Loading } from "../Loading"

const l = Log("IDE")
const { TreeNode, DirectoryTree } = Tree

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
  output: string[]
  onRetrieveFileContent: (path: string) => Promise<IFile>
  onFileChange: (path: string, content: string) => void
  onSubmit: () => Promise<void>
}

@observer
@autobind
export class IDE extends React.Component<IIDEProps, {}> {
  vimStatusElPromiseRes: (el: any) => void
  vimStatusElPromise = new Promise(res => {
    this.vimStatusElPromiseRes = res
  })
  vimMode: any

  terminalEl: any

  @observable selectedFile: IFile
  @observable selectedPath: string
  @observable showTerminal = false

  @observable submitting = false

  componentDidMount() {
    const defaultSelectedFile = this.props.root.files.find(v => v.name === "main.go")
    if (defaultSelectedFile) {
      this.selectFile("/main.go")
    }
  }

  componentWillUnmount() {
    if (this.vimMode) {
      this.vimMode.dispose()
    }
  }

  renderFile(parentPath: string, file: IFile) {
    const currentPath = `${parentPath}/${file.name}`

    if (!file.isFolder) {
      return <TreeNode title={file.name} isLeaf key={currentPath}></TreeNode>
    }

    return (
      <TreeNode title={file.name} key={currentPath}>
        {file.files.map(v => this.renderFile(currentPath, v))}
      </TreeNode>
    )
  }

  renderTerminal() {
    return (
      <div className="terminal" ref={v => (this.terminalEl = v)}>
        <pre>
          <code>{this.props.output.join("\n")}</code>
        </pre>
        <div>{this.submitting && <Loading text="submitting..." />}</div>
      </div>
    )
  }

  render() {
    const options = {
      selectOnLineNumbers: true,
    }

    return (
      <div className="comp-ide">
        <div className="file-tree">
          <DirectoryTree multiple defaultExpandAll onSelect={this.handleTreeSelect} onExpand={this.handleTreeExpand}>
            {this.renderFile("", this.props.root)}
          </DirectoryTree>
        </div>

        <div className="content">
          <div className="action-bar">
            <div className="file-path">
              <Icon
                className="file-icon"
                type={this.selectedFile && this.selectedFile.isFolder ? "folder" : "file"}
              ></Icon>
              {this.selectedPath || "-"}
            </div>

            <div className="actions">
              <Tooltip title="Terminal">
                <Icon onClick={this.toggleTerminal} type="code" className="action-icon" />
              </Tooltip>
              <Tooltip title="Upload & Run">
                <Icon onClick={this.handleSubmit} className="action-icon" type="caret-right" />
              </Tooltip>
            </div>
          </div>
          <MonacoEditor
            width="100%"
            height="600"
            language={this.selectedFile && this.selectedFile.language}
            theme="hc-black"
            value={(this.selectedFile && this.selectedFile.content) || ""}
            options={options}
            onChange={this.handleEditorChange}
            editorDidMount={this.handleEditorDidMount}
          />
          {this.showTerminal && this.renderTerminal()}
          <div ref={v => this.vimStatusElPromiseRes(v)}></div>
        </div>
      </div>
    )
  }

  async handleSubmit() {
    this.showTerminal = true
    this.submitting = true
    try {
      await this.props.onSubmit()
    } catch (e) {
      l.debug(e)
    }

    this.submitting = false
  }

  handleEditorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor) {
    this.vimStatusElPromise.then(el => {
      l.debug("editor did mount")
      this.vimMode = initVimMode(editor, el)
      // debugger
    })
  }

  handleEditorChange(v: string) {
    if (!this.selectedPath) {
      return
    }
    l.debug("editor change", v)
    this.props.onFileChange(this.selectedPath, v)
  }

  toggleTerminal() {
    this.showTerminal = !this.showTerminal
  }

  handleTreeSelect(pathes: string[]) {
    let file = pathes[0].substr(this.props.root.name.length + 1)
    if (file === "") {
      file = "/"
    }

    this.selectFile(file)
  }

  selectFile(path: string) {
    this.selectedPath = path
    this.props.onRetrieveFileContent(path).then(f => {
      this.selectedFile = f
      this.vimMode.setSelection(0, 1)
      l.debug("tree seelct", f)
    })
  }

  handleTreeExpand(v: any) {
    l.debug("tree expand", v)
  }
}
