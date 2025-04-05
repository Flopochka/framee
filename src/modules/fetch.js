const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8888/.netlify/functions/proxy"
    : "/.netlify/functions/proxy";

export async function sendToBackend(target, payload) {
  const initData = window.Telegram.WebApp.initData
    ? window.Telegram.WebApp.initData
    : {
        query_id: "AAHo9_xPAAAAAOj3_E8kqc6l",
        user: {
          id: 1341978600,
          first_name: "Барон Макарон",
          last_name: "",
          username: "Mamma_lamma",
          language_code: "ru",
          allows_write_to_pm: true,
          photo_url:
            "https://t.me/i/userpic/320/-B7cyRByB9iRI_b_B-ajcB1mXfHT1ufVdshpaRuQKPY.svg",
        },
        auth_date: "1743853560",
        signature:
          "VNvG_HRKRBC7LQ8RIQs6bozNbYZlapftaOuZ2DBP4AlT-UEqGeSyuNVC8uelGsvv4vYq7BgRsdP2Jg1Fe3zECw",
        hash: "ad74dad26a17590875a5ee751b586fe975147f5a51848b3cde8a232b4fc2960d",
      };
  // console.log(initData)
  try {
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
