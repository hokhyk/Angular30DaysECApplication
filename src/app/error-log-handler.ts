import { ErrorHandler } from './error-handler'
export class ErrorLogHandler implements ErrorHandler {
  handleError(error) {
    console.log(error);
    // 或是將 error 記錄到某個後端去
  }
}
