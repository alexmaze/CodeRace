import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Question } from "@/containers/Question"
import { Home } from "@/containers/Home"

import { GlobalContextProvider } from "./context/global"

const App: React.FC = () => {
  return (
    <GlobalContextProvider>
      <Router>
        <Switch>
          <Route path="/question/:id">
            <Question />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </GlobalContextProvider>
  )
}

export default App
