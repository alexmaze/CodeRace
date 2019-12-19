import * as React from "react"
import { Dropdown, Spin, Button, Icon } from "antd"

import "./style.less"

export interface IUserIndicatorProps {
  loading: boolean
  isLoggedIn: boolean
  username?: string
  onSignIn: () => void
  onSignOut: () => void
}

export const UserIndicator: React.FC<IUserIndicatorProps> = props => {
  return (
    <div className="comp-user-indicator">
      {props.loading ? (
        <Spin />
      ) : props.isLoggedIn ? (
        <LoggedIndicator username={props.username} onSignOut={props.onSignOut} />
      ) : (
        <UnLoggedIndicator onQuickStart={props.onSignIn} />
      )}
    </div>
  )
}

const UnLoggedIndicator = ({ onQuickStart }: { onQuickStart: () => void }) => {
  return (
    <Button type="primary" onClick={onQuickStart}>
      退出登录
    </Button>
  )
}

const LoggedIndicator = ({ username, onSignOut }: { username: string; onSignOut: () => void }) => {
  return (
    <Dropdown
      className="comp-user-indicator"
      overlay={
        <div>
          <div className="info">{username}</div>
          <div className="actions">
            <a onClick={onSignOut}>退出登录</a>
          </div>
        </div>
      }
    >
      <span
        style={{
          cursor: "default",
        }}
      >
        <Icon type="user" /> {username}
      </span>
    </Dropdown>
  )
}
