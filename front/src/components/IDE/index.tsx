import React from "react"
import { CodeLanguage } from "@/types"
import { autobind } from "core-decorators"
import MonacoEditor from "react-monaco-editor"
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api"
import { initVimMode } from "monaco-vim"
import { Tree, Icon } from "antd"

import { observable } from "mobx"
import { observer } from "mobx-react"
import { Log } from "@/utils"
import "./style.less"

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
  onRetrieveFileContent: (path: string) => Promise<IFile>
  onFileChange: (path: string, content: string) => void
}

@observer
@autobind
export class IDE extends React.Component<IIDEProps, {}> {
  vimStatusElPromiseRes: (el: any) => void
  vimStatusElPromise = new Promise(res => {
    this.vimStatusElPromiseRes = res
  })
  vimMode: any

  @observable selectedFile: IFile
  @observable selectedPath: string

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
          <div className="file-path">
            <Icon type="file"></Icon>
            {this.selectedPath || "-"}
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
          <div ref={v => this.vimStatusElPromiseRes(v)}></div>
        </div>
      </div>
    )
  }

  handleEditorDidMount(editor: monacoEditor.editor.IStandaloneCodeEditor) {
    this.vimStatusElPromise.then(el => {
      l.debug("editor did mount")
      initVimMode(editor, el)
    })
  }

  handleEditorChange(v: string) {
    l.debug("editor change", v)
  }

  handleTreeSelect(pathes: string[]) {
    const file = pathes[0].substr(this.props.root.name.length + 1)
    this.selectedPath = file
    this.props.onRetrieveFileContent(file).then(f => {
      this.selectedFile = f
      l.debug("tree seelct", f)
    })
  }

  handleTreeExpand(v: any) {
    l.debug("tree expand", v)
  }
}
