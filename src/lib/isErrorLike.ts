type ErrorLike = {
  message: string
}

const has = <X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is Record<Y, unknown> & X => Object.prototype.hasOwnProperty.call(obj, prop)

export const isErrorLike = (err: unknown): err is ErrorLike => {
  if (err instanceof Error) {
    return true
  }

  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    has(err, 'message') &&
    typeof err.message === 'string'
  ) {
    return true
  }

  return false
}
