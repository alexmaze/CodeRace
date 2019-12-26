import React from "react"

import { observer } from "mobx-react"
import { autobind } from "core-decorators"

import { Log } from "@/utils"
import { IGlobalState, useGlobal } from "@/context/global"
import { UserIndicator } from "@/components/UserIndicator"
import { SigninModal } from "@/components/SigninModal"

export const Navbar: React.FC = () => {
  const globalState = useGlobal()
  return <NavbarImpl {...globalState}></NavbarImpl>
}

@observer
@autobind
export class NavbarImpl extends React.Component<IGlobalState, {}> {
  handleLogin() {
    const { modalStore } = this.props
    modalStore.add(
      {
        width: 500,
        centered: true,
        title: "登录",
      },
      SigninModal
    )
  }

  render() {
    Log("Navbar").debug("render navbar")

    const { sessionStore } = this.props

    return (
      <div className="navbar">
        <div className="navbar-inner">
          <a href="/" className="logo">
            <span>Code Race</span>
          </a>
          <ul className="actions">
            <li>
              <UserIndicator
                loading={sessionStore.loading}
                isLoggedIn={sessionStore.isLoggedIn}
                username={sessionStore.username}
                onSignIn={this.handleLogin}
                onSignOut={sessionStore.logout}
              ></UserIndicator>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
