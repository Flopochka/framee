<script setup>
import { ref } from 'vue'
import { useScreenStore } from '../stores/screen'

const { switchScreen, getCurrentScreen } = useScreenStore()
// Проверка активного экрана
const isActive = (index) => {
  // Последний экран активен для индекса > 2
  return index === 3 ? getCurrentScreen() > 2 : getCurrentScreen() === index
}

const menuItems = ref([
  {
    icon: new URL('../assets/img/Icon.webp', import.meta.url).href,
    alt: 'Replenishment',
    imgClass: 'menu-item-img replenishment-img'
  },
  {
    icon: new URL('../assets/img/Tasks.svg', import.meta.url).href,
    alt: 'Tasks',
    imgClass: 'menu-item-img tasks-img'
  },
  {
    icon: new URL('../assets/img/Question.svg', import.meta.url).href,
    alt: 'FAQ',
    imgClass: 'menu-item-img faq-img'
  },
  {
    icon: new URL('../assets/img/User.svg', import.meta.url).href,
    alt: 'User',
    imgClass: 'menu-item-img user-img'
  }
])
</script>

<template>
  <nav class="menu">
    <div
      v-for="(item, index) in menuItems"
      :key="item.icon"
      @click="switchScreen(index)"
      class="menu-item cupo"
      :class="{ 'menu-item-active': isActive(index) }"
    >
      <img :src="item.icon" :alt="item.alt" :class="item.imgClass" />
    </div>
  </nav>
</template>

<style scoped>
.menu {
  position: fixed;
  bottom: 0;
  height: 84px;
  width: 100%;
  background: linear-gradient(
    180deg,
    var(--back-blue-1) -36.9%,
    var(--back-black-1) 118.45%
  );
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
  transition: background var(--default-time), border var(--default-time),
    box-shadow var(--default-time), transform var(--default-time);
}
.menu-item::before {
  transition: background var(--default-time);
}
.menu-item::after {
  transition: background var(--default-time);
}
.menu-item-active {
  position: relative;
  background: linear-gradient(
    129.45deg,
    var(--blue-400) 9.38%,
    var(--but-blue-1) 117.65%
  );
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
  background: linear-gradient(154.74deg, #75d4f3 0%, #0e38ab 100%);
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
