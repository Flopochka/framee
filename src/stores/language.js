import { defineStore } from "pinia";
import { ref, reactive } from "vue";

// Хранилище для языковых данных
export const useLanguageStore = defineStore("language", () => {
  // Реактивные переменные
  const langsData = ref({}); // Все языковые данные
  const currentLanguage = ref(localStorage.getItem("language") || "en"); // Текущий язык
  const TextData = ref({}); // Текущие переводы
  const isLoading = ref(false); // Состояние загрузки
  const langs = reactive({
    en: "English",
    ru: "Русский",
    es: "Español",
    de: "Deutsch",
    ar: "فارسی",
    fa: "العربية",
  });

  const tryParse = async (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        // Проверяем, что данные корректны
        if (parsedData && typeof parsedData === "object") {
          return parsedData;
        }
      } catch (error) {
        console.error("Ошибка при загрузке languageData из localStorage:", error);
        localStorage.removeItem("languageData"); // Удаляем некорректные данные
      }
    }
  }

  // Функция загрузки одного языка
  const loadLanguage = async (lang) => {
    try {
      const language = await import(`../assets/langs/${lang}.js`); // Путь относительно stores
      return { [lang]: language.default };
    } catch (error) {
      console.error(`Ошибка загрузки языка ${lang}:`, error);
      return { [lang]: null };
    }
  };

  // Функция загрузки всех языков
  const loadAllLanguages = async () => {
    const localSavedLang = {[localStorage.getItem("language")]:tryParse(localStorage.getItem("languageData"))}

    isLoading.value = true;

    // Сначала загружаем английский язык (en)
    const enData = await loadLanguage("en");
    Object.assign(langsData.value, enData);
    if(localSavedLang)Object.assign(langsData.value, localSavedLang)

    // Устанавливаем начальные данные для текущего языка
    TextData.value =
      localSavedLang || langsData.value["en"];

    // Загружаем остальные языки
    const langKeys =
      Object.keys(langsData.value).filter((lang) => lang !== "en") || [];
    const promises = langKeys.map((lang) => loadLanguage(lang));
    const results = await Promise.all(promises);
    results.forEach((langData) => Object.assign(langsData.value, langData));

    // Обновляем TextData после загрузки всех языков
    TextData.value =
      langsData.value[currentLanguage.value] || langsData.value["en"];

    isLoading.value = false;
  };

  // Переключение языка
  const switchLanguage = async (lang) => {
    if (!langsData.value[lang]) {
      // Если язык ещё не загружен, загружаем его
      isLoading.value = true;
      const langData = await loadLanguage(lang);
      Object.assign(langsData.value, langData);
      isLoading.value = false;
    }

    if (langsData.value[lang]) {
      currentLanguage.value = lang;
      TextData.value = langsData.value[lang];
      localStorage.setItem("language", lang); // Сохраняем выбранный язык
      localStorage.setItem("languageData", JSON.stringify(langsData.value[lang]));
    } else {
      console.warn(`Language ${lang} not found`);
    }
  };

  // Геттер для получения текущего языка
  const getCurrentLanguage = () => currentLanguage.value;

  // Геттер для получения конкретного перевода
  const getTranslation = (key) => {
    return (
      TextData.value[key] || tryParse(localStorage.getItem("languageData"))[key] || key
    ); // Возвращаем ключ, если перевод не найден
  };

  // Инициализация: загружаем языки при создании хранилища
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
