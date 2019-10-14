import express = require("express");
import supertest = require("supertest");

import {responseHook} from "../../src";

describe("integration with ExpressJs", () => {
    test("it integrates as the middleware", async () => {
        const logger = jest.fn((context, line) => console.log(context, line));
        const app = express();
        app.use(responseHook(logger));

        app.get('/', async (req, res) => await res.status(204).json({test: 123}));

        const request = supertest(app);

        const res = await request.get('/');

        expect(logger.mock.calls.length).toEqual(1);
        expect(res.status).toEqual(204);
    });
});
