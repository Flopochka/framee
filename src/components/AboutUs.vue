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
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="img-16">
                        <path fill-rule="evenodd" fill="white" clip-rule="evenodd" d="M6.56766 5.82935L8.97293 1.10743C9.25041 0.56269 9.92131 0.34384 10.4714 0.618614C10.6874 0.726487 10.8621 0.900945 10.9692 1.1157L13.2408 5.66945C13.4263 6.04144 13.7891 6.29543 14.2051 6.34463L18.9619 6.90715C19.6077 6.98351 20.0687 7.56381 19.9916 8.20328C19.9598 8.46664 19.8383 8.71141 19.6472 8.89721L15.8874 12.5515C15.7356 12.699 15.662 12.9083 15.6885 13.1173L16.3133 18.0508C16.4028 18.7571 15.8971 19.4014 15.1839 19.49C14.9136 19.5235 14.6394 19.4723 14.4001 19.3434L10.4278 17.2044C10.1405 17.0496 9.79448 17.0452 9.50314 17.1925L5.38757 19.2735C4.80835 19.5664 4.09904 19.3388 3.80329 18.7653C3.69263 18.5507 3.65182 18.3074 3.68648 18.0689L4.01541 15.8054C4.17629 14.6983 4.87113 13.738 5.878 13.2312L10.449 10.9302C10.5711 10.8688 10.6197 10.721 10.5577 10.6001C10.5096 10.5065 10.4067 10.4535 10.3017 10.4683L4.71134 11.2576C3.85676 11.3783 2.99008 11.1405 2.32006 10.6015L0.458041 9.10369C-0.0733219 8.67626 -0.154163 7.90321 0.277477 7.37704C0.478204 7.13235 0.766309 6.97351 1.08208 6.93346L5.85575 6.32788C6.16191 6.28904 6.42865 6.10225 6.56766 5.82935Z"/>
                    </svg>
                    <p class="text-24 text-white">100 000</p>
                    <p class="text-14 lh-120 jse">bought today</p>
                </div>
                <div class="aboutus-other-card">
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="img-16">
                        <path fill-rule="evenodd" fill="white" clip-rule="evenodd" d="M6.56766 5.82935L8.97293 1.10743C9.25041 0.56269 9.92131 0.34384 10.4714 0.618614C10.6874 0.726487 10.8621 0.900945 10.9692 1.1157L13.2408 5.66945C13.4263 6.04144 13.7891 6.29543 14.2051 6.34463L18.9619 6.90715C19.6077 6.98351 20.0687 7.56381 19.9916 8.20328C19.9598 8.46664 19.8383 8.71141 19.6472 8.89721L15.8874 12.5515C15.7356 12.699 15.662 12.9083 15.6885 13.1173L16.3133 18.0508C16.4028 18.7571 15.8971 19.4014 15.1839 19.49C14.9136 19.5235 14.6394 19.4723 14.4001 19.3434L10.4278 17.2044C10.1405 17.0496 9.79448 17.0452 9.50314 17.1925L5.38757 19.2735C4.80835 19.5664 4.09904 19.3388 3.80329 18.7653C3.69263 18.5507 3.65182 18.3074 3.68648 18.0689L4.01541 15.8054C4.17629 14.6983 4.87113 13.738 5.878 13.2312L10.449 10.9302C10.5711 10.8688 10.6197 10.721 10.5577 10.6001C10.5096 10.5065 10.4067 10.4535 10.3017 10.4683L4.71134 11.2576C3.85676 11.3783 2.99008 11.1405 2.32006 10.6015L0.458041 9.10369C-0.0733219 8.67626 -0.154163 7.90321 0.277477 7.37704C0.478204 7.13235 0.766309 6.97351 1.08208 6.93346L5.85575 6.32788C6.16191 6.28904 6.42865 6.10225 6.56766 5.82935Z"/>
                    </svg>
                    <p class="text-24 text-white">100 000</p>
                    <p class="text-14 lh-120 jse">bought yesterday</p>
                </div>
                <div class="aboutus-other-card">
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="img-16">
                        <path fill-rule="evenodd" fill="white" clip-rule="evenodd" d="M6.56766 5.82935L8.97293 1.10743C9.25041 0.56269 9.92131 0.34384 10.4714 0.618614C10.6874 0.726487 10.8621 0.900945 10.9692 1.1157L13.2408 5.66945C13.4263 6.04144 13.7891 6.29543 14.2051 6.34463L18.9619 6.90715C19.6077 6.98351 20.0687 7.56381 19.9916 8.20328C19.9598 8.46664 19.8383 8.71141 19.6472 8.89721L15.8874 12.5515C15.7356 12.699 15.662 12.9083 15.6885 13.1173L16.3133 18.0508C16.4028 18.7571 15.8971 19.4014 15.1839 19.49C14.9136 19.5235 14.6394 19.4723 14.4001 19.3434L10.4278 17.2044C10.1405 17.0496 9.79448 17.0452 9.50314 17.1925L5.38757 19.2735C4.80835 19.5664 4.09904 19.3388 3.80329 18.7653C3.69263 18.5507 3.65182 18.3074 3.68648 18.0689L4.01541 15.8054C4.17629 14.6983 4.87113 13.738 5.878 13.2312L10.449 10.9302C10.5711 10.8688 10.6197 10.721 10.5577 10.6001C10.5096 10.5065 10.4067 10.4535 10.3017 10.4683L4.71134 11.2576C3.85676 11.3783 2.99008 11.1405 2.32006 10.6015L0.458041 9.10369C-0.0733219 8.67626 -0.154163 7.90321 0.277477 7.37704C0.478204 7.13235 0.766309 6.97351 1.08208 6.93346L5.85575 6.32788C6.16191 6.28904 6.42865 6.10225 6.56766 5.82935Z"/>
                    </svg>
                    <p class="text-24 text-white">100 000</p>
                    <p class="text-14 lh-120 jse">bought all time</p>
                </div>
                <div class="aboutus-other-card">
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="img-16">
                        <path fill-rule="evenodd" fill="white" clip-rule="evenodd" d="M6.56766 5.82935L8.97293 1.10743C9.25041 0.56269 9.92131 0.34384 10.4714 0.618614C10.6874 0.726487 10.8621 0.900945 10.9692 1.1157L13.2408 5.66945C13.4263 6.04144 13.7891 6.29543 14.2051 6.34463L18.9619 6.90715C19.6077 6.98351 20.0687 7.56381 19.9916 8.20328C19.9598 8.46664 19.8383 8.71141 19.6472 8.89721L15.8874 12.5515C15.7356 12.699 15.662 12.9083 15.6885 13.1173L16.3133 18.0508C16.4028 18.7571 15.8971 19.4014 15.1839 19.49C14.9136 19.5235 14.6394 19.4723 14.4001 19.3434L10.4278 17.2044C10.1405 17.0496 9.79448 17.0452 9.50314 17.1925L5.38757 19.2735C4.80835 19.5664 4.09904 19.3388 3.80329 18.7653C3.69263 18.5507 3.65182 18.3074 3.68648 18.0689L4.01541 15.8054C4.17629 14.6983 4.87113 13.738 5.878 13.2312L10.449 10.9302C10.5711 10.8688 10.6197 10.721 10.5577 10.6001C10.5096 10.5065 10.4067 10.4535 10.3017 10.4683L4.71134 11.2576C3.85676 11.3783 2.99008 11.1405 2.32006 10.6015L0.458041 9.10369C-0.0733219 8.67626 -0.154163 7.90321 0.277477 7.37704C0.478204 7.13235 0.766309 6.97351 1.08208 6.93346L5.85575 6.32788C6.16191 6.28904 6.42865 6.10225 6.56766 5.82935Z"/>
                    </svg>
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