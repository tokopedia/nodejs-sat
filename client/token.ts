import { ClientCredentials, AccessToken, ModuleOptions } from "simple-oauth2";

export class TokenAcquireOption {
  public host: string = "https://accounts.tokopedia.com";
  public clientID: string = "";
  public clientSecret: string = "";
}

class TokenAcquire {
  private clientID: string;
  private clientSecret: string;
  private host: string;

  private accessToken: AccessToken | null = null;

  constructor(params: TokenAcquireOption) {
    this.host = params.host;
    this.clientID = params.clientID;
    this.clientSecret = params.clientSecret;
  }

  private async acquireToken(): Promise<AccessToken> {
    const config: ModuleOptions = {
      client: {
        id: this.clientID,
        secret: this.clientSecret,
      },
      auth: {
        tokenHost: this.host,
        tokenPath: "/token",
      },
    };
    const client = new ClientCredentials(config);

    try {
      const accessToken = await client.getToken({});
      this.accessToken = accessToken;
      return this.accessToken;
    } catch (error) {
      console.error("Access token error", error);
      throw new Error("Unable to acquire access token");
    }
  }

  public async getAccessToken(): Promise<string> {
    if (!this.accessToken || this.accessToken.expired()) {
      this.accessToken = await this.acquireToken();
    }

    return this.accessToken.token["access_token"] as string;
  }
}

export default TokenAcquire;
