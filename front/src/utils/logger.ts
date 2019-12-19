const TEXT_COLOR = "color: #222831"
const DEBUG_COLOR = "color: #29a19c"

const COLORS = [
  "#cf1322",
  "#d4380d",
  "#d46b08",
  "#d48806",
  "#7cb305",
  "#389e0d",
  "#08979c",
  "#096dd9",
  "#1d39c4",
  "#531dab",
  "#c41d7f",
]

function hashCode(str: string) {
  var hash = 0
  if (str.length === 0) {
    return hash
  }
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function mapColor(id: string): string {
  const index = Math.abs(hashCode(id) % COLORS.length)

  return `color: ${COLORS[index]}`
}

type MessageContent = string | object

class Logger {
  private id: string
  private color: string

  constructor(id: string) {
    this.id = id
    this.color = mapColor(id)
  }

  private log(flag: string, flagColor: string, messageColor: string, messages: MessageContent[]) {
    const msgs = []
    for (const msg of messages) {
      if (typeof msg !== "string") {
        msgs.push(JSON.stringify(msg, null, 2))
      } else {
        msgs.push(msg)
      }
    }

    console.log(`%c[${flag}] %c[${this.id}] ${msgs.join("\t")}`, flagColor, this.color)
  }

  public debug(...messages: MessageContent[]) {
    this.log("DEBUG", DEBUG_COLOR, TEXT_COLOR, messages)
  }
}

export function Log(id: string): Logger {
  return new Logger(id)
}
