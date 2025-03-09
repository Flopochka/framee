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
        <div class="aboutus-cover flex-col gap-40">
            <div class="text-white aboutus-btn btn text-16">
                Connect Wallet
                <img src="../assets/img/wallet.svg" alt="" class="img-20">
            </div>
            <p class="aboutus-cover-header text-32 lh-110 tac">The Best Choice for Purchasing Telegram Stars and Premium</p>
            <div class="aboutus-cover-card rounded-18 flex-col items-center justify-center gap-32">
                <img src="../assets/img/Duck.svg" alt="" class="aboutus-cover-card-img">
                <p class="text-white text-24 lh-100 tac">Pay with TON, USDT or card payments. </p>
                <p class="text-16 lh-120 tac">Enjoy lower prices than the official Telegram bot with no KYC verification required</p>
            </div>
        </div>
        <div class="aboutus-other">
            <p class="text-16 lh-120 mb-12">About us</p>
            <div class="aboutus-other-cards">
                <div class="aboutus-other-card">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    <p class="text-24 text-white">100 000</p>
                    <p class="text-14 lh-120 jse">bought today</p>
                </div>
                <div class="aboutus-other-card">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    <p class="text-24 text-white">100 000</p>
                    <p class="text-14 lh-120 jse">bought yesterday</p>
                </div>
                <div class="aboutus-other-card">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    <p class="text-24 text-white">100 000</p>
                    <p class="text-14 lh-120 jse">bought all time</p>
                </div>
                <div class="aboutus-other-card">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    <p class="text-24 text-white">100 000</p>
                    <p class="text-14 lh-120 jse">bought month premium</p>
                </div>
            </div>
        </div>
        <div class="aboutus-bottom">
            <p class="text-16 lh-120 mb-12">FAQ</p>
            <div class="aboutus-bottom-accordion flex-col">
                <div @click="switchAccordion(0)" class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">Why are your prices up to 39.7% lower?</p>
                        <div class="accordion-checkbox jse accordion-checkbox-active">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom aboutus-bottom-accordion-item-bottom-active">
                        <p class="text-16 lh-140">
                            <br>
                            When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.
                        </p>
                    </div>
                </div>
                <div @click="switchAccordion(1)" class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">What is the commission for purchasing through FRAME?</p>
                        <div class="accordion-checkbox jse">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom">
                        <p class="text-16 lh-140">
                            <br>
                            When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.
                        </p>
                    </div>
                </div>
                <div @click="switchAccordion(2)" class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">What payment methods do you accept?</p>
                        <div class="accordion-checkbox jse">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom">
                        <p class="text-16 lh-140">
                            <br>
                            When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.
                        </p>
                    </div>
                </div>
                <div @click="switchAccordion(3)" class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">How long does the delivery take?</p>
                        <div class="accordion-checkbox jse">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom">
                        <p class="text-16 lh-140">
                            <br>
                            When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.
                        </p>
                    </div>
                </div>
                <div @click="switchAccordion(4)" class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">Is it safe to buy from FRAME?</p>
                        <div class="accordion-checkbox jse">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom">
                        <p class="text-16 lh-140">
                            <br>
                            When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.
                        </p>
                    </div>
                </div>
                <div @click="switchAccordion(5)" class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">How can I send Stars to a friend?</p>
                        <div class="accordion-checkbox jse">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom">
                        <p class="text-16 lh-140">
                            <br>
                            When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.
                        </p>
                    </div>
                </div>
                <div @click="switchAccordion(6)" class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">How can I get Telegram Stars for free?</p>
                        <div class="accordion-checkbox jse">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom">
                        <p class="text-16 lh-140">
                            <br>
                            When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.
                        </p>
                    </div>
                </div>
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
.aboutus-cover {
    padding: 0 24px;
}
.aboutus-btn {
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
    padding: 16px;
    justify-content: space-between;
}
.aboutus-cover-header{
    display: table;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.7) 0%, #FFFFFF 49%, rgba(255, 255, 255, 0.5) 97%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #0B2349;
    display: table;
}
.aboutus-cover-card {
    background: linear-gradient(180deg, #3F87C7 0%, #103960 100%);
    padding: 28px 20px;
}
.aboutus-cover-card-img {
    width: 154px;
    height: 154px;
}
.aboutus-other {
}
.aboutus-other-cards {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    gap: 36px;
}
.aboutus-other-card {
    display: grid;
    grid-template-columns: auto auto 1fr;
    position: relative;
}
.aboutus-other-card:nth-child(n + 2)::after {
    content: "";
    width: 100%;
    position: absolute;
    height: 2px;
    background:  var(--blue-900);
    top: -19px;
}
.aboutus-bottom {
}
.aboutus-bottom-accordion {
    gap: 36px;
}
.aboutus-bottom-accordion-item {
    position: relative;
}
.aboutus-bottom-accordion-item:nth-child(n + 2)::after {
    content: "";
    width: 100%;
    position: absolute;
    height: 2px;
    background:  var(--blue-900);
    top: -19px;
}
.aboutus-bottom-accordion-item-top {
    width: 100%;
    justify-content: space-between;
}
.accordion-checkbox {
    transition: transform 0.3s ease-in-out;
}
.accordion-checkbox-active {
    transform: rotate(180deg);
}
.aboutus-bottom-accordion-item-bottom {
    max-height: 0px;
    height: auto;
    overflow: hidden;
    transition: max-height 0.2s ease-in-out;
}
.aboutus-bottom-accordion-item-bottom-active{
    max-height: 200px;
    transition: max-height 0.2s ease-in-out;
}
</style>