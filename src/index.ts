export function responseHook(hookCallback: CallbackFunc) {
    return (req: any, res: any, next: any) => {
        const originalEnd = res.end;
        res.end = (args) => {
            res.end = originalEnd;
            const {originalUrl, method, body: requestBody, headers: requestHeaders, params} = req;
            const {statusCode, headers} = res;
            hookCallback(
                {
                    request: {
                        originalUrl,
                        method,
                        body: requestBody,
                        headers: requestHeaders,
                        params: params
                    },
                    response: {
                        body: res.body,
                        statusCode,
                        headers: headers
                    },
                },
                `req: [${req.method} ${req.originalUrl}] res: [${statusCode}]`
            );
            return originalEnd.apply(this, args);
        };
        next && next();
    }
}

export type Headers = {[key: string]: string};

export type Context = {
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
};

export type CallbackFunc = (context: Context, logLine: string) => void;
