"use strict";
exports.__esModule = true;
exports.verify = exports.sign = void 0;
var sign = function (payload, configs) {
    var secret = configs.secret, phrase_one = configs.phrase_one, phrase_two = configs.phrase_two;
    var payloadCopy = JSON.parse(JSON.stringify(payload));
    payloadCopy.__random__fake__key__ = (+new Date() + Math.floor(Math.random() * (999 - 100) + 100)).toString(16);
    var secretBuff = Buffer.from(secret, "utf-8");
    var secret64 = secretBuff.toString("base64");
    var phraseOneBuff = Buffer.from(phrase_one, "utf-8");
    var phraseOne64 = phraseOneBuff.toString("base64");
    var payloadStr = JSON.stringify(payloadCopy);
    var payloadStrBuff = Buffer.from(payloadStr, "utf-8");
    var payloadStr64 = payloadStrBuff.toString("base64");
    var phraseTwoBuff = Buffer.from(phrase_two, "utf-8");
    var phraseTwo64 = phraseTwoBuff.toString("base64");
    var token = secret64 + phraseOne64 + payloadStr64 + phraseTwo64;
    var tokenPartNumber = Math.floor(token.length / 8);
    var dotOneIndex = tokenPartNumber * 3;
    var dotTwoIndex = tokenPartNumber * 6 - 1;
    token = token.slice(0, dotOneIndex) + "lf." + token.slice(dotOneIndex);
    token = token.slice(0, dotTwoIndex) + ".rg" + token.slice(dotTwoIndex);
    return token;
};
exports.sign = sign;
var verify = function (token, configs) {
    var secret = configs.secret, phrase_one = configs.phrase_one, phrase_two = configs.phrase_two;
    try {
        token = token.replace(/(lf\.|\.rg)/g, "");
        var secretBuff = Buffer.from(secret, "utf-8");
        var secret64 = secretBuff.toString("base64");
        var tokenSecret = token.slice(0, token.indexOf(secret64) + secret64.length);
        if (tokenSecret !== secret64)
            return { valid: false, data: {} };
        var phraseOneBuff = Buffer.from(phrase_one, "utf-8");
        var phraseOne64 = phraseOneBuff.toString("base64");
        var phraseOne64Index = token.indexOf(phraseOne64);
        var tokenPhraseOne = token.slice(phraseOne64Index, phraseOne64Index + phraseOne64.length);
        if (tokenPhraseOne !== phraseOne64)
            return { valid: false, data: {} };
        var phraseTwoBuff = Buffer.from(phrase_two, "utf-8");
        var phraseTwo64 = phraseTwoBuff.toString("base64");
        var phraseTwo64Index = token.indexOf(phraseTwo64);
        var tokenPhraseTwo = token.slice(phraseTwo64Index, phraseTwo64Index + phraseTwo64.length);
        if (tokenPhraseTwo !== phraseTwo64)
            return { valid: false, data: {} };
        var payloadStr64 = token.slice(phraseOne64Index + phraseOne64.length, phraseTwo64Index);
        var payloadStrBuff = Buffer.from(payloadStr64, "base64");
        var payloadStr = payloadStrBuff.toString("utf-8");
        var payload = JSON.parse(payloadStr);
        delete payload.__random__fake__key__;
        return { valid: true, data: payload };
    }
    catch (error) {
        return { valid: false, data: {} };
    }
};
exports.verify = verify;
exports["default"] = { sign: exports.sign, verify: exports.verify };
