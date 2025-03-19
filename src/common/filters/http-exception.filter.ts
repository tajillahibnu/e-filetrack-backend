import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    // 🔹 Cek jika error adalah UnauthorizedException (belum login)
    if (exception instanceof UnauthorizedException) {
      message = 'Anda belum login. Silakan login terlebih dahulu.';
    } else if (exception instanceof HttpException) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      status: 'error',
      success: false,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
