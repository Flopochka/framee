const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8888/.netlify/functions/proxy"
    : "/.netlify/functions/proxy";

export async function sendToBackend(target, payload) {
  const initData = window.Telegram?.WebApp?.initData;
  if (!window.Telegram.WebApp.initData) {console.warn("Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?"); return}
  try {
    console.log(
      target, payload
    );
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initData, // Для проверки подписи
        target, // Цель, например "/search_recipient"
        payload, // Данные для бэкенда
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending request:", error);
    throw error;
  }
}
