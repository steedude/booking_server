export function formatCatchErrorMessage(error: unknown) {
  const isErrorConstructor = error instanceof Error;
  const message = isErrorConstructor ? error.message : String(error);

  return message;
}
