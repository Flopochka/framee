import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { sendToBackend } from "../modules/fetch";

// Хранилище для языковых данных
export const useLanguageStore = defineStore("language", () => {
  // Реактивные переменные
  const langsData = ref({}); // Все языковые данные
  const currentLanguage = ref(localStorage.getItem("language") || "en"); // Текущий язык
  const TextData = ref({}); // Текущие переводы
  const isLoading = ref(false); // Состояние загрузки
  const userId = ref(null);
  const langs = reactive({
    en: "English",
    ru: "Русский",
    es: "Español",
    de: "Deutsch",
    ar: "فارسی",
    fa: "العربية",
  });

  if (window.Telegram?.WebApp?.initData) {
    userId.value = window.Telegram.WebApp.initData.user.id;
  } else {
    // userId.value = 1341978600; // Значение по умолчанию для отладки
    userId.value = 227363776; // Значение по умолчанию для отладки
  }

  // Вспомогательная функция для парсинга данных из localStorage
  const tryParse = (data) => {
    if (!data) return null;
    try {
      const parsedData = JSON.parse(data);
      if (parsedData && typeof parsedData === "object") {
        return parsedData;
      }
    } catch (error) {
      console.error("Ошибка парсинга данных из localStorage:", error);
    }
    return null;
  };

  // Функция загрузки одного языка
  const loadLanguage = async (lang) => {
    // Проверяем, есть ли язык в localStorage
    const cachedData = tryParse(localStorage.getItem(`lang_${lang}`));
    if (cachedData) {
      return { [lang]: cachedData };
    }

    // Если в кэше нет, загружаем с сервера
    try {
      const language = await import(`../assets/langs/${lang}.js`);
      const langData = language.default;
      // Сохраняем в localStorage
      localStorage.setItem(`lang_${lang}`, JSON.stringify(langData));
      return { [lang]: langData };
    } catch (error) {
      console.error(`Ошибка загрузки языка ${lang}:`, error);
      return { [lang]: null };
    }
  };

  // Функция загрузки всех языков
  const loadAllLanguages = async () => {
    isLoading.value = true;

    // Получаем сохраненный текущий язык
    const savedLangKey = localStorage.getItem("language") || "en";
    const savedLangData = tryParse(
      localStorage.getItem(`lang_${savedLangKey}`)
    );

    // Устанавливаем начальный язык
    if (savedLangData) {
      langsData.value[savedLangKey] = savedLangData;
      TextData.value = savedLangData;
      currentLanguage.value = savedLangKey;
    } else {
      const enData = await loadLanguage("en");
      langsData.value["en"] = enData["en"];
      TextData.value = enData["en"];
      currentLanguage.value = "en";
      localStorage.setItem("language", "en");
    }

    // Загружаем остальные доступные языки
    const languagesToLoad = Object.keys(langs).filter(
      (lang) => !langsData.value[lang]
    );

    if (languagesToLoad.length > 0) {
      const promises = languagesToLoad.map((lang) => loadLanguage(lang));
      const results = await Promise.all(promises);
      results.forEach((langData) => {
        if (langData) {
          Object.assign(langsData.value, langData);
        }
      });
    }

    isLoading.value = false;
  };

  // Переключение языка
  const switchLanguage = async (lang) => {
    if (!langs[lang]) {
      console.warn(`Язык ${lang} не поддерживается`);
      return;
    }

    if (!langsData.value[lang]) {
      isLoading.value = true;
      const langData = await loadLanguage(lang);
      if (langData[lang]) {
        langsData.value[lang] = langData[lang];
      }
      isLoading.value = false;
    }

    if (langsData.value[lang]) {
      currentLanguage.value = lang;
      TextData.value = langsData.value[lang];
      localStorage.setItem("language", lang);
    } else {
      console.warn(`Не удалось загрузить язык ${lang}`);
      // Возвращаемся к английскому в случае ошибки
      if (lang !== "en") {
        await switchLanguage("en");
      }
    }
    const payload = {
      user_id: userId.value,
      lang: lang
    };
    try {
      const result = await sendToBackend("/change_user_lang", payload);
      console.log("Response:", result.data);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  // Геттер для получения текущего языка
  const getCurrentLanguage = () => currentLanguage.value;

  // Геттер для получения конкретного перевода
  const getTranslation = (key) => {
    return TextData.value[key] || langsData.value["en"]?.[key] || key;
  };

  // Инициализация
  loadAllLanguages();

  return {
    currentLanguage,
    TextData,
    isLoading,
    langs,
    switchLanguage,
    getCurrentLanguage,
    getTranslation,
  };
});
