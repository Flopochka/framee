<script setup>
import MenuModule from './components/MenuModule.vue'
import MainStars from './components/MainStars.vue'
import Tasks from './components/Tasks.vue'
import AboutUs from './components/AboutUs.vue'
import Profile from './components/Profile.vue'
import { ref } from 'vue'
const currentScreen = ref(0)
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
            <Profile />
        </div>
    </div>
    <MenuModule :switchScreen="switchScreen" />
</template>

<style scoped>
    .screen {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: calc(100vw * 3);
        transition: transform 0.3s;
    }
    .screen-item {
        overflow-x: hidden;
        max-height: 0;
        transition: max-height 0.3s;
    }
    .screen-item-active{
        max-height: 500vh;
    }
</style>
