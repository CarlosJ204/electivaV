import test from "node:test";
import assert from "node:assert/strict";
import { validateMovement } from "../src/lib/validateMovement.js";

const valid = { type: "gasto", amount: 25000, date: Date.now(), categoryId: "comida", userId: "usuario" };

test("acepta un movimiento con descripción opcional", () => {
    assert.equal(validateMovement(valid), null);
    assert.equal(validateMovement({ ...valid, description: "Almuerzo" }), null);
});

test("rechaza campos obligatorios incompletos", () => {
    for (const field of ["type", "amount", "date", "categoryId", "userId"]) {
        assert.ok(validateMovement({ ...valid, [field]: undefined }), field);
    }
});

test("rechaza valores incorrectos", () => {
    for (const changes of [
        { type: "otro" }, { amount: 0 }, { amount: -1 }, { amount: "100" },
        { date: "2026-11-27" }, { date: Number.NaN }, { categoryId: "  " },
    ]) {
        assert.ok(validateMovement({ ...valid, ...changes }), JSON.stringify(changes));
    }
});
