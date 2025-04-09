import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useUserStore } from "../stores/user";
import { sendToBackend } from "../modules/fetch";

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
  const { getUserId } = useUserStore();
  const userId = ref(null)

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
  const loadLanguage = async (lang, hard) => {
    // Проверяем, есть ли язык в localStorage
    const cachedData = tryParse(localStorage.getItem(`lang_${lang}`));
    if (cachedData && !hard) {
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

  // Вспомогательная функция для установки языка
  const setLanguageData = (langKey, langData) => {
    langsData.value[langKey] = langData;
    TextData.value = langData;
    currentLanguage.value = langKey;
    localStorage.setItem("language", langKey);
    localStorage.setItem(`lang_${langKey}`, JSON.stringify(langData));
  };

  // Вспомогательная функция для проверки и обновления языка
  const updateLanguageIfChanged = async (langKey, savedData) => {
    const freshData = await loadLanguage(langKey, true); // Принудительная загрузка
    const freshLang = freshData[langKey];
    const savedString = JSON.stringify(savedData);
    const freshString = JSON.stringify(freshLang);

    if (savedString !== freshString) {
      setLanguageData(langKey, freshLang);
      console.log(`Updated translations for ${langKey}`);
      return true;
    }
    return false;
  };

  // Основная функция загрузки всех языков
  const loadAllLanguages = async () => {
    isLoading.value = true;
    
    // Установка начального языка
    const savedLangKey = localStorage.getItem("language") || "en";
    const savedLangData = tryParse(
      localStorage.getItem(`lang_${savedLangKey}`)
    );

    if (savedLangData) {
      langsData.value[savedLangKey] = savedLangData;
      TextData.value = savedLangData;
      currentLanguage.value = savedLangKey;
    } else {
      const enData = await loadLanguage("en");
      setLanguageData("en", enData["en"]);
    }

    // Проверка изменений в текущем языке
    await updateLanguageIfChanged(savedLangKey, savedLangData);

    // Загрузка остальных языков
    const languagesToLoad = Object.keys(langs).filter(
      (lang) => !langsData.value[lang]
    );

    if (languagesToLoad.length > 0) {
      const results = await Promise.all(
        languagesToLoad.map((lang) => loadLanguage(lang, true))
      );
      results.forEach((langData) => {
        if (langData) {
          const langKey = Object.keys(langData)[0];
          langsData.value[langKey] = langData[langKey];
          localStorage.setItem(
            `lang_${langKey}`,
            JSON.stringify(langData[langKey])
          );
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
      userId.value = getUserId()
      const payload = {
        user_id: userId.value,
        lang: lang,
      };
      console.log(payload)
      try {
        const result = await sendToBackend("/change_user_lang", payload);
        const data = result.data.data;
        console.log("Response:", result.data);
      } catch (error) {
        console.error("Failed:", error);
      }
    } else {
      console.warn(`Не удалось загрузить язык ${lang}`);
      // Возвращаемся к английскому в случае ошибки
      if (lang !== "en") {
        await switchLanguage("en");
      }
    }
  };

  // Геттер для получения текущего языка
  const getCurrentLanguage = () => currentLanguage.value;

  // Геттер для получения конкретного перевода
  const getTranslation = (key) => {
    // console.log('Key: ', key, '\n', TextData.value[key] ? 'TextData: '+TextData.value[key] : 'TextData not avalible', '\n', langsData.value["en"]?.[key]? 'langsData: '+langsData.value["en"]?.[key] : 'langsData not avalible')
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
