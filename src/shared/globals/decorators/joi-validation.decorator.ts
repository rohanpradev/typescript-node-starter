import { Request, Response, NextFunction } from 'express';
import { ObjectSchema, ValidationError } from 'joi';
import { JoiRequestValidationError } from '@global/helpers/error-handler';

type validateWithJoiDecoratorType<T> = (target: T, key: string, descriptor: PropertyDescriptor) => void;

export function validateWithJoiDecorator<T>(schema: ObjectSchema): validateWithJoiDecoratorType<T> {
  return (_target: T, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: [Request, Response, NextFunction]) {
      try {
        const [req] = args;
        const validatedValue = await schema.validateAsync(req.body);
        req.body = validatedValue;
        return originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof ValidationError) throw new JoiRequestValidationError(error);
        throw error;
      }
    };
    return descriptor;
  };
}
