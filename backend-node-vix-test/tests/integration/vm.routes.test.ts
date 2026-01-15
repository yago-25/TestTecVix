import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app";
import "../hooks";
import { getAuthToken } from "../helpers/auth";

describe("VM routes", () => {
  it("GET /api/v1/vm (auth)", async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .get("/api/v1/vm")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("POST /api/v1/vm (auth)", async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post("/api/v1/vm")
      .set("Authorization", `Bearer ${token}`)
      .send({ vmName: "VM Test", status: true });

    expect([200, 201]).toContain(res.status);
  });
});
