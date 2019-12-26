export enum NodeEnv {
  Production = "production",
  Development = "development",
  Test = "test",
}

export function parseNodeEnv(value: string) {
  switch (value) {
    case NodeEnv.Production:
    case NodeEnv.Development:
    case NodeEnv.Test:
      return value
    default:
      throw new Error(`Can't recognize NODE_ENV: ${value}`)
  }
}
