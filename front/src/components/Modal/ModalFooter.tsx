/*
 * @file common modal footer
 * @author yanhao1991 <yanhao1991@gmail.com>
 */

import * as React from "react"
import classnames from "classnames"
import { Button } from "antd"

import "./style.less"

export interface IModalFooterProps extends React.Props<void> {
  hideOk?: boolean
  hideCancel?: boolean

  // 如果为TRUE，确定按钮loading，取消按钮disabled
  loading?: boolean

  onOk?: () => void
  onCancel?: () => void
  okText?: JSX.Element | string
  cancelText?: JSX.Element | string
  hideBorder?: boolean

  disabledOk?: boolean
  disabledCancel?: boolean
}

export const ModalFooter = (props: IModalFooterProps) => {
  const okText = props.okText || "确定"
  const cancelText = props.cancelText || "取消"

  return (
    <div
      className={classnames("comp-modal-footer", {
        "hide-border": props.hideBorder,
      })}
    >
      <div className="left">{props.children}</div>
      <div className="right">
        {!props.hideCancel && (
          <Button onClick={() => props.onCancel()} disabled={props.loading || props.disabledCancel}>
            {cancelText}
          </Button>
        )}
        {!props.hideOk && (
          <Button type="primary" onClick={props.onOk} loading={props.loading} disabled={props.disabledOk}>
            {okText}
          </Button>
        )}
      </div>
    </div>
  )
}
