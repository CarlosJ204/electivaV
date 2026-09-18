import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

const mockFind = jest.fn();

jest.unstable_mockModule("../modules/Movement.js", () => ({
    default: {
        find: mockFind
    }
}));

const { default: movementRouter } = await import("../routes/movements.js");


const app = express();

app.use(express.json());

app.use("/", movementRouter);


describe("GET /get-movements-desc/:userId", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return all the movements associated to the userId", async () => {

        // ARRANGE

        const userId = "6aac6985d675bf7022bb59b6";

        const movimientosMock = [
            {
                _id: "3",
                type: "gasto",
                userId: userId,
                amount: 30000,
                createdAt: 1789612598374
            },
            {
                _id: "2",
                type: "ingreso",
                userId: userId,
                amount: 50000,
                createdAt: 1789526198374
            }
        ];


        const sortMock = jest
            .fn()
            .mockResolvedValue(movimientosMock);


        mockFind.mockReturnValue({
            sort: sortMock
        });

        // ACT

        const response = await request(app)
            .get(`/get-movements-desc/${userId}`);

        // ASSERT

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual(
            movimientosMock
        );

        expect(mockFind).toHaveBeenCalledWith({
            userId: userId
        });

        expect(sortMock).toHaveBeenCalledWith({
            createdAt: -1
        });
    }
    );

});