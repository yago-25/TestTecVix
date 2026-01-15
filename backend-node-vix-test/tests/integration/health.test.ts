import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app";

describe("integration - POST /api/v1/user/login", () => {
  it("should reject invalid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/user/login")
      .send({ username: "nao-existe", password: "errada" });

    expect([400, 401]).toContain(res.status);
  });
});
