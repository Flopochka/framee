import axios from "axios";
import querystring from "querystring";
import { isValid } from "@telegram-apps/init-data-node";

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_BACKEND_URL = "http://185.105.90.37:8010";

// Проверка подписи Telegram initData с использованием библиотеки
function verifyTelegramInitData(initData) {
  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not defined");
    return false;
  }

  // Подготовка данных для проверки
  let dataToCheck;
  if (typeof initData === "object" && initData !== null) {
    // Преобразуем объект в строку формата query string
    const params = Object.entries(initData)
      .map(([key, value]) =>
        key === "user" ? `${key}=${JSON.stringify(value)}` : `${key}=${value}`
      )
      .sort()
      .join("\n");
    dataToCheck = params;
  } else if (typeof initData === "string") {
    dataToCheck = initData; // Библиотека принимает строку как есть
  } else {
    console.log("Invalid initData format");
    return false;
  }

  // Проверка с помощью isValid
  const valid = isValid(dataToCheck, BOT_TOKEN);

  // Проверка возраста данных (библиотека этого не делает)
  const authDate =
    initData.auth_date ||
    (typeof initData === "string"
      ? new URLSearchParams(initData).get("auth_date")
      : null);
  if (!authDate) {
    console.log("No auth_date provided");
    return false;
  }
  const now = Math.floor(Date.now() / 1000);
  const age = now - parseInt(authDate, 10);
  if (age > 86400) {
    // 24 часа
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
    // console.log("Sending to backend:", {
    //   method: requestConfig.method,
    //   url: requestConfig.url,
    //   headers: requestConfig.headers,
    //   body: requestConfig.data,
    // });

    const response = await axios(requestConfig);
    console.log("Backend response from",requestConfig.url,":", {
      status: response.status,
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
