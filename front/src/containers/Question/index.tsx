import * as React from "react"
import { useParams } from "react-router-dom"

export const Question: React.FC = () => {
  const { id } = useParams()
  return <div>question: {id}</div>
}
