import { HTTPClient } from "../client/client";
import { Signature } from "../signatures/signature";
import { TokenAcquireOption } from "../client/token";
import { CheckoutRequest, InquiryRequest } from "./types";
import type { AxiosResponse } from "axios";

type Option<T> = (obj: T) => void;

export class Config {
  public tokenOptions: TokenAcquireOption = new TokenAcquireOption();
  public baseURL: string = "https://b2b-playground.tokopedia.com/api";
  public signature: Signature | null = null;
  public isShouldVerifySignature: boolean = false;

  static tokenURL(url: string): (config: Config) => void {
    return (config: Config) => {
      config.tokenOptions.host = url;
    };
  }

  static baseURL(url: string): (config: Config) => void {
    return (config: Config) => {
      config.baseURL = url;
    };
  }

  static withSignature(signature: Signature): (config: Config) => void {
    return (config: Config) => {
      config.signature = signature;
    };
  }

  static enableVerifySignature(): (config: Config) => void {
    return (config: Config) => {
      config.isShouldVerifySignature = true;
    };
  }
}

export class APIClient {
  private httpClient: HTTPClient;
  private signature: Signature | null = null;
  private isShouldVerifySignature: boolean = false;

  constructor(
    clientID: string,
    clientSecret: string,
    ...options: Option<Config>[]
  ) {
    const cfg = new Config();
    cfg.tokenOptions.clientID = clientID;
    cfg.tokenOptions.clientSecret = clientSecret;

    options.forEach((option) => {
      option(cfg);
    });

    this.signature = cfg.signature;
    this.isShouldVerifySignature = cfg.isShouldVerifySignature;
    this.httpClient = new HTTPClient(cfg.baseURL, cfg.tokenOptions);
  }

  public async inquiry(req: InquiryRequest): Promise<AxiosResponse> {
    const data = {
      data: {
        type: "inquiry",
        attributes: req,
      },
    };

    const response = await this.httpClient.post("v2/inquiry", data);

    return response;
  }

  public async checkout(req: CheckoutRequest): Promise<AxiosResponse> {
    if (!this.signature) {
      throw new Error("Checkout Endpoint Need Signature");
    }

    const { request_id, ...attributes } = req;
    const data = {
      data: {
        type: "order",
        id: request_id,
        attributes: attributes,
      },
    };

    const msg = JSON.stringify(data).toString();

    const signature = this.signature.sign(msg);

    return this.httpClient.post("v2/order", data, signature);
  }

  public async check_status(request_id: string): Promise<AxiosResponse> {
    const response = await this.httpClient.get(`v2/order/${request_id}`, {
      responseType: "arraybuffer",
    });
    if (!this.isShouldVerifySignature || response.status != 200) {
      response.data = JSON.parse(response.data as string);
      return response;
    }

    const signature = response.headers["signature"];

    const isVerify = this.signature?.verify(
      response.data as ArrayBuffer,
      signature,
    );
    if (!isVerify) {
      throw Error("Signature isn't verified");
    }

    response.data = JSON.parse(response.data as string);
    return response;
  }

  public async account(): Promise<AxiosResponse> {
    const response = await this.httpClient.get("v2/account");

    return response;
  }

  public async ping(): Promise<AxiosResponse> {
    const response = await this.httpClient.get("ping");

    return response;
  }
}
