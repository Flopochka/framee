import axios from "axios";
import querystring from "querystring";
import { isValid } from "@telegram-apps/init-data-node";
import { Cell, beginCell } from "ton-core";
import nodemailer from "nodemailer";

const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_BACKEND_URL = "http://77.222.47.219:8011";

// Проверка подписи Telegram initData с использованием библиотеки
function verifyTelegramInitData(initData) {
  console.log("Verifying initData:", JSON.stringify(initData, null, 2));

  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not defined");
    return false;
  }

  let initDataStr;

  // Если initData — это объект, превращаем его обратно в строку
  if (typeof initData === "object" && initData !== null) {
    initDataStr = new URLSearchParams(
      Object.entries(initData).map(([key, value]) => [
        key,
        typeof value === "object" ? JSON.stringify(value) : value,
      ])
    ).toString();
  } else if (typeof initData === "string") {
    initDataStr = initData;
  } else {
    console.log("Invalid initData format");
    return false;
  }

  // Проверка подписи
  const valid = isValid(initDataStr, BOT_TOKEN);
  console.log("Signature valid for", BOT_TOKEN, ":", valid);

  // Проверка возраста данных
  const authDate = new URLSearchParams(initDataStr).get("auth_date");
  if (!authDate) {
    console.log("No auth_date provided");
    return false;
  }

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
  // Добавляем CORS заголовки для всех ответов
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Обработка preflight OPTIONS запроса
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    console.log("Invalid method:", event.httpMethod);
    return {
      statusCode: 405,
      headers: corsHeaders,
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
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Invalid JSON body",
        details: error.message,
      }),
    };
  }

  const { initData, target, payload } = parsedBody;
  console.log("Parsed body:", { initData, target, payload });

  // Проверка initData
  if (process.env.NODE_ENV === "production") {
    if (!initData || !verifyTelegramInitData(initData)) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Invalid Telegram signature or data",
          initDataProvided: !!initData,
          signatureValid: initData ? verifyTelegramInitData(initData) : false,
          initData: initData || "none",
        }),
      };
    }
  }

  // Проверка target
  if (!target || typeof target !== "string" || !target.startsWith("/")) {
    console.log("Invalid target:", target);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Invalid or missing target",
        targetProvided: !!target,
        targetValue: target || "none",
      }),
    };
  }

  // Отправка отчёта об ошибке на почту (теперь просто лог в консоль)
  if (target === "/log") {
    const { message, log_text, user } = payload || {};
    if (!message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "No message provided" }),
      };
    }
    try {
      console.log(
        "BUG REPORT\nUser ID:",
        user,
        "\nMessage:",
        message,
        "\n---\nLogs:\n",
        log_text
      );
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: { code: 200, message: "Запрос выполнен успешно" },
          data: { message: "Лог успешно записан" },
          output: { type: "", msg: "" },
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Failed to log bug report",
          details: err.message,
        }),
      };
    }
  }

  // Отправка отчёта об ошибке на почту (теперь просто лог в консоль)
  if (target === "/report_bug") {
    const { message, logs, user_id } = payload || {};
    if (!message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "No message provided" }),
      };
    }
    try {
      console.log(
        "BUG REPORT\nUser ID:",
        user_id,
        "\nMessage:",
        message,
        "\n---\nLogs:\n",
        logs
      );
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: { code: 200, message: "Запрос выполнен успешно" },
          data: { message: "Лог успешно записан" },
          output: { type: "", msg: "" },
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Failed to log bug report",
          details: err.message,
        }),
      };
    }
  }

  // Формирование URL для бэкенда
  const backendUrl = `${BASE_BACKEND_URL}${target}`;
  console.log("Backend URL:", backendUrl);

  // Отправка запроса на бэкенд
  try {
    if (target === "/make_boc_comment") {
      const { text } = payload;
      const cell = beginCell().storeUint(0, 32).storeStringTail(text).endCell();
      const boc = await cell.toBoc();
      const base64boc = Buffer.from(boc).toString("base64");

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ base64boc }),
      };
    }

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
      headers: corsHeaders,
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
      headers: corsHeaders,
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
