import request from "supertest";
import mongoose from "mongoose";
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import app from "../src/app.js";

let createdCategoryIds = [];
let createdMovementIds = [];

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    const db = mongoose.connection.db;
    if (db) {
        if (createdCategoryIds.length) {
            await db.collection("categories").deleteMany({
                _id: { $in: createdCategoryIds.map((id) => new mongoose.Types.ObjectId(id)) },
            });
        }
        if (createdMovementIds.length) {
            await db.collection("movements").deleteMany({
                _id: { $in: createdMovementIds.map((id) => new mongoose.Types.ObjectId(id)) },
            });
        }
    }
    await mongoose.disconnect();
});

describe("POST /api/category - crear una categoria", () => {

    it("deberia crear una categoria y responder 201", async () => {
        const res = await request(app)
            .post("/api/category")
            .send({
                name: "Compras test",
                description: "Categoria creada por jest",
                userId: "test-user-jest",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Category created successfully");
        expect(res.body.category.name).toBe("Compras test");
        expect(res.body.category.description).toBe("Categoria creada por jest");
        expect(res.body.category.userId).toBe("test-user-jest");

        createdCategoryIds.push(res.body.category._id);
    });

    it("deberia responder 400 cuando falta el nombre", async () => {
        const res = await request(app)
            .post("/api/category")
            .send({
                userId: "test-user-jest",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Name is required");
    });
});

describe("POST /api/movement - crear un movimiento", () => {

    it("deberia crear un movimiento y responder 201", async () => {
        const res = await request(app)
            .post("/api/movement")
            .send({
                type: "gasto",
                amount: 25000,
                date: Date.now(),
                categoryId: "prueba-categoria-id",
                description: "Movimiento creado por jest",
                userId: "test-user-jest",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Movement created successfully");
        expect(res.body.movement.type).toBe("gasto");
        expect(res.body.movement.amount).toBe(25000);
        expect(res.body.movement.categoryId).toBe("prueba-categoria-id");
        expect(res.body.movement.userId).toBe("test-user-jest");

        createdMovementIds.push(res.body.movement._id);
    });

    it("deberia responder 400 cuando falta el tipo", async () => {
        const res = await request(app)
            .post("/api/movement")
            .send({
                amount: 25000,
                categoryId: "prueba-categoria-id",
                userId: "test-user-jest",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Type is required");
    });

    it("deberia responder 400 cuando falta el categoryId", async () => {
        const res = await request(app)
            .post("/api/movement")
            .send({
                type: "ingreso",
                amount: 50000,
                userId: "test-user-jest",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("CategoryId is required");
    });
});