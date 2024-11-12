/*
Test checkout endpoint

This example shows how to use the checkout endpoint to create an order in the SAT server.

For more information, please refer to "Checkout" section in the SAT documentation.
*/

import { BASE_PATH, generateRandomString, newClient } from "./test_helper";
import nock from "nock";

afterEach(() => {
  nock.cleanAll();
});

describe("checkout", () => {
  it("success", async () => {
    const api = newClient();
    const randomString = "NODESAT" + generateRandomString(8);

    nock(BASE_PATH)
      .post("/v2/order", {
        data: {
          attributes: {
            amount: 12500,
            client_number: "2121212",
            fields: [{ name: "optional", value: "optional" }],
            product_code: "pln-postpaid",
          },
          id: randomString,
          type: "order",
        },
      })
      .once()
      .reply(
        200,
        {
          data: {
            type: "order",
            id: randomString,
            attributes: {
              client_number: "2121212",
              error_code: "",
              error_detail: "",
              fields: [{ name: "optional", value: "optional" }],
              fulfilled_at: null,
              partner_fee: 1000,
              product_code: "pln-postpaid",
              sales_price: 12500,
              serial_number: "",
              status: "Pending",
            },
          },
        },
        {
          "Content-Type": "application/json",
        },
      );

    const result = await api.checkout({
      request_id: randomString,
      product_code: "pln-postpaid",
      client_number: "2121212",
      amount: 12500,
      fields: [{ name: "optional", value: "optional" }],
    });

    expect(result.status).toBe(200);
    expect(result.data).toStrictEqual({
      data: {
        type: "order",
        id: randomString,
        attributes: {
          client_number: "2121212",
          error_code: "",
          error_detail: "",
          fields: [{ name: "optional", value: "optional" }],
          fulfilled_at: null,
          partner_fee: 1000,
          product_code: "pln-postpaid",
          sales_price: 12500,
          serial_number: "",
          status: "Pending",
        },
      },
    });
    expect(result.headers["content-type"]).toBe("application/json");
  });

  it("product not found", async () => {
    const api = newClient();
    const randomString = "NODESAT" + generateRandomString(8);

    nock(BASE_PATH)
      .post("/v2/order", {
        data: {
          id: randomString,
          type: "order",
          attributes: {
            product_code: "non-exist-product",
            client_number: "102111496000",
            amount: 12500,
            fields: [{ name: "optional", value: "optional" }],
          },
        },
      })
      .once()
      .reply(
        400,
        {
          errors: [{ code: "P04", detail: "Product not found", status: "400" }],
        },
        {
          "Content-Type": "application/json",
        },
      );

    const response = await api.checkout({
      request_id: randomString,
      product_code: "non-exist-product",
      client_number: "102111496000",
      amount: 12500,
      fields: [{ name: "optional", value: "optional" }],
    });
    expect(response.status).toBe(400);
    expect(response.data).toStrictEqual({
      errors: [{ code: "P04", detail: "Product not found", status: "400" }],
    });
    expect(response.headers["content-type"]).toBe("application/json");
  });

  it("duplicate request id", async () => {
    const api = newClient();
    const randomString = "NODESAT" + generateRandomString(8);

    // First request - success
    nock(BASE_PATH)
      .post("/v2/order", {
        data: {
          attributes: {
            amount: 12500,
            client_number: "2121212",
            fields: [{ name: "optional", value: "optional" }],
            product_code: "pln-postpaid",
          },
          id: randomString,
          type: "order",
        },
      })
      .once()
      .reply(
        200,
        {
          data: {
            type: "order",
            id: randomString,
            attributes: {
              client_number: "2121212",
              error_code: "",
              error_detail: "",
              fields: [{ name: "optional", value: "optional" }],
              fulfilled_at: null,
              partner_fee: 1000,
              product_code: "pln-postpaid",
              sales_price: 12500,
              serial_number: "",
              status: "Pending",
            },
          },
        },
        {
          "Content-Type": "application/json",
        },
      );

    // Second request - duplicate ID error
    nock(BASE_PATH)
      .post("/v2/order", {
        data: {
          attributes: {
            amount: 12500,
            client_number: "2121212",
            fields: [{ name: "optional", value: "optional" }],
            product_code: "pln-postpaid",
          },
          id: randomString,
          type: "order",
        },
      })
      .once()
      .reply(
        400,
        {
          errors: [
            {
              code: "P03",
              detail: "Duplicate Request ID, please check your system",
              status: "400",
            },
          ],
        },
        {
          "Content-Type": "application/json",
        },
      );

    // First checkout attempt - should succeed
    const response1 = await api.checkout({
      request_id: randomString,
      product_code: "pln-postpaid",
      client_number: "2121212",
      amount: 12500,
      fields: [{ name: "optional", value: "optional" }],
    });

    expect(response1.status).toBe(200);
    expect(response1.data).toStrictEqual({
      data: {
        type: "order",
        id: randomString,
        attributes: {
          client_number: "2121212",
          error_code: "",
          error_detail: "",
          fields: [{ name: "optional", value: "optional" }],
          fulfilled_at: null,
          partner_fee: 1000,
          product_code: "pln-postpaid",
          sales_price: 12500,
          serial_number: "",
          status: "Pending",
        },
      },
    });

    const response = await api.checkout({
      request_id: randomString,
      product_code: "pln-postpaid",
      client_number: "2121212",
      amount: 12500,
      fields: [{ name: "optional", value: "optional" }],
    });
    expect(response.status).toBe(400);
    expect(response.data).toStrictEqual({
      errors: [
        {
          code: "P03",
          detail: "Duplicate Request ID, please check your system",
          status: "400",
        },
      ],
    });
    expect(response.headers["content-type"]).toBe("application/json");
  });
});
