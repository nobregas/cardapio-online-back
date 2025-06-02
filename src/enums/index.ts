export enum ErrorCode {
    RATE_LIMIT_EXCEEDED = 1001,
    SOMETHING_WENT_WRONG = 5001,
    VALIDATION_ERROR = 4001,
}

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,      
    INTERNAL_SERVER_ERROR = 500,
    RATE_LIMIT_EXCEEDED = 429,
}

export enum ErrorMessage {
    RATE_LIMIT_EXCEEDED = "Rate limit exceeded",
    SOMETHING_WENT_WRONG = "Something went wrong",
    VALIDATION_ERROR = "Validation error",
}   