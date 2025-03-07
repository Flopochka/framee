<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})
</script>

<template>
  <nav class="menu">
    <div class="menu-item menu-item-active" id="menu-replenishment">
        <img src="../assets/98413fb39429bcb1667b0c7e53e552a4.png" alt="" class="menu-item-img replenishment-img">
    </div>
    <div class="menu-item" id="menu-tasks">
        <img src="../assets/4385934953745.png" alt="" class="menu-item-img tasks-img">
    </div>
    <div class="menu-item" id="menu-faq">
        <img src="../assets/682475678345.png" alt="" class="menu-item-img faq-img">
    </div>
    <div class="menu-item" id="menu-user">
        <img src="../assets/6235978623874623478.png" alt="" class="menu-item-img user-img">
    </div>
  </nav>
</template>

<style scoped>
.menu {
    position: fixed;
    bottom: 0;
    height: 100px;
    width: 100%;
    background: linear-gradient(180deg, var(--blue2) -36.9%, var(--dark-blue2) 118.45%);
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
.menu-item-active {
    background: linear-gradient(129.45deg, var(--light-blue) 9.38%, var(--blue1) 117.65%);
    border: 1px solid;
    box-shadow: 0px 16px 16px 0px #10141C4D;
    border-radius: 10px;
    transform: translateY(-8px);
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
