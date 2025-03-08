<script setup>
import { ref } from 'vue'

const currentAccordion = ref(0)
const switchAccordion = (type) => {
    currentAccordion.value = type
    let Accordions = document.querySelectorAll('.aboutus-bottom-accordion .aboutus-bottom-accordion-item')
    Accordions.forEach((item, key) => {
        if (key == currentAccordion.value) {
            item.querySelector('.accordion-checkbox').classList.add('accordion-checkbox-active')
            item.querySelector('.aboutus-bottom-accordion-item-bottom').classList.add('aboutus-bottom-accordion-item-bottom-active')
        } else {
            item.querySelector('.accordion-checkbox').classList.remove('accordion-checkbox-active')
            item.querySelector('.aboutus-bottom-accordion-item-bottom').classList.remove('aboutus-bottom-accordion-item-bottom-active')
        }
    })
}
</script>

<template>
    <main class="flex-col gap-28 p-24">
        
    </main>
</template>

<style scoped>
main{
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: calc(84px + 24px);
    width: 100%;
    display: grid;
    grid-template-rows: repeat(3, auto) 1fr;
    align-items: end;
}
</style>