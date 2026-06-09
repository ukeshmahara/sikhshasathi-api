export const successResponse = <T>(
  message: string,
  data?: T,
  statusCode: number = 200
) => ({
  success: true,
  statusCode,
  message,
  data: data ?? null,
});

export const errorResponse = (
  message: string,
  statusCode: number = 500,
  errors?: unknown
) => ({
  success: false,
  statusCode,
  message,
  errors: errors ?? null,
});