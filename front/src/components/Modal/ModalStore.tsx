/*
 * @file modal store used to make modal create by js
 * @author yanhao1991 <yanhao1991@gmail.com>
 */

import * as React from "react"
import { observable, action } from "mobx"
import { autobind } from "core-decorators"
import { ModalProps as IModalProps } from "antd/lib/modal"

const generateId = (() => {
  let ID = 0
  return () => {
    return `MODAL#${ID++}`
  }
})()

// 模态框组件定义，要求 Props
type ModalComponent<IInput, IResult> =
  | React.ComponentClass<ICommonModalProps<IInput, IResult>>
  | React.FunctionComponent<ICommonModalProps<IInput, IResult>>

export abstract class ModalComp<IInput, IResult> extends React.Component<ICommonModalProps<IInput, IResult>, {}> {}

export interface ICommonModalProps<IInput, IResult> {
  resolve: (result?: IResult) => void
  reject: (err?: any) => void
  data?: IInput
}

export interface IModal<IInput, IResult> {
  id: string
  modalProps: IModalProps
  Component: ModalComponent<IInput, IResult>
  props: ICommonModalProps<IInput, IResult>
  data: IInput
}

export interface IModalAddReturn<IResult> {
  promise: Promise<IResult>
  resolve: (result?: IResult) => void
  reject: () => void
}

@autobind
export class ModalStore {
  @observable
  modals: Array<IModal<any, any>> = []

  @action
  add<IInput, IResult>(
    modalProps: IModalProps,
    Component: ModalComponent<IInput, IResult>,
    data?: IInput
  ): Promise<IResult> {
    return this.accessibleAdd(modalProps, Component, data).promise
  }

  @action
  accessibleAdd<IInput, IResult>(
    modalProps: IModalProps,
    Component: ModalComponent<IInput, IResult>,
    data?: IInput
  ): IModalAddReturn<IResult> {
    const id = generateId()

    let doResolve
    let doReject

    const promise = new Promise<IResult>((res, rej) => {
      doResolve = (result: IResult) => {
        res(result)
        this.remove(id)
      }
      doReject = (err: any) => {
        // err 不能是 event 对象
        // The SyntheticEvent is pooled. This means that the SyntheticEvent object will be reused
        // and all properties will be nullified after the event callback has been invoked.
        rej(err)
        this.remove(id)
      }

      const defaultProps = observable({
        visible: true,
        closable: true,
        confirmLoading: false,
        centerTitle: true,
        footer: null,
        onCancel: doReject,
        maskClosable: false,
        ...modalProps,
      }) as IModalProps

      this.modals.push({
        id,
        Component,
        modalProps: defaultProps,
        data,
        props: {
          data,
          resolve: doResolve,
          reject: doReject,
        },
      })
    })

    return {
      promise,
      resolve: doResolve,
      reject: doReject,
    }
  }

  @action
  remove(id: string) {
    const index = this.modals.findIndex(item => item.id === id)
    if (index === -1) {
      return
    }
    this.modals.splice(index, 1)
  }
}
