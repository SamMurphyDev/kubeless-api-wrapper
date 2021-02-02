# Kubeless NodeJS Framework

This framework adds TypeScript to the Kubeless runner executor.
Provides a standardised way of writing your functions to the same
standard everytime.

## Installation

```shell
npm install kubeless-framework
```

## Notes

The Kubeless deployment does not break down functions by the HTTP Method. Only by endpoint. This leaves you to figure out the incoming function. This is managed by the event lifecycle built into this function.

If you are using the provided NodeJS runner from Kubeless the Options Method is managed for you by the runner. Unfortunately this doesn't give you control over CORS in preflight requests. It only returns WildCards. You will need to use a custom runtime to manage your own CORS.

The `Access-Control-Allow-Origin` header when using the Kubeless NodeJS runner is set to a wildcard (\*). The framework can override this for all methods other than OPTIONS.

## Example Code

```typescript
import { Handler, wrapHandler } from 'kubeless-framework';

const getHandler: Handler<unknown, string> = async (event) => ({
  statusCode: 200,
  body: { data: 'Hello World' },
});

export const handler = wrapHandler({ GET: { handler: getHandler } });
```

## Options

There are various options you can set on a per endpoint and per method basis.

### Endpoint

These are applied to the endpoint has a whole.

#### Cross-Origin Resource Sharing

Used to set the CORS settings for a endpoint.

**Required**: false

##### Fields

| Field   | Type         | Required |
| ------- | ------------ | -------- |
| origin  | string       | false    |
| headers | array string | false    |
| maxAge  | number       | false    |

##### Example

```typescript
{
  cors: {
    origin: 'https://foo.example',
    headers: ['Content-Type', 'Authorization'],
    maxAge: 86400
  }
}
```

### Method

These are applied to a particular method

#### Authentication

Used to set the authentication requirements for this method.

**Required**: false
**Type**: boolean

##### Example

```typescript
{
  auth: false;
}
```
