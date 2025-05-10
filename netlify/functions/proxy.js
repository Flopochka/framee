import axios from "axios";
import querystring from "querystring";

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_BACKEND_URL = "http://77.222.47.219:8006";

// Проверка подписи Telegram initData с использованием библиотеки
function verifyTelegramInitData(initData) {
  console.log("Verifying initData:", JSON.stringify(initData, null, 2));

  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not defined");
    return false;
  }

  let rawString;
  if (typeof initData === "string") {
    rawString = initData;
  } else if (typeof initData === "object" && initData !== null) {
    rawString = querystring.stringify(initData);
  } else {
    console.log("Invalid initData format");
    return false;
  }

  const params = new URLSearchParams(rawString);
  const authDate = params.get("auth_date");
  const hash = params.get("hash");
  if (!authDate || !hash) {
    console.log("Missing auth_date or hash");
    return false;
  }

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const crypto = require("crypto");
  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const valid = hmac === hash;
  console.log("Expected hash:", hash);
  console.log("Computed hash:", hmac);
  console.log("Signature valid:", valid);

  const now = Math.floor(Date.now() / 1000);
  const age = now - parseInt(authDate, 10);
  console.log("Auth date age (seconds):", age);
  if (age > 86400) {
    console.log("Data is too old");
    return false;
  }

  return valid;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    console.log("Invalid method:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method Not Allowed",
        method: event.httpMethod,
      }),
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    console.log("Failed to parse body:", error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid JSON body",
        details: error.message,
      }),
    };
  }

  const { initData, target, payload } = parsedBody;
  console.log("Parsed body:", { initData, target, payload });

  // Проверка initData
  if (!initData || !verifyTelegramInitData(initData)) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: "Invalid Telegram signature or data",
        initDataProvided: !!initData,
        signatureValid: initData ? verifyTelegramInitData(initData) : false,
        initData: initData || "none",
      }),
    };
  }

  // Проверка target
  if (!target || typeof target !== "string" || !target.startsWith("/")) {
    console.log("Invalid target:", target);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid or missing target",
        targetProvided: !!target,
        targetValue: target || "none",
      }),
    };
  }

  // Формирование URL для бэкенда
  const backendUrl = `${BASE_BACKEND_URL}${target}`;
  console.log("Backend URL:", backendUrl);

  // Отправка запроса на бэкенд
  try {
    const requestConfig = {
      method: "POST",
      url: backendUrl,
      data: payload ? querystring.stringify(payload) : undefined,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    };
    console.log("Sending to backend:", {
      method: requestConfig.method,
      url: requestConfig.url,
      headers: requestConfig.headers,
      body: requestConfig.data,
    });

    const response = await axios(requestConfig);
    console.log("Backend response:", {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Backend error:", error.message);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data || "No response data",
    });
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: "Failed to connect to backend",
        details: error.message,
        backendUrl,
        status: error.response?.status,
        responseData: error.response?.data || "No response",
      }),
    };
  }
}
