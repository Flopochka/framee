import { defineStore } from "pinia";
import { ref } from "vue";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";

export const useHistoryStore = defineStore("history", () => {
  const history = ref(null);

  // Определяем константы вне функций
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function normalizeDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return {
      day: day,
      month: month,
      year: year,
    };
  }
  const historyCache = ref(null);

  const fetchUserHistory = async () => {
    if (historyCache.value) {
      history.value = historyCache.value;
    }
    const payload = {
      user_id: useUserStore().getUserId(),
    };
    try {
      const result = await sendToBackend("/get_user_history", payload);
      const data = result.data.data;

      const groupedByDate = data.history.reduce((acc, item) => {
        const { date, ...rest } = item;
        const dateOnly = date.split(" ")[0];
        if (!acc[dateOnly]) acc[dateOnly] = [];
        acc[dateOnly].push(rest);
        return acc;
      }, {});

      historyCache.value = Object.keys(groupedByDate)
        .map((date) => ({
          date: normalizeDate(date),
          data: groupedByDate[date],
        }))
        .sort(
          (a, b) =>
            new Date(b.date.year, months.indexOf(b.date.month), b.date.day) -
            new Date(a.date.year, months.indexOf(a.date.month), a.date.day)
        );
      history.value = historyCache.value;
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  fetchUserHistory();

  const getHistory = () => history.value;

  return { getHistory, fetchUserHistory };
});
