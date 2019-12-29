import React, { useState, useEffect } from "react"

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  ".",
]

export const Loading: React.FC<{ text?: string }> = ({ text }) => {
  const letters = (text || "LOADING...").split("")

  let [count, setCount] = useState(0)

  useEffect(() => {
    const h = setTimeout(() => {
      setCount((count + 1) % letters.length)
    }, 400)

    return () => clearTimeout(h)
  }, [count, letters])

  return (
    <span className="comp-loading">
      {letters.map((l, i) => (
        <Letter key={i} letter={l} locked={i <= count}></Letter>
      ))}
    </span>
  )
}

const Letter: React.FC<{ letter: string; locked: boolean }> = ({ letter, locked }) => {
  const [count, setCount] = useState(parseInt(Math.random() * ALPHABET.length + "", 10))

  useEffect(() => {
    const h = setTimeout(() => {
      setCount((count + 1) % ALPHABET.length)
    }, 100)

    return () => clearTimeout(h)
  }, [count])

  if (locked) {
    return <span className="glow">{letter}</span>
  }

  return <span>{ALPHABET[count]}</span>
}
