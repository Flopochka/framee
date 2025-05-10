import axios from "axios";
import querystring from "querystring";
import { isValid } from "@telegram-apps/init-data-node";

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_BACKEND_URL = "http://77.222.47.219:8006";

function tryParseJson(input) {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}

function verifyTelegramInitData(initData) {
  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not defined");
    return false;
  }

  let dataToCheck;
  if (typeof initData === "object" && initData !== null) {
    const params = Object.entries(initData)
      .map(([key, value]) =>
        key === "user" ? `${key}=${JSON.stringify(value)}` : `${key}=${value}`
      )
      .sort()
      .join("\n");
    dataToCheck = params;
  } else if (typeof initData === "string") {
    dataToCheck = initData;
  } else {
    console.log("Invalid initData format");
    return false;
  }

  const valid = isValid(dataToCheck, BOT_TOKEN);
  const authDate =
    initData.auth_date ||
    (typeof initData === "string"
      ? new URLSearchParams(initData).get("auth_date")
      : null);
  if (!authDate) return false;

  const now = Math.floor(Date.now() / 1000);
  const age = now - parseInt(authDate, 10);
  if (age > 86400) return false;

  return valid;
}

export async function handler(event) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

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

  console.log(`[${timestamp}] ➤ Incoming request to ${target}`);
  console.log("Payload keys:", payload ? Object.keys(payload) : "No payload");

  if (!initData || !verifyTelegramInitData(initData)) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: "Invalid Telegram signature or data",
        initDataProvided: !!initData,
        signatureValid: initData ? verifyTelegramInitData(initData) : false,
      }),
    };
  }

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

  const backendUrl = `${BASE_BACKEND_URL}${target}`;

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

    const response = await axios(requestConfig);

    console.log(
      `Backend response from ${requestConfig.url}:\n`,
      JSON.stringify(
        typeof response.data === "string"
          ? tryParseJson(response.data)
          : response.data,
        null,
        2
      )
    );
    console.log(`✔️ Completed in ${Date.now() - start} ms`);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(`❌ Request to ${backendUrl} failed after ${Date.now() - start} ms`);
    console.error("Error message:", error.message);
    console.error("Context:", {
      target,
      backendUrl,
      payloadSummary: payload ? Object.keys(payload) : "No payload",
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
