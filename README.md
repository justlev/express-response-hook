## 📝 express-response-hook 📝
This small middleware provides a hook into the HTTP response before ending it.
  Useful for logging, or doing extra things right before finishing the request.
  
The following properties are returned as context, in addition to a (hopefully) meaningful string line that summarises the request/response communication.
```js
 request: {
        originalUrl: string,
        method: string,
        body: any,
        headers: Headers,
        params: any
    },
    response: {
        statusCode: number,
        body: any,
        headers: Headers
    }
```

## Usage
The middleware is created by calling the `responseHook` function, with
your hook function as a callback argument.
```js
        const app = express();

        const myLogger = pino(); // Any logger you use :)
        const hook = (context, summaryLine) => myLogger.info(context, summaryLine);

        app.use(responseHook(hook));
```

That's it! Now your response will be logged before returning it to the consumer.
