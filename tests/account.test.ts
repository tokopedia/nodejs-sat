/*
Test account endpoint

This example shows how to use the account endpoint to get the account balance from the SAT server.

For more information, please refer to "Account Balance" section in the SAT documentation.
*/

import { BASE_PATH, newClient } from "./test_helper";
import nock from "nock";

afterEach(() => {
  nock.cleanAll();
});

describe("account", () => {
  it("account success", async () => {
    const api = newClient();

    // Mock the GET request to the account endpoint
    nock(BASE_PATH)
      .get("/v2/account")
      .matchHeader("authorization", "Bearer testingToken")
      .once()
      .reply(
        200,
        {
          data: {
            type: "account",
            id: "2203",
            attributes: {
              saldo: 50000000,
            },
          },
        },
        {
          "Content-Type": "application/json",
        },
      );

    // Call the account method on the API client
    const response = await api.account();

    // Assert that the response is successful
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual({
      data: {
        type: "account",
        id: "2203",
        attributes: {
          saldo: 50000000,
        },
      },
    });

    // Additional assertions
    expect(response.data.data.id).toBe("2203");
    expect(response.data.data.attributes.saldo).toBe(50000000);
  });
});
