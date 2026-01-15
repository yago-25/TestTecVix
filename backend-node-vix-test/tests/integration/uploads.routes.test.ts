import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app";
import "../hooks";

describe("Uploads routes", () => {
  it("GET /api/v1/uploads/:objectName - not found", async () => {
    const res = await request(app).get("/api/v1/uploads/naoexiste.png");
    expect([404, 400]).toContain(res.status);
  });
});
