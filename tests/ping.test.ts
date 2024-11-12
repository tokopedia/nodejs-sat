import { BASE_PATH, newClient } from "./test_helper";
import nock from "nock";

afterEach(() => {
  console.log("Cleaning up nock");
  nock.cleanAll();
});

describe("ping", () => {
  it("ok", async () => {
    const api = newClient();
    nock(BASE_PATH).get("/ping").reply(
      200,
      {
        buildhash: "b05b97a",
        sandbox: true,
        status: "ok",
      },
      {
        "Content-Type": "application/json",
      },
    );

    const result = await api.ping();

    expect(result.status).toBe(200);
    expect(result.data).toStrictEqual({
      buildhash: "b05b97a",
      sandbox: true,
      status: "ok",
    });
    expect(result.headers["content-type"]).toBe("application/json");
  });
});
