import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app";
import "../hooks";
import { getAuthToken } from "../helpers/auth";

describe("Users routes", () => {
  it("POST /api/v1/user - register", async () => {
    const res = await request(app).post("/api/v1/user").send({
      username: "john",
      email: "john@email.com",
      password: "123456",
      fullName: "John Doe",
      userPhoneNumber: "11999999999",
    });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);
  });

  it("POST /api/v1/user/login - login", async () => {
    await request(app).post("/api/v1/user").send({
      username: "john",
      email: "john@email.com",
      password: "123456",
    });

    const res = await request(app).post("/api/v1/user/login").send({
      username: "john",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
  });

  it("GET /api/v1/user - listAll (auth)", async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("PUT /api/v1/user/:idUser - updateUser (auth)", async () => {
    const token = await getAuthToken();

    const me = await request(app)
      .post("/api/v1/user/login")
      .send({ username: "testuser", password: "123456" });

    const idUser = me.body.user.idUser as number;

    const res = await request(app)
      .put(`/api/v1/user/${idUser}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ fullName: "Novo Nome", userPhoneNumber: "11988887777" });

    expect(res.status).toBe(200);
  });
});
