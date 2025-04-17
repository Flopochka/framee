const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8888/.netlify/functions/proxy"
    : "/.netlify/functions/proxy";

export async function sendToBackend(target, payload) {
  const initData = window.Telegram.WebApp.initData 
  // const initData = "user=%7B%22id%22%3A1341978600%2C%22first_name%22%3A%22%D0%91%D0%B0%D1%80%D0%BE%D0%BD%20%D0%9C%D0%B0%D0%BA%D0%B0%D1%80%D0%BE%D0%BD%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Mamma_lamma%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F-B7cyRByB9iRI_b_B-ajcB1mXfHT1ufVdshpaRuQKPY.svg%22%7D&chat_instance=8503264350922064632&chat_type=group&auth_date=1744868265&signature=lARnOe6fVCrHutTFSntFJTvZMPuH0RG_dbhXSuvm20IGa5SzDThzsObAyITbq0R29ONxtivjddfh6PgDMBMPCA&hash=3e98f69a466ccbf42f4d4383f50078c9dfb9d1362f7337224f16a93dcab9cadd"
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
