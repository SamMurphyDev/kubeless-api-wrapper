import { isNil } from './common';
import { Method, WrappedHandler } from '../types/handlers';

export const wrapHandler: WrappedHandler = (handlers, options) => async (
  event
) => {
  const {
    extensions: { response, request },
  } = event;
  const method = request.method.toUpperCase() as Method;
  const { origin } = request.headers;

  const allowMethods = Object.entries(handlers)
    .filter(([, value]) => !isNil(value))
    .map(([key]) => key)
    .join(',');

  if (
    origin !== undefined &&
    options?.cors !== undefined &&
    options.cors.origin !== undefined &&
    options.cors.origin.includes(origin)
  ) {
    response.header('Access-Control-Allow-Origin', origin);
    response.header('Very', 'Origin');
  }

  const funcHandler = handlers[method]?.handler;

  if (funcHandler === undefined) {
    if (method === 'OPTIONS') {
      if (options?.cors?.headers) {
        response.header(
          'Access-Control-Allow-Headers',
          options.cors.headers.join(',')
        );
      }

      response
        .status(204)
        .header('Access-Control-Allow-Methods', allowMethods)
        .send();
    } else {
      response
        .status(405)
        .header('Allow', allowMethods)
        .json({
          errors: [
            {
              message: `Method '${method}' not allowed. See Allow header for supported functions on this endpoint`,
            },
          ],
        });
    }

    return;
  }

  if (handlers[method]?.options?.auth) {
    response.header('Access-Control-Allow-Credentials', 'true');
  }

  const { body, headers, statusCode } = await funcHandler(event);

  if (headers !== undefined) {
    Object.entries(headers).reduce(
      (acc, header) => acc.header(...header),
      response
    );
  }
  response.status(statusCode).json(body);
};
