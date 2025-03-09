<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const currentType = ref(0)
const currentPremium = ref(0)
const currentPayment = ref(0)
const switchType = (type) => {
    currentType.value = type
    let swithBtns = document.querySelectorAll('.select-type .select-type-item')
    let swtch = document.querySelector('.select-top-swith')
    let boxes = [document.querySelector('.select-top-stars'), document.querySelector('.select-top-premium')]
    let btns = [document.querySelector('.bottom-button-stars'), document.querySelector('.bottom-button-prem')]
    for (let index = 0; index < swithBtns.length; index++) {
        if (index == type) {
            swithBtns[index].classList.add('select-type-item-selected')
            boxes[index].style.maxHeight = '100vh';
            boxes[index].style.transition = 'max-height 0.3s ease-in-out';
            btns[index].style.maxHeight = '16px';
            btns[index].style.transition = 'max-height 0.3s ease-in-out';
        } else {
            swithBtns[index].classList.remove('select-type-item-selected')
            boxes[index].style.maxHeight = '0px';
            boxes[index].style.transition = 'max-height 0.3s ease-in-out';
            btns[index].style.maxHeight = '0px';
            btns[index].style.transition = 'max-height 0.3s ease-in-out';
        }
    }
    if (type == 0) {
        swtch.style.transform = 'translateX(0)';
        swtch.style.transition = 'transform 0.3s ease-in-out, max-height 0.3s ease-in-out';
    } else {
        swtch.style.transform = 'translateX(calc(-50% - 12px))';
        swtch.style.transition = 'transform 0.3s ease-in-out, max-height 0.3s ease-in-out';
    }
}
const switchPremium = (type) => {
    currentPremium.value = type
    let Premiums = document.querySelectorAll('.select-top-item .select-top-premium-card')
    Premiums.forEach((item, key) => {
        if (key == currentPremium.value) {
            item.classList.add('select-top-premium-card-active')
            item.querySelector('.custom-radio').classList.add('custom-radio-active')
        } else {
            item.classList.remove('select-top-premium-card-active')
            item.querySelector('.custom-radio').classList.remove('custom-radio-active')
        }
    })
}
const switchPayment = (type) => {
    currentPayment.value = type
    let Payments = document.querySelectorAll('.select-botoom-cards .select-bottom-card')
    Payments.forEach((item, key) => {
        if (key == currentPayment.value) {
            item.classList.add('select-bottom-card-active')
            item.querySelector('.custom-radio').classList.add('custom-radio-active')
        } else {
            item.classList.remove('select-bottom-card-active')
            item.querySelector('.custom-radio').classList.remove('custom-radio-active')
        }
    })
}
</script>

