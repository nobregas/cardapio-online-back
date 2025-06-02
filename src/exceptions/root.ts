export default class HttpException extends Error {
    message: string ;
    errorCode: number;
    statusCode: number;
    errors?: object;
    
    constructor(message: string, errorCode: number, statusCode: number, errors?: object) {
        super(message);

        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
