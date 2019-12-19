/*
 * @file modal container to contain all modals
 * @author yanhao1991 <yanhao1991@gmail.com>
 */

import * as React from "react"
import { observer } from "mobx-react"
import { ModalStore } from "./ModalStore"
import { Modal } from "antd"

@observer
export class ModalContainer extends React.Component<{ store: ModalStore }, {}> {
  render() {
    return (
      <div>
        {this.props.store.modals.map(item => (
          <Modal key={item.id} {...item.modalProps}>
            <item.Component {...item.props} />
          </Modal>
        ))}
      </div>
    )
  }
}
