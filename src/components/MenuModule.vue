<script setup>
import { ref } from 'vue'

defineProps(['switchScreen'])

const activeScreen = ref(0)
const PressswitchScreen = (type) => {activeScreen.value = type}
</script>

<template>
  <nav class="menu">
    <div @click="PressswitchScreen(0),switchScreen(0)" class="menu-item" :class="{ 'menu-item-active': activeScreen === 0 }">
        <img src="../assets/img/Icon.svg" alt="" class="menu-item-img replenishment-img">
    </div>
    <div @click="PressswitchScreen(1),switchScreen(1)" class="menu-item" :class="{ 'menu-item-active': activeScreen === 1 }">
        <img src="../assets/img/Tasks.svg" alt="" class="menu-item-img tasks-img">
    </div>
    <div @click="PressswitchScreen(2),switchScreen(2)" class="menu-item" :class="{ 'menu-item-active': activeScreen === 2 }">
        <img src="../assets/img/Question.svg" alt="" class="menu-item-img faq-img">
    </div>
    <div @click="PressswitchScreen(3),switchScreen(3)" class="menu-item" :class="{ 'menu-item-active': activeScreen > 2 }">
        <img src="../assets/img/User.svg" alt="" class="menu-item-img user-img">
    </div>
  </nav>
</template>

<style scoped>
.menu {
    position: fixed;
    bottom: 0;
    height: 84px;
    width: 100%;
    background: linear-gradient(180deg, var(--back-blue-1) -36.9%, var(--back-black-1) 118.45%);
    display: grid;
    grid-template-columns: repeat(4, auto);
    justify-content: center;
    gap: 10px;
}
.menu-item {
    height: 54px;
    width: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--default-time), border var(--default-time), box-shadow var(--default-time), transform var(--default-time);
}
.menu-item::before {
    transition: background var(--default-time);
}
.menu-item::after {
    transition: background var(--default-time);
}
.menu-item-active {
    position: relative;
    background: linear-gradient(129.45deg, var(--blue-400) 9.38%, var(--but-blue-1) 117.65%);
    box-shadow: 0px 16px 16px 0px var(--shadow-30);
    border-radius: 10px;
    transform: translateY(-8px);
}
.menu-item-active::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(154.74deg, #75D4F3 0%, #0E38AB 100%);
    border-radius: 10px;
    z-index: -2;
}
.menu-item-active::after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background: inherit;
    border-radius: 9px;
    z-index: -1;
}
.menu-item-img {
    height: 50%;
    width: 50%;
    object-fit: contain;
}
.replenishment-img {
}
.tasks-img {
}
.faq-img {
}
.user-img {
}
</style>
