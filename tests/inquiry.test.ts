/*
Test Inquiry API

This example shows how to use the inquiry endpoint to get the inquiry result from the SAT server.

For more information, please refer to "Inquiry" section in the SAT documentation.
*/

import { BASE_PATH, newClient } from "./test_helper";
import nock from "nock";

afterEach(() => {
  nock.cleanAll();
});

describe("inquiry", () => {
  it("ok", async () => {
    const api = newClient();
    nock(BASE_PATH)
      .post("/v2/inquiry", {
        data: {
          type: "inquiry",
          attributes: {
            product_code: "pln-postpaid",
            client_number: "2121212",
            fields: [{ name: "optional", value: "optional" }],
          },
        },
      })
      .once()
      .reply(
        200,
        {
          data: {
            type: "inquiry",
            id: "2121212",
            attributes: {
              admin_fee: 2500,
              base_price: 25000,
              client_name: "TOKOPXXXX UXX",
              client_number: "2121212",
              fields: [{ name: "optional", value: "optional" }],
              inquiry_result: [
                { name: "ID Pelanggan", value: "2121212" },
                { name: "Nama", value: "TOKOPXXXX UXX" },
                { name: "Total Bayar", value: "Rp 27.500" },
                { name: "IDPEL", value: "2121212" },
                { name: "NAMA", value: "Tokopedia User Default" },
                { name: "TOTAL TAGIHAN", value: "1 BULAN" },
                { name: "BL/TH", value: "MAR20" },
                { name: "RP TAG PLN", value: "Rp 25.000" },
                { name: "ADMIN BANK", value: "Rp 2.500" },
                { name: "TOTAL BAYAR", value: "Rp 27.500" },
              ],
              meter_id: "2121212",
              product_code: "pln-postpaid",
              sales_price: 27500,
            },
          },
        },
        {
          "Content-Type": "application/json",
        },
      );

    const result = await api.inquiry({
      product_code: "pln-postpaid",
      client_number: "2121212",
      fields: [{ name: "optional", value: "optional" }],
    });

    expect(result.status).toBe(200);
    expect(result.data).toStrictEqual({
      data: {
        type: "inquiry",
        id: "2121212",
        attributes: {
          admin_fee: 2500,
          base_price: 25000,
          client_name: "TOKOPXXXX UXX",
          client_number: "2121212",
          fields: [{ name: "optional", value: "optional" }],
          inquiry_result: [
            { name: "ID Pelanggan", value: "2121212" },
            { name: "Nama", value: "TOKOPXXXX UXX" },
            { name: "Total Bayar", value: "Rp 27.500" },
            { name: "IDPEL", value: "2121212" },
            { name: "NAMA", value: "Tokopedia User Default" },
            { name: "TOTAL TAGIHAN", value: "1 BULAN" },
            { name: "BL/TH", value: "MAR20" },
            { name: "RP TAG PLN", value: "Rp 25.000" },
            { name: "ADMIN BANK", value: "Rp 2.500" },
            { name: "TOTAL BAYAR", value: "Rp 27.500" },
          ],
          meter_id: "2121212",
          product_code: "pln-postpaid",
          sales_price: 27500,
        },
      },
    });
    expect(result.headers["content-type"]).toBe("application/json");
  });

  it("product not found", async () => {
    const api = newClient();
    nock(BASE_PATH)
      .post("/v2/inquiry", {
        data: {
          type: "inquiry",
          attributes: {
            product_code: "not-found-product",
            client_number: "2121212",
          },
        },
      })
      .once()
      .reply(
        400,
        {
          errors: [{ detail: "Product not found", status: "400", code: "P04" }],
        },
        {
          "Content-Type": "application/json",
        },
      );

    const response = await api.inquiry({
      product_code: "not-found-product",
      client_number: "2121212",
    });
    expect(response.status).toBe(400);
    expect(response.data).toStrictEqual({
      errors: [{ detail: "Product not found", status: "400", code: "P04" }],
    });
    expect(response.headers["content-type"]).toBe("application/json");
  });

  it("internal server error", async () => {
    const api = newClient();
    nock(BASE_PATH)
      .post("/v2/inquiry", {
        data: {
          type: "inquiry",
          attributes: {
            product_code: "speedy-indihome",
            client_number: "102111496000",
          },
        },
      })
      .once()
      .reply(
        500,
        {
          errors: [
            { code: "S00", detail: "Internal Server Error", status: "500" },
          ],
        },
        {
          "Content-Type": "application/json",
        },
      );

    const response = await api.inquiry({
      product_code: "speedy-indihome",
      client_number: "102111496000",
    });

    expect(response.status).toBe(500);
    expect(response.data).toStrictEqual({
      errors: [{ code: "S00", detail: "Internal Server Error", status: "500" }],
    });
    expect(response.headers["content-type"]).toBe("application/json");
  });

  it("success with downline_id", async () => {
    const api = newClient();
    nock(BASE_PATH)
      .post("/v2/inquiry", {
        data: {
          type: "inquiry",
          attributes: {
            product_code: "pln-postpaid",
            client_number: "111111111111",
            fields: [{ name: "optional", value: "optional" }],
            downline_id: "client-123",
          },
        },
      })
      .once()
      .reply(
        200,
        {
          data: {
            type: "inquiry",
            id: "2121212",
            attributes: {
              admin_fee: 2500,
              base_price: 25000,
              client_name: "TOKOPXXXX UXX",
              client_number: "2121212",
              fields: [{ name: "optional", value: "optional" }],
              inquiry_result: [
                { name: "ID Pelanggan", value: "2121212" },
                { name: "Nama", value: "TOKOPXXXX UXX" },
                { name: "Total Bayar", value: "Rp 27.500" },
                { name: "IDPEL", value: "2121212" },
                { name: "NAMA", value: "Tokopedia User Default" },
                { name: "TOTAL TAGIHAN", value: "1 BULAN" },
                { name: "BL/TH", value: "MAR20" },
                { name: "RP TAG PLN", value: "Rp 25.000" },
                { name: "ADMIN BANK", value: "Rp 2.500" },
                { name: "TOTAL BAYAR", value: "Rp 27.500" },
              ],
              meter_id: "2121212",
              product_code: "pln-postpaid",
              sales_price: 27500,
            },
          },
        },
        {
          "Content-Type": "application/json",
        },
      );

    const result = await api.inquiry({
      product_code: "pln-postpaid",
      client_number: "111111111111",
      fields: [{ name: "optional", value: "optional" }],
      downline_id: "client-123",
    });

    expect(result.status).toBe(200);
    expect(result.data).toStrictEqual({
      data: {
        type: "inquiry",
        id: "2121212",
        attributes: {
          admin_fee: 2500,
          base_price: 25000,
          client_name: "TOKOPXXXX UXX",
          client_number: "2121212",
          fields: [{ name: "optional", value: "optional" }],
          inquiry_result: [
            { name: "ID Pelanggan", value: "2121212" },
            { name: "Nama", value: "TOKOPXXXX UXX" },
            { name: "Total Bayar", value: "Rp 27.500" },
            { name: "IDPEL", value: "2121212" },
            { name: "NAMA", value: "Tokopedia User Default" },
            { name: "TOTAL TAGIHAN", value: "1 BULAN" },
            { name: "BL/TH", value: "MAR20" },
            { name: "RP TAG PLN", value: "Rp 25.000" },
            { name: "ADMIN BANK", value: "Rp 2.500" },
            { name: "TOTAL BAYAR", value: "Rp 27.500" },
          ],
          meter_id: "2121212",
          product_code: "pln-postpaid",
          sales_price: 27500,
        },
      },
    });
    expect(result.headers["content-type"]).toBe("application/json");
  });
});
