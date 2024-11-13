import { APIClient, Config } from "../api/api";
import { Signature, SignatureConfig } from "../signatures/signature";
import nock from "nock";

const TESTING_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDyR0kXD0bu1nl8
nZP+GLI8bSVFbk5yKTu99LlLevTTFLx6sIXfabgKPHIpwr0xGf99yobD1ZNZ276x
ffnMAeILNA5XsvaMnPpVB4kNoqlDaQdd4ICelKQwt90QD9CIGptNLL2wtUgEn1g9
BV6k5xcT8L9Dw/ZqpMCnfBeGRsWJd84LBfN4lLe5k9MXxE4MLUfTC1xxLmO9C9xw
d92aucyRPkv8n+B9dOlYS8C29huTbregl2rEF32dMyYG1qmVH7ufjM4CX9KdNKA7
hwnJExqrPvhAtj92Ar0Z5JnPfm8SUjQQhFeySeqSHS+kVEsd/AhrsqMsdUSt9ou2
xJTJmiL9AgMBAAECggEANHOO5Q1jZassn3gs9T6K/c6CWmr0VD5NhwUfhXIP5U/Q
sz4aqYDFfX/TFmvo0iPG/oh1TxninfpXKS11Aj/pHFRPg5iEzHHitzxbpUZRHz0y
gVYsekiDWGHB2+uUkZazBwz33zUL66ZEr+dE823tPt2oxsa6xyE2bTwOCr2xH96S
eE6280gJ1LtgGKD4TFsmXSkgJIDyF2rT6ZkPeUR36N0zWiSRQbskLaTqwJSpT6mY
hdZRQBvH/6X2JJgOmWWVizE1ChdOVB7rN3tb7NBSbwf5TWNGsNdhQQoTPxAtGiX8
O+jXilCIjLSqudIDv20jCa8spFuXwpIeBhR/7394GQKBgQD6+g4yZSybGMnMgNM6
OrL1GnJbxtnuMENMi7e2NgeLxKmpWE3cPqTNe9uWNxXYexDgDLNtAfjw7+UZxO6f
e3cPXuyVsr2xTkEscLBNDXrwQV3phnfwpxX++8Flv0xP34TocWAIKXPcQj8h2SYr
6/zhY40YnRsUgsR0x4eAlqJHBQKBgQD3IKl15jjzHEyqVvWuAjsw3LO8rA96i7vg
WDV5LBrsJgE11M7iurwZxZ71STPVzWK5UzxsZBCJgK41NIvgVx6QIuU0HXw9taXY
7PrAwNcpx7yKksXPYsTGhKumLvFQBY/R9qP2RcFN5WQjTSBxp0B5QMDHNz01dPi6
l0TfjKO9mQKBgQCZRRJcdmsaQLYkfNwCaIyXoNIL+FFo4/KFkaHc1fwfwDd4ouPR
yDPvBV/hybw+m1F/8mG1BYpY4bhA14J+xPC941OKTEEKQecNU7hnJf9ZMCJBFgyz
W+bT9D10fLIG6VMKfQqPkXkfHxnc+vcTxaeGobwuNuutx/pf8uZugg+SXQKBgQC3
qjOnpxHeRMMJuhVfXNMm7nA6odnjJuTbyFL9mnTr2xb9LgsQYN4ZfVE1VVFL7hgY
Si9XE0tjFhri+gmXEshpMTYNdHh42H7I6N830FpY99Q9XPXcurgqHkIAAVVhNrD7
yAV1q8QNo5W30sNxFG+Lbj+YD4rTJvsQmgoa5shuyQKBgQCDJuBgjNgyHqWrKEEt
76OJDiXI4mXDg3N6oCjsP/ZsP7mhkmUsokDS1paSnQxtt0tbft+fpbQSFtDGkRKr
OM5SBQhJEa//gFAofgYt+Fo6wcj1NSgBeLspsYx/avRdj9drVGyxOKJX0zsWQemU
Gf6bGumDG6hy0wu4aWDjSvTmww==
-----END PRIVATE KEY-----`;

const TESTING_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8kdJFw9G7tZ5fJ2T/hiy
PG0lRW5Ocik7vfS5S3r00xS8erCF32m4CjxyKcK9MRn/fcqGw9WTWdu+sX35zAHi
CzQOV7L2jJz6VQeJDaKpQ2kHXeCAnpSkMLfdEA/QiBqbTSy9sLVIBJ9YPQVepOcX
E/C/Q8P2aqTAp3wXhkbFiXfOCwXzeJS3uZPTF8RODC1H0wtccS5jvQvccHfdmrnM
kT5L/J/gfXTpWEvAtvYbk263oJdqxBd9nTMmBtaplR+7n4zOAl/SnTSgO4cJyRMa
qz74QLY/dgK9GeSZz35vElI0EIRXsknqkh0vpFRLHfwIa7KjLHVErfaLtsSUyZoi
/QIDAQAB
-----END PUBLIC KEY-----`;

export const BASE_PATH = "http://testing.local-tokopedia.com";
export const TOKEN_PATH = "http://testing-auth.local-tokopedia.com";

export function newClient(): APIClient {
  const signature = new Signature(
    SignatureConfig.withPrivateKeyFromString(TESTING_PRIVATE_KEY),
    SignatureConfig.withPublicKeyFromString(TESTING_PUBLIC_KEY),
  );

  nock(TOKEN_PATH).post("/token").reply(200, {
    access_token: "testingToken",
    token_type: "bearer",
    expires_in: 3600,
  });

  return new APIClient(
    "client_id",
    "client_secret",
    Config.tokenURL(TOKEN_PATH),
    Config.baseURL(BASE_PATH),
    Config.withSignature(signature),
  );
}

export const applyHeaders = (
  scope: nock.Interceptor,
  headers: Record<string, string>,
) => {
  Object.entries(headers).forEach(([key, value]) => {
    scope.matchHeader(key, value);
  });
  return scope;
};

export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
