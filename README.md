# K2Token


Create more secure token
<br />
<br />

## Create Token:
```typescript
import { sign, IConfigs } from "k2token";

const payload: Record<string, any> = { key: "value" };
const configs: IConfigs = {
  secret: "secret",
  phrase_one: "secret_phrase_one_string",
  phrase_two: "secret_phrase_two_string",
};

const token = sign(payload, configs);
```
<br />


## Verify Token and get Payload:
```typescript
import { verify, IConfigs } from "k2token";

const token = "some_string_token";
const configs: IConfigs = {
  secret: "secret",
  phrase_one: "secret_phrase_one_string",
  phrase_two: "secret_phrase_two_string",
};

const payload: Record<string, any> = verify(payload, configs);
```