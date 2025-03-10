<script setup>
import { ref } from 'vue'

const AccordionData = [
    ['Why are your prices up to 39.7% lower?','When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.'],
    ['What is the commission for purchasing through FRAME?','All prices listed in our Telegram service @FrameStars_Bot and on our website are final. The only additional cost is a small network fee when transferring funds.'],
    ['What payment methods do you accept?','We accept payments in TON, USDT, and bank cards. Choose the most convenient option during checkout.'],
    ['How long does the delivery take?','Orders are typically processed instantly. In rare cases, it may take a few minutes. If your purchase hasn\'t arrived, please check your transaction details or contact our @framestars_support.'],
    ['What happens if my purchase doesn’t arrive?','If you haven\'t received your Stars or Premium subscription within a reasonable time, please reach out to our @framestars_support with your payment details. We’ll assist you as quickly as possible.'],
    ['Is it safe to buy from FRAME?','Yes, our service is secure and reliable. We process transactions without requiring personal data, ensuring privacy and safety.'],
    ['How can I send Stars to a friend?','Simply enter the recipient’s Telegram @username during the purchase process, and the Stars or Premium subscription will be sent directly to their account.'],
    ['How can I get Telegram Stars for free?','Our task page is currently in development. Soon, you’ll be able to earn Stars by watching short promotional videos.']
]
const currentAccordion = ref(0)
const switchAccordion = (type) => currentAccordion.value = type
const isAccordionActive = (index) => currentAccordion.value === index
</script>

<template>
    <main class="gap-28 p-24">
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
                <div v-for="(accordion, index) in AccordionData" :key="index"
                    @click="switchAccordion(index)"
                    class="aboutus-bottom-accordion-item">
                    <div class="aboutus-bottom-accordion-item-top flex-row items-center">
                        <p class="text-18 text-white">{{accordion[0]}}</p>
                        <div class="accordion-checkbox jse" :class="{ 'accordion-checkbox-active': isAccordionActive(index) }">
                            <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
                        </div>
                    </div>
                    <div class="aboutus-bottom-accordion-item-bottom" :class="{ 'aboutus-bottom-accordion-item-bottom-active': isAccordionActive(index) }">
                        <p class="text-16 lh-140"><br>{{accordion[1]}}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
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