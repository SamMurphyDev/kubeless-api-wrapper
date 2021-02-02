/* eslint-disable no-unused-vars */
import { HttpEvent } from './kubeless';

type SuccessStatusCode = 200 | 201 | 202 | 203 | 204 | 205 | 206;
type ClientErrorStatusCode =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451;
type ServerErrorStatusCode =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;

export type StatusCode =
  | SuccessStatusCode
  | ClientErrorStatusCode
  | ServerErrorStatusCode;

export type HandlerResponseBase = {
  statusCode: StatusCode;
  body: unknown;
  headers?: Record<string, string | Array<string> | undefined>;
};

export type HandlerError = {
  message: string;
  field?: string;
};

type ArrayOneOrMore<T> = { 0: T } & Array<T>;

export type HandlerResponseError = HandlerResponseBase & {
  statusCode: ClientErrorStatusCode | ServerErrorStatusCode;
  body: {
    errors: ArrayOneOrMore<HandlerError>;
    data: never;
  };
};

export type HandlerResponseSuccessCursor<T> = HandlerResponseBase & {
  statusCode: Extract<SuccessStatusCode, 200 | 203 | 206>;
  body: {
    data: Array<T>;
    paging: {
      cursor: {
        after: string;
        before: string;
      };
      next: string | undefined;
      prev: string | undefined;
    };
  };
};

export type HandlerResponseSuccessNoBody = HandlerResponseBase & {
  statusCode: Extract<SuccessStatusCode, 204>;
};

export type HandlerResponseSuccessSingle<T> = HandlerResponseBase & {
  statusCode: Exclude<SuccessStatusCode, 204>;
  body: {
    data: T;
  };
};

export type HandlerResponse<T> =
  | HandlerResponseSuccessCursor<T>
  | HandlerResponseSuccessSingle<T>
  | HandlerResponseSuccessNoBody
  | HandlerResponseError;

export type Handler<T, R> = (
  event: HttpEvent<T, HandlerResponse<R>['body']>
) => Promise<HandlerResponse<R>>;

export type Method =
  | 'POST'
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type EndpointOptions = {
  cors?: { origin?: Array<string>; headers?: Array<string>; maxAge?: number };
};

export type HandlerOptions = {
  auth?: boolean;
};

export type WrappedHandler = <T, R>(
  handlers: {
    [K in Method]?: {
      handler: Handler<T, R>;
      options?: HandlerOptions;
    };
  },
  options?: EndpointOptions
) => (event: HttpEvent<T, HandlerResponse<R>['body']>) => Promise<void>;
