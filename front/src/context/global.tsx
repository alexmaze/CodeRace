import * as React from "react"

import { SessionStore } from "@/stores/session"
import { Log } from "@/utils"
import { ModalStore, ModalContainer } from "@/components/Modal"

export interface IGlobalState {
  modalStore: ModalStore
  sessionStore: SessionStore
}

const contextValue: IGlobalState = {
  modalStore: new ModalStore(),
  sessionStore: new SessionStore(),
}

export const GlobalContext = React.createContext<IGlobalState>(contextValue)

export const GlobalContextProvider: React.FC = ({ children }) => {
  Log("GlobalContextProvider").debug("render")
  return (
    <GlobalContext.Provider value={contextValue}>
      <ModalContainer store={contextValue.modalStore} />
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal(): IGlobalState {
  return React.useContext(GlobalContext)
}
