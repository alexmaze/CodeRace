import * as React from "react"
import { Log } from "@/utils"
import { Navbar } from "./Navbar"

import "./style.less"

const l = Log("Home")

export const Home: React.FC = () => {
  l.debug("render Home")

  return (
    <div className="page cont-home">
      <Navbar></Navbar>

      <article>hello</article>
    </div>
  )
}
