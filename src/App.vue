<script setup>
import MenuModule from './components/MenuModule.vue'
import MainStars from './components/MainStars.vue'
import Tasks from './components/Tasks.vue'
import AboutUs from './components/AboutUs.vue'
import Profile from './components/Profile.vue'
import MadalScreens from './components/MadalScreens.vue'
import WithdrawScreen from './components/WithdrawScreen.vue'
import { ref, onMounted } from 'vue'
import en from './assets/langs/en.js';
const langs= {en:'English', ru:'Русский', es:'Español', de:'Deutsch', ar:'فارسی', fa:'العربية'}
const TextData = ref(en)
const currentScreen = ref(0)
const activeModal = ref(null)
const currentLanguage = ref("en")
const langsData = ref({ en }); // Инициализируем английским сразу
// Функция загрузки одного языка
const loadLanguage = async (lang) => {
  try {
    const language = await import(`./assets/langs/${lang}.js`);
    return { [lang]: language.default };
  } catch (error) {
    console.error(`Ошибка загрузки языка ${lang}:`, error);
    return { [lang]: null };
  }
};

// Загрузка всех языков, кроме английского
const loadAllLanguages = async () => {
  const langKeys = Object.keys(langs).filter(lang => lang !== 'en'); // Пропускаем 'en'
  const promises = langKeys.map(lang => loadLanguage(lang));
  const results = await Promise.all(promises);
  results.forEach(langData => Object.assign(langsData.value, langData));
};

// Переключение экрана и модального окна
const switchScreen = (type) => { currentScreen.value = type; };
const toggleModal = (modalName) => { activeModal.value = activeModal.value === modalName ? null : modalName; };

// Переключение языка
const switchLanguage = (lang) => {
    currentLanguage.value = lang;
    console.log(langsData)
    TextData.value = langsData.value[lang]
};

// Загружаем языки при монтировании
onMounted(() => {
  loadAllLanguages();
});
</script>

<template>
    <span class="smosh">
      <div class="smosh1"></div>
      <div class="smosh2"></div>
      <div class="smosh3"></div>
    </span>
    <div class="screen" :style="{transform: `translateX(-${currentScreen * 100}vw)`}">
        <div class="screen-item">
            <MainStars :TextData="TextData" :toggleModal="toggleModal"/>
        </div>
        <div class="screen-item">
            <Tasks :TextData="TextData"/>
        </div>
        <div class="screen-item">
            <AboutUs :TextData="TextData"/>
        </div>
        <div class="screen-item">
            <Profile :langs="langs" :TextData="TextData" :currentLanguage="currentLanguage" :toggleModal="toggleModal" :switchScreen="switchScreen"/>
        </div>
        <div class="screen-item">
            <WithdrawScreen :TextData="TextData" :toggleModal="toggleModal"/>
        </div>
    </div>
    <MenuModule :switchScreen="switchScreen" />
    <MadalScreens :langs="langs" :TextData="TextData" :currentLanguage="currentLanguage" :activeModal="activeModal" :toggleModal="toggleModal" :switchLanguage="switchLanguage" />
</template>

<style scoped>
    .screen {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: calc(100vw * 5);
        transition: transform 0.3s;
        position: relative;
        height: 100vh;
        backdrop-filter: blur(165.10000610351562px)
    }
    .screen-item {
        overflow-x: hidden;
        overflow-y: visible;
        height: calc(100vh - 84px);
        transition: max-height 0.3s;
        width: 100%;
        position: relative;
    }
    .smosh {
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: -1;
        /* backdrop-filter: blur(165.10000610351562px) */
    }
    .smosh1 {
        position: absolute;
        width: 534px;
        height: 470px;
        top: -290px;
        left: -71px;
        background: #D9D9D94D;
    }
    .smosh2 {
        position: absolute;
        width: 207px;
        height: 182px;
        top: 401px;
        left: 252px;    
        background: #D9D9D94D;
        backdrop-filter: blur(300px)
    }
    .smosh3 {
        position: absolute;
        width: 207px;
        height: 182px;
        top: 692px;
        left: -59px;
        background: #D9D9D94D;
    }
</style>
