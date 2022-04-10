export const sign = (
  payload: Record<string, any>,
  configs: {
    secret?: string;
    phrase_one?: string;
    phrase_two?: string;
  } = {}
): string => {
  const {
    secret = "Jsa0lmxkVuTFhJpYXQiOjObFkrNmV4sInRSjFjMlYplzvCCwP3",
    phrase_one = "NiMjVuTFhObFk0SmxkQzFyWlhrNmV5SjFjMlZ5WDJsa0lqb",
    phrase_two = "tk6MZRVCI6IkpXVCObFk0SmxVuTFV5SjFjMlZ5WMDM5NjV9",
  } = configs;
  payload.__random__fake__key__ = (+new Date() + Math.floor(Math.random() * (999 - 100) + 100)).toString(16);

  const secretBuff = Buffer.from(secret, "utf-8");
  const secret64 = secretBuff.toString("base64");

  const phraseOneBuff = Buffer.from(phrase_one, "utf-8");
  const phraseOne64 = phraseOneBuff.toString("base64");

  const payloadStr = JSON.stringify(payload);
  const payloadStrBuff = Buffer.from(payloadStr, "utf-8");
  const payloadStr64 = payloadStrBuff.toString("base64");

  const phraseTwoBuff = Buffer.from(phrase_two, "utf-8");
  const phraseTwo64 = phraseTwoBuff.toString("base64");

  let token = secret64 + phraseOne64 + payloadStr64 + phraseTwo64;

  const tokenPartNumber = Math.floor(token.length / 8);
  const dotOneIndex = tokenPartNumber * 3;
  const dotTwoIndex = tokenPartNumber * 6 - 1;
  token = token.slice(0, dotOneIndex) + "lf." + token.slice(dotOneIndex);
  token = token.slice(0, dotTwoIndex) + ".rg" + token.slice(dotTwoIndex);

  return token;
};

export const verify = (
  token: string,
  configs: {
    secret?: string;
    phrase_one?: string;
    phrase_two?: string;
  } = {}
): { valid: boolean; data: Record<string, any> } => {
  const {
    secret = "Jsa0lmxkVuTFhJpYXQiOjObFkrNmV4sInRSjFjMlYplzvCCwP3",
    phrase_one = "NiMjVuTFhObFk0SmxkQzFyWlhrNmV5SjFjMlZ5WDJsa0lqb",
    phrase_two = "tk6MZRVCI6IkpXVCObFk0SmxVuTFV5SjFjMlZ5WMDM5NjV9",
  } = configs;

  try {
    token = token.replace(/(lf\.|\.rg)/g, "");
    const secretBuff = Buffer.from(secret, "utf-8");
    const secret64 = secretBuff.toString("base64");
    const tokenSecret = token.slice(0, token.indexOf(secret64) + secret64.length);
    if (tokenSecret !== secret64) return { valid: false, data: {} };

    const phraseOneBuff = Buffer.from(phrase_one, "utf-8");
    const phraseOne64 = phraseOneBuff.toString("base64");
    const phraseOne64Index = token.indexOf(phraseOne64);
    const tokenPhraseOne = token.slice(phraseOne64Index, phraseOne64Index + phraseOne64.length);
    if (tokenPhraseOne !== phraseOne64) return { valid: false, data: {} };

    const phraseTwoBuff = Buffer.from(phrase_two, "utf-8");
    const phraseTwo64 = phraseTwoBuff.toString("base64");
    const phraseTwo64Index = token.indexOf(phraseTwo64);
    const tokenPhraseTwo = token.slice(phraseTwo64Index, phraseTwo64Index + phraseTwo64.length);
    if (tokenPhraseTwo !== phraseTwo64) return { valid: false, data: {} };

    const payloadStr64 = token.slice(phraseOne64Index + phraseOne64.length, phraseTwo64Index);
    const payloadStrBuff = Buffer.from(payloadStr64, "base64");
    const payloadStr = payloadStrBuff.toString("utf-8");
    const payload = JSON.parse(payloadStr);
    delete payload.__random__fake__key__;
    return { valid: true, data: payload };
  } catch (error) {
    return { valid: false, data: {} };
  }
};

export default { sign, verify };
