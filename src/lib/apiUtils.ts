import { NextResponse } from "next/server";

// Define standard HTTP status codes and messages
export const HTTP_STATUS = {
  OK: { code: 200, message: "OK" },
  CREATED: { code: 201, message: "Created" },
  BAD_REQUEST: { code: 400, message: "Bad Request" },
  UNAUTHORIZED: { code: 401, message: "Unauthorized" },
  FORBIDDEN: { code: 403, message: "Forbidden" },
  NOT_FOUND: { code: 404, message: "Not Found" },
  METHOD_NOT_ALLOWED: { code: 405, message: "Method Not Allowed" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
} as const;

// Define a type for the response data
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// Utility function to create a JSON response
function createJsonResponse<T>(
  status: (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS],
  data?: T,
  message?: string
) {
  const response: ApiResponse<T> = {
    success: status.code < 400,
    message: message || status.message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return NextResponse.json(response, { status: status.code });
}

// Success response utilities
export function okResponse<T>(data?: T, message?: string) {
  return createJsonResponse(HTTP_STATUS.OK, data, message);
}

export function createdResponse<T>(data?: T, message?: string) {
  return createJsonResponse(HTTP_STATUS.CREATED, data, message);
}

// Error response utilities
export function badRequestResponse(message?: string) {
  return createJsonResponse(HTTP_STATUS.BAD_REQUEST, undefined, message);
}

export function unauthorizedResponse(message?: string) {
  return createJsonResponse(HTTP_STATUS.UNAUTHORIZED, undefined, message);
}

export function forbiddenResponse(message?: string) {
  return createJsonResponse(HTTP_STATUS.FORBIDDEN, undefined, message);
}

export function notFoundResponse(message?: string) {
  return createJsonResponse(HTTP_STATUS.NOT_FOUND, undefined, message);
}

export function methodNotAllowedResponse(message?: string) {
  return createJsonResponse(HTTP_STATUS.METHOD_NOT_ALLOWED, undefined, message);
}

export function internalServerErrorResponse(message?: string) {
  return createJsonResponse(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    undefined,
    message
  );
}
