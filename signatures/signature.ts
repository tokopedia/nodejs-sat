import { readFileSync } from "fs";
import { createSign, createVerify, constants } from "crypto";

type Option<T> = (obj: T) => void;

export class SignatureConfig {
  public privKey: string = "";
  public pubKey: string = "";

  static withPrivateKeyFromString(
    key: string,
  ): (config: SignatureConfig) => void {
    return (config: SignatureConfig) => {
      config.privKey = key;
    };
  }

  static withPublicKeyFromString(
    key: string,
  ): (config: SignatureConfig) => void {
    return (config: SignatureConfig) => {
      config.pubKey = key;
    };
  }

  static withPrivateKeyFromFile(
    path: string,
  ): (config: SignatureConfig) => void {
    return (config: SignatureConfig) => {
      config.privKey = readFileSync(path, "utf8");
    };
  }

  static withPublicKeyFromFile(
    path: string,
  ): (config: SignatureConfig) => void {
    return (config: SignatureConfig) => {
      config.pubKey = readFileSync(path, "utf-8");
    };
  }
}

export class Signature {
  private privKey: string = "";
  private pubKey: string = "";

  constructor(...options: Option<SignatureConfig>[]) {
    const config = new SignatureConfig();

    options.forEach((option) => {
      option(config);
    });

    this.privKey = config.privKey;
    this.pubKey = config.pubKey;
  }

  public sign(message: string): string {
    if (this.privKey === "") {
      throw new Error("Private Key is Missing");
    }

    const sign = createSign("SHA256");
    sign.update(message);
    sign.end();

    const signature = sign.sign(
      {
        key: this.privKey,
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
      },
      "base64",
    );

    return signature;
  }

  public verify(message: ArrayBuffer, signature: string): boolean {
    if (this.pubKey === "") {
      throw new Error("Public Key is Missing");
    }

    const verify = createVerify("SHA256");
    verify.write(message);
    verify.end();

    return verify.verify(
      {
        key: this.pubKey,
        padding: constants.RSA_PKCS1_PSS_PADDING,
      },
      signature,
      "base64",
    );
  }
}