<template>
    <main class="flex-col gap-28 p-24">
        <div class="select-type flex-row gap-4 bg-blue-900 rounded-10 p-2">
            <div @click="switchType(0)" class="select-type-item select-type-item-selected flex-row items-center justify-center gap-4 text-white p-6 rounded-8">
                Stars
                <img src="../assets/img/StarGold.svg" alt="" class="img-16">
            </div>
            <div @click="switchType(1)" class="select-type-item flex-row items-center justify-center gap-4 text-white p-6 rounded-8">
                Premium
                <img src="../assets/img/StarPremium.svg" alt="" class="img-16">
            </div>
        </div>
        <div  class="select-top flex-col gap-16">
            <div class="select-top-item flex-col gap-6">
                <p class="pl-12">Username</p>
                <input type="text" class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@example">
            </div>
            <div class="select-top-swith">
                <div class="select-top-stars flex-col gap-16">
                    <div class="select-top-item flex-col gap-6">
                        <p class="pl-12">Username</p>
                        <input type="text" class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@example">
                    </div>
                    <div class="select-top-item select-top-stars-box">
                        <div class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04">
                            +100
                            <img src="../assets/img/Star.svg" alt="" class="img-16">
                        </div>
                        <div class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04">
                            +1 000
                            <img src="../assets/img/Star.svg" alt="" class="img-16">
                        </div>
                        <div class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04">
                            +10 000
                            <img src="../assets/img/Star.svg" alt="" class="img-16">
                        </div>
                    </div>
                </div>
                <div class="select-top-premium flex-col gap-16">
                    <p class="pl-12 text-14 text-neutral-300">Subscription</p>
                    <div class="select-top-item select-top-premium-box">
                        <div @click="switchPremium(0)" class="select-top-premium-card select-top-premium-card-active flex-col gap-4 rounded-12 text-white letter-spacing-04 bg-blue-900 p-12">
                            <div class="custom-radio custom-radio-active"></div>
                            <p class="text-16">3 months</p>
                        </div>
                        <div @click="switchPremium(1)" class="select-top-premium-card flex-col gap-4 rounded-12 text-white letter-spacing-04 bg-blue-900 p-12">
                            <div class="custom-radio"></div>
                            <p class="text-16">6 months</p>
                        </div>
                        <div @click="switchPremium(2)" class="select-top-premium-card flex-col gap-4 rounded-12 text-white letter-spacing-04 bg-blue-900 p-12">
                            <div class="custom-radio"></div>
                            <p class="text-16">12 months</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="select-bottomm flex-col gap-4">
            <p class="pl-12">Payment</p>
            <div class="select-botoom-cards grid-row gap-8">
                <div @click="switchPayment(0)" class="select-bottom-card select-bottom-card-active card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio custom-radio-active"></div>
                    <p class="text-16 text-white">TON Network</p>
                    <img src="../assets/img/TON.svg" alt="" class="img-28">
                </div>
                <div @click="switchPayment(1)" class="select-bottom-card card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio"></div>
                    <p class="text-16 text-white-75">USDT</p>
                    <img src="../assets/img/Tether.svg" alt="" class="img-28">
                </div>
                <div @click="switchPayment(2)"class="select-bottom-card card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio"></div>
                    <p class="text-16">SBP</p>
                    <img src="../assets/img/SBP.svg" alt="" class="img-28">
                </div>
                <div @click="switchPayment(3)" class="select-bottom-card card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio"></div>
                    <p class="text-16">VISA & MasterCard</p>
                    <img src="../assets/img/VISA & MasterCard.svg" alt="" class="img-28">
                </div>
            </div>
        </div>
        <div class="bottom-button btn bg-gradient-blue flex-col">
            <div class="bottom-button-stars flex-row gap-4 items-center justify-center">
                <img src="../assets/img/StarGold.svg" alt="" class="img-16">
                <p class="text-17 font-geist font-600 letter-spacing-04 text-white">Buy 3 500</p>
                <img src="../assets/img/StarGold.svg" alt="" class="img-16">
            </div>
            <div class="bottom-button-prem flex-row gap-4 items-center justify-center">
                <p class="text-17 font-geist font-600 letter-spacing-04 text-white">Buy Premium</p>
                <img src="../assets/img/StarPremium.svg" alt="" class="img-16">
            </div>
        </div>
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
.select-type {
    width: 100%;
    padding: 2px;
}
.select-type-item {
    width: 100%;
    padding: 6px;
}
.select-type-item-selected {
    background: var(--blue-500);
}
.select-type-item-img {
    height: 16px;
}
.select-top {
    width: 100%;
    overflow-x: hidden;
}
.select-top-swith{
    display: grid;
    width: calc(200% + 24px);
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    overflow-y: hidden;
}
.select-top-item {
    gap: 6px;
}
.select-top-item-input-text {
    padding: 15px 12px;
    border: 0;
}
.select-top-item-input-text:focus-visible{
    outline: 2px solid var(--blue-500);
}
.select-top-stars{
}
.select-top-stars-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    transition: height 1s;
}
.select-top-stars-card {
    width: 100%;
    background: linear-gradient(129.45deg, var(--blue-400) 9.38%, var(--but-blue-1) 117.65%);
    padding: 7px 12px;
    box-shadow: 0px 2px 6px 0px var(--shadow-25);
    letter-spacing: -0.4px;
    line-height: 22px;
}
.select-top-premium {
    height: auto;
    max-height: 0;
}
.select-top-premium-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
.select-top-premium-card {
    width: 100%;
    aspect-ratio: 1 / 1;
    box-shadow: 0px 2px 6px 0px var(--shadow-25);
    letter-spacing: -0.4px;
    line-height: 22px;
    justify-content: space-between;
}
.select-top-premium-card:nth-of-type(1){
    background:url("../assets/img/Premium1.svg") no-repeat center, var(--blue-900);
    background-size: cover;
}
.select-top-premium-card:nth-of-type(2){
    background:url("../assets/img/Premium2.svg") no-repeat center, var(--blue-900);
    background-size: cover;
}
.select-top-premium-card:nth-of-type(3){
    background:url("../assets/img/Premium3.svg") no-repeat center, var(--blue-900);
    background-size: cover;
}
.select-top-premium-card-active{
    border: 2px solid var(--System-azure-700-80, #007AFFCC);
}
.select-top-premium-card-img {
}
.select-bottom {
}
.select-botoom-cards {
    grid-template-rows: repeat(4, 1fr);
}
.select-bottom-card {
    width: 100%;
    grid-template-columns: auto auto 1fr;
    justify-items: end;
}
.select-bottom-card-active {
    border: 2px solid var(--System-azure-700-80, #007AFFCC)
}
.bottom-button {
    width: 100%;
}
.bottom-button-stars{
    overflow: hidden;
}
.bottom-button-prem{
    max-height: 0px;
    overflow: hidden;
}
</style>