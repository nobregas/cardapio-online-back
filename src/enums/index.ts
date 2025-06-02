export enum ErrorCode {
    RATE_LIMIT_EXCEEDED = 1001,
    SOMETHING_WENT_WRONG = 5001,
    VALIDATION_ERROR = 4001,
    USER_ALREADY_EXISTS = 4002,
    USER_NOT_FOUND = 4003,
    INVALID_PASSWORD = 4004,
    INVALID_LOGIN = 4005,
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
    USER_ALREADY_EXISTS = "User already exists",
    INVALID_LOGIN = "Invalid login credentials",
    USER_NOT_FOUND = "User not found",
    INVALID_PASSWORD = "Password must be at least 8 characters long",
}   