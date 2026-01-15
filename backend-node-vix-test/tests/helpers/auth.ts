import request from "supertest";
import { app } from "../../src/app";

export async function getAuthToken() {
  await request(app).post("/api/v1/user").send({
    username: "testuser",
    email: "testuser@email.com",
    password: "123456",
    fullName: "Test User",
    userPhoneNumber: "11999999999",
  });

  const login = await request(app)
    .post("/api/v1/user/login")
    .send({ username: "testuser", password: "123456" });

  return login.body.token as string;
}
