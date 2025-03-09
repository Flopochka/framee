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
const switchScreen = (type) => {
    currentScreen.value = type
    let Screens = document.querySelectorAll('.screen .screen-item')
    let Screen = document.querySelector('.screen')
    Screens.forEach((item, key) => {
        if (key == currentScreen.value) {
            item.classList.add('screen-item-active')
            Screen.style.transform = `translateX(-${key * 100}vw)`
        } else {
            item.classList.remove('screen-item-active')
        }
    })
}
const toggleModal = (modalName) => {
    activeModal.value = activeModal.value == modalName ? null : modalName
}
const switchLanguage = (lang) => {
    currentLanguage.value = lang
}
</script>

<template>
    <div class="screen">
        <div class="screen-item screen-item-active">
            <MainStars />
        </div>
        <div class="screen-item">
            <Tasks />
        </div>
        <div class="screen-item">
            <AboutUs />
        </div>
        <div class="screen-item">
            <Profile :currentLanguage="currentLanguage" :toggleModal="toggleModal" :switchScreen="switchScreen"/>
        </div>
        <div class="screen-item">
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
