# Tokopedia Digital B2B2C Node SDK

### _Overview_
This SDK is designed to streamline and simplify the integration process with Tokopedia's B2B2C digital services.

## Features
- Digital Signature to sign and verify request with RSA-PSS
- API Client to hit our services such as inquiry, checkout, check status, etc

## Instalation

npm
```
npm install node-sat
```

### Example
#### API Client
All endpoint will return AxiosResponse object
```
const sat = require('node-sat');

const api = new sat.APIClient(
  'client ID','client secret',
)

api.ping().then(/*...*/).catch(/*...*/)
api.account().then(/*...*/).catch(/*...*/)
api.inquiry({}).then(/*...*/).catch(/*...*/)
api.checkout({}).then(/*...*/).catch(/*...*/)
api.check_status("").then(/*...*/).catch(/*...*/)
```
See the `tests` folder for more examples.

#### Option API Client

**tokenURL** to override URL to get token
default: https://accounts.tokopedia.com
```
tokenURL(url: string)
```

**baseURL** to override base URL
default: https://b2b.tokopedia.com/api
```
baseURL(url: string)
```

**withSignature** to init signature on API Client, for several endpoint need signature
checkout for generate signature, and check_status to verify the signature from Tokopedia
```
withSignature(signature: Signature)
```

**enableVerifySignature** to enabling verify signature on several endpoint that have Signature on response
```
enableVerifySignature()
```

### Signature
```
const sat = require('node-sat');

const signature = new sat.Signature(<option>)

const message = "some message"

// to generate signature
const sign = signature.sign(message)

// to verify signature
signature.verify(message, sign)
```

### Signature Option
init private and public key from string
```
withPrivateKeyFromString(key: string)
withPublicKeyFromString(key: string)
```

init private and public key from file path
```
withPrivateKeyFromFile(path: string)
withPublicKeyFromFile(path: string)
```

### License
The MIT License (MIT)

Copyright (c) 2024 Tokopedia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.