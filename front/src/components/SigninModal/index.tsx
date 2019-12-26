import React, { useState, FormEvent } from "react"
import { ICommonModalProps } from "@/components/Modal"
import { Input, Button, Form } from "antd"
import { useGlobal } from "@/context/global"

type ISigninModalProps = ICommonModalProps<{}, {}>

export const SigninModal: React.FC<ISigninModalProps> = props => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const { sessionStore } = useGlobal()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await sessionStore.login(name, password)
    console.log(sessionStore.session)
  }

  return (
    <div className="signin-modal">
      <Form className="input-form" onSubmit={handleSubmit}>
        <Form.Item>
          <Input
            value={name}
            autoFocus={true}
            size="large"
            onChange={e => setName(e.target.value)}
            placeholder="用户名"
          ></Input>
        </Form.Item>
        <Form.Item>
          <Button size="large" disabled={!name} htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
