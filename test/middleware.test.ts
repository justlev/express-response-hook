import {responseHook} from "../src";

describe('logger middleware', () => {
    const logger = jest.fn();
    const nextFn = jest.fn();
    let middleware = responseHook(logger);

    beforeEach(() => {
        nextFn.mockClear();
    });

    test('the middleware calls the next function', () => {
        middleware({}, {end: jest.fn()}, nextFn);

        expect(nextFn.mock.calls.length).toEqual(1);
    });

    describe('#res.end', () => {
        const originalEndFn = jest.fn();
        const request = {
            body: {password: 'PLAIN_PASSWORD_STR', zim: 'zam', zoom: {nestedField: 123}},
            method: 'POST',
            params: {secret: 123, lang: 'en-GB'},
            headers: {authorization: 'Bearer 123456'},
            originalUrl: 'https://origin.localhost.com'
        };

        const resBody = {someBody: '1234'};
        const response = {
            end: originalEndFn,
            body: JSON.stringify(resBody),
            headers: {},
            statusCode: 200
        };

        beforeEach(() => {
            logger.mockClear();
            originalEndFn.mockClear();
            middleware(request, response, nextFn);
        });

        test('it logs the request', () => {
            response.end();

            const loggerArgs = logger.mock.calls[0];
            expect(loggerArgs[0].request).toEqual({...request});
        });

        test('it logs the response', () => {
            response.end();

            const loggerArgs = logger.mock.calls[0];
            expect(loggerArgs[0].response).toEqual({body: JSON.stringify(resBody), headers: {}, statusCode: response.statusCode});
        });

        test('it logs an informative line', () => {
            response.end();

            const loggerArgs = logger.mock.calls[0];
            expect(loggerArgs[1]).toEqual(`req: [POST ${request.originalUrl}] res: [${response.statusCode}]`);
        });

        test('it calls the logger only once', () => {
            logger.mockClear();
            response.end();

            const fnCalls = logger.mock.calls;
            expect(fnCalls.length).toEqual(1);
        });
    });
});
