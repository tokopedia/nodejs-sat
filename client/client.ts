import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import TokenAcquire, { TokenAcquireOption } from "./token";

export class HTTPClient {
  private axiosInstance: AxiosInstance;
  private token: TokenAcquire;
  private sdk_version: string = "node-sat@1.0.0";

  constructor(baseURL: string, tokenParams: TokenAcquireOption) {
    this.token = new TokenAcquire(tokenParams);

    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });

    this.initTokenInterceptors();
    this.initCustomHeaderInterceptors();
    this.axiosValidateStatus();
  }

  private initTokenInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig,
      ): Promise<InternalAxiosRequestConfig> => {
        const token = await this.token.getAccessToken();

        config.headers.Authorization = `Bearer ${token}`;

        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      },
    );
  }

  private initCustomHeaderInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig,
      ): Promise<InternalAxiosRequestConfig> => {
        const now = new Date();
        config.headers.setContentType("application/json");
        config.headers.set("Date", now.toUTCString());
        config.headers.set("X-Sat-Sdk-Version", this.sdk_version);

        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      },
    );
  }

  private axiosValidateStatus() {
    this.axiosInstance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig,
      ): Promise<InternalAxiosRequestConfig> => {
        config.validateStatus = (status: number) => {
          return (
            status === 200 || status === 400 || status === 401 || status === 500
          );
        };

        return config;
      },
    );
  }

  public async get<T>(
    url: string,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    ...config: AxiosRequestConfig<any>[]
  ): Promise<AxiosResponse<T>> {
    const response = this.axiosInstance.get<T>(url, ...config);

    return response;
  }

  public async post<T>(
    url: string,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    data: any,
    signature?: string,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, {
      headers: {
        Signature: signature,
      },
    });
  }
}
