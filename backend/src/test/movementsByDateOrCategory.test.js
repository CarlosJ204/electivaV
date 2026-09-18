import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";


// Mock de Movement.find()
const mockFind = jest.fn();


// Reemplazamos el modelo real de Movement
jest.unstable_mockModule("../modules/Movement.js", () => ({
    default: {
        find: mockFind
    }
}));


// Importamos el router DESPUÉS de crear el mock
const { default: movementRouter } =
    await import("../routes/movements.js");


const app = express();

app.use(express.json());

// Conectamos las rutas
app.use("/", movementRouter);


describe("GET /get-movements-date-category", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test(
        "should return movements filtered by date range and category",
        async () => {

            // =========================
            // ARRANGE
            // =========================

            const userId = "6aac6985d675bf7022bb59b6";
            const categoryId = "6aab4f81c02e5686bb726ee4";

            const minDate = "2026-09-01";
            const maxDate = "2026-09-30";

            const minTimestamp =
                new Date(minDate).getTime();

            const maxTimestamp =
                new Date(maxDate).getTime();


            const movimientosMock = [
                {
                    _id: "1",
                    type: "gasto",
                    amount: 30000,
                    userId: userId,
                    categoryId: categoryId,
                    date: 1789612084827
                },
                {
                    _id: "2",
                    type: "gasto",
                    amount: 25000,
                    userId: userId,
                    categoryId: categoryId,
                    date: 1789500000000
                }
            ];


            // Simulamos .sort()
            const sortMock = jest
                .fn()
                .mockResolvedValue(movimientosMock);


            // Simulamos:
            // Movement.find(...).sort(...)
            mockFind.mockReturnValue({
                sort: sortMock
            });


            // =========================
            // ACT
            // =========================

            const response = await request(app)
                .get("/get-movements-date-category")
                .send({
                    userId,
                    categoryId,
                    minDate,
                    maxDate
                });


            // =========================
            // ASSERT
            // =========================

            expect(response.statusCode).toBe(200);

            expect(response.body).toEqual(
                movimientosMock
            );


            // Verificamos el filtro enviado a MongoDB
            expect(mockFind).toHaveBeenCalledWith({
                userId: userId,

                date: {
                    $gte: minTimestamp,
                    $lte: maxTimestamp
                },

                categoryId: categoryId
            });


            // Verificamos el orden
            expect(sortMock).toHaveBeenCalledWith({
                date: -1
            });

        }
    );

});