<script setup>
import MenuModule from './components/MenuModule.vue'
import MainStars from './components/MainStars.vue'
import Tasks from './components/Tasks.vue'
import AboutUs from './components/AboutUs.vue'
import Profile from './components/Profile.vue'
import MadalScreens from './components/MadalScreens.vue'
import WithdrawScreen from './components/WithdrawScreen.vue'
import { ref } from 'vue'
const currentScreen = ref(0)
const activeModal = ref(null)
const currentLanguage = ref('English')
const switchScreen = (type) => {currentScreen.value = type}
const toggleModal = (modalName) => {activeModal.value = activeModal.value == modalName ? null : modalName}
const switchLanguage = (lang) => {currentLanguage.value = lang}
</script>

<template>
    <div class="screen" :style="{transform: `translateX(-${currentScreen * 100}vw)`}">
        <div class="screen-item" :class="{ 'screen-item-active': currentScreen === 0 }">
            <MainStars />
        </div>
        <div class="screen-item" :class="{ 'screen-item-active': currentScreen === 1 }">
            <Tasks />
        </div>
        <div class="screen-item" :class="{ 'screen-item-active': currentScreen === 2 }">
            <AboutUs />
        </div>
        <div class="screen-item" :class="{ 'screen-item-active': currentScreen === 3 }">
            <Profile :currentLanguage="currentLanguage" :toggleModal="toggleModal" :switchScreen="switchScreen"/>
        </div>
        <div class="screen-item" :class="{ 'screen-item-active': currentScreen === 4 }">
            <WithdrawScreen/>
        </div>
    </div>
    <MenuModule :switchScreen="switchScreen" />
    <MadalScreens :currentLanguage="currentLanguage" :activeModal="activeModal" :toggleModal="toggleModal" :switchLanguage="switchLanguage" />
</template>

<style scoped>
    .screen {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: calc(100vw * 5);
        transition: transform 0.3s;
        position: relative;
    }
    .screen-item {
        overflow-x: hidden;
        overflow-y: show;
        max-height: 0;
        transition: max-height 0.3s;
        width: 100%;
        position: relative;
    }
    .screen-item-active{
        max-height: 500vh;
        overflow-y: auto;
        transition: overflow-y 0.2s 0.2s;
    }
</style>
