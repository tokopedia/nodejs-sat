/*
This module contains the tests for the check_status method in the SATClient class.

This example shows how to use the check_status method to check the status of a transaction from the SAT server.

For more information, please refer to "Check Status" section in the SAT documentation.
*/

import { BASE_PATH, generateRandomString, newClient } from "./test_helper";
import nock from "nock";

afterEach(() => {
  nock.cleanAll();
});

describe("check_status", () => {
  it("check status success", async () => {
    const api = newClient();
    const randomString = "NODESAT" + generateRandomString(8);
    const randomClientId = generateRandomString(12);

    // First request - checkout
    nock(BASE_PATH)
      .post("/v2/order", {
        data: {
          type: "order",
          id: randomString,
          attributes: {
            product_code: "speedy-indihome",
            client_number: randomClientId,
            amount: 3500,
          },
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
              client_number: randomClientId,
              error_code: "",
              error_detail: "",
              fields: null,
              fulfilled_at: null,
              partner_fee: 2000,
              product_code: "speedy-indihome",
              sales_price: 3500,
              serial_number: "",
              status: "Pending",
            },
          },
        },
        { "Content-Type": "application/json" },
      );

    const response1 = await api.checkout({
      request_id: randomString,
      product_code: "speedy-indihome",
      client_number: randomClientId,
      amount: 3500,
    });

    expect(response1.status).toBe(200);
    expect(response1.data).toMatchObject({
      data: {
        type: "order",
        id: randomString,
        attributes: {
          client_number: randomClientId,
          partner_fee: 2000,
          product_code: "speedy-indihome",
          sales_price: 3500,
          status: "Pending",
        },
      },
    });

    // Check status
    nock(BASE_PATH)
      .get(`/v2/order/${randomString}`)
      .once()
      .reply(
        200,
        {
          data: {
            type: "order",
            id: randomString,
            attributes: {
              client_number: randomClientId,
              fulfilled_at: new Date().toISOString(),
              partner_fee: 2000,
              product_code: "speedy-indihome",
              sales_price: 3500,
              serial_number: "174298636",
              status: "Success",
              fulfillment_result: [
                { name: "Nomor Referensi", value: "174298636" },
                { name: "Nama Pelanggan", value: "Tokopedia User Default" },
                { name: "Nomor Pelanggan", value: "611981111" },
                { name: "Jumlah Tagihan", value: "1" },
                { name: "Periode Bayar", value: "Maret 2022" },
                { name: "Total Tagihan", value: "Rp 1.000" },
                { name: "Biaya Admin", value: "Rp 2.500" },
                { name: "Total Bayar", value: "Rp 3.500" },
              ],
            },
          },
        },
        { "Content-Type": "application/json" },
      );

    let response2;
    for (let attempt = 1; attempt <= 3; attempt++) {
      response2 = await api.check_status(randomString);
      if (response2.data.data.attributes.status !== "Pending") {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!response2) {
      fail("Expected a response but got nothing");
    }

    expect(response2.status).toBe(200);
    expect(response2.data.data.attributes.product_code).toBe("speedy-indihome");
    expect(response2.data.data.attributes.client_number).toBe(randomClientId);
    expect(response2.data.data.attributes.status).toBe("Success");
  });

  it("check status failed", async () => {
    const api = newClient();
    const randomString = "NODESAT" + generateRandomString(8);

    // First request - checkout
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
        { "Content-Type": "application/json" },
      );

    const response1 = await api.checkout({
      request_id: randomString,
      product_code: "pln-postpaid",
      client_number: "2121212",
      amount: 12500,
      fields: [{ name: "optional", value: "optional" }],
    });

    expect(response1.status).toBe(200);

    // Check status - failed
    nock(BASE_PATH)
      .get(`/v2/order/${randomString}`)
      .once()
      .reply(
        200,
        {
          data: {
            type: "order",
            id: randomString,
            attributes: {
              client_number: "2121212",
              error_code: "S02",
              error_detail: "Product is not available",
              fields: [{ name: "optional", value: "optional" }],
              partner_fee: 1000,
              product_code: "pln-postpaid",
              sales_price: 12500,
              serial_number: "",
              status: "Failed",
            },
          },
        },
        { "Content-Type": "application/json" },
      );

    let response2;
    for (let attempt = 1; attempt <= 3; attempt++) {
      response2 = await api.check_status(randomString);
      if (response2.data.data.attributes.status !== "Pending") {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!response2) {
      fail("Expected a response but got nothing");
    }

    expect(response2.status).toBe(200);
    expect(response2.data.data.attributes.status).toBe("Failed");
    expect(response2.data.data.attributes.error_code).toBe("S02");
    expect(response2.data.data.attributes.error_detail).toBe(
      "Product is not available",
    );
  });

  it("check status not found", async () => {
    const api = newClient();
    const randomString = "NODESAT" + generateRandomString(8);

    nock(BASE_PATH)
      .get(`/v2/order/${randomString}`)
      .once()
      .reply(
        400,
        {
          errors: [
            {
              code: "P02",
              detail: "Transaction is not found",
              status: "400",
            },
          ],
        },
        { "Content-Type": "application/json" },
      );

    const response = await api.check_status(randomString);
    expect(response.status).toBe(400);
    expect(response.data).toMatchObject({
      errors: [
        { code: "P02", detail: "Transaction is not found", status: "400" },
      ],
    });
  });
});
