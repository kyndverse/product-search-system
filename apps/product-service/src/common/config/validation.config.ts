import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

export const validationConfig: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors) => {
    const formattedErrors = {};

    errors.forEach((error) => {
      if (error.constraints) {
        formattedErrors[error.property] = Object.values(error.constraints).map(
          (msg) => msg.replace(error.property, '').trim(),
        );
      }
    });

    return new BadRequestException({
      errors: formattedErrors,
    });
  },
};
