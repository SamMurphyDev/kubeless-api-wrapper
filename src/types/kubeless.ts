// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

export type HttpEvent<T, R> = {
  'event-type': unknown;
  'event-id': string;
  'event-time': string;
  'event-namespace': string;
  data: T;
  extensions: {
    request: Request;
    response: Response<R>;
  };
};

export type Context = {
  'function-name': string;
  timeout: string;
  runtime: string;
  'memory-limit': string;
};
