export const createSuccessMessageResponseForClient = (message: string) => ({ message, status: "Ok" })
export const createErrorMessageResponseForClient = (message: string) => ({ message, status: "Not Ok" })

export const getFutureDateTime = (minutesAhead = 1440) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesAhead);

  return date.toISOString().slice(0, 19);
};