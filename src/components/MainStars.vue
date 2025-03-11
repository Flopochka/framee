<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
defineProps(['AppData', 'currentLanguage'])

const currentType = ref(0)
const currentPremium = ref(0)
const currentPayment = ref(0)
const stars = ref(null)

const isStarsSelected = computed(() => currentType.value === 0)
const isPremiumSelected = computed(() => currentType.value === 1)
const switchType = (type) => currentType.value = type
const switchPremium = (type) => currentPremium.value = type
const switchPayment = (type) => currentPayment.value = type
const isPremiumActive = (index) => currentPremium.value === index
const isPaymentActive = (index) => currentPayment.value === index

</script>

<template>
    <main class="gap-28 p-24">
        <div class="select-type flex-row gap-4 bg-blue-900 rounded-10 p-2">
            <div @click="switchType(0)" class="select-type-item flex-row items-center justify-center gap-4 text-white p-6 rounded-8" :class="{ 'select-type-item-selected': currentType === 0 }">
                {{ AppData.text[currentLanguage].mainstarspage.stars }}
                <img src="../assets/img/StarGold.svg" alt="" class="img-16">
            </div>
            <div @click="switchType(1)" class="select-type-item flex-row items-center justify-center gap-4 text-white p-6 rounded-8" :class="{ 'select-type-item-selected': currentType === 1 }">
                {{ AppData.text[currentLanguage].mainstarspage.premium }}
                <img src="../assets/img/StarPremium.svg" alt="" class="img-16">
            </div>
        </div>
        <div  class="select-top flex-col gap-16">
            <div class="select-top-item flex-col gap-6">
                <p class="pl-12">{{ AppData.text[currentLanguage].mainstarspage.username }}</p>
                <input type="text" class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@example">
            </div>
            <div class="select-top-swith" :style="{transform: currentType === 0 ? 'translateX(0)' : 'translateX(calc(-50% - 12px))'}">
                <div class="select-top-stars flex-col gap-16" :style="{maxHeight: currentType === 0 ? '100vh' : '0'}">
                    <div class="select-top-item flex-col gap-6">
                        <p class="pl-12">{{ AppData.text[currentLanguage].mainstarspage.amount }}</p>
                        <input v-model.number="stars"  type="number" class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="Min 100" min="100" max="1000000">
                    </div>
                    <div class="select-top-item select-top-stars-box">
                        <div @click="stars+=100" class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04">
                            +100
                            <img src="../assets/img/Star.svg" alt="" class="img-16">
                        </div>
                        <div @click="stars+=1000" class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04">
                            +1 000
                            <img src="../assets/img/Star.svg" alt="" class="img-16">
                        </div>
                        <div @click="stars+=10000" class="select-top-stars-card flex-row items-center justify-center gap-4 rounded-12 text-white letter-spacing-04">
                            +10 000
                            <img src="../assets/img/Star.svg" alt="" class="img-16">
                        </div>
                    </div>
                </div>
                <div class="select-top-premium flex-col gap-16" :style="{maxHeight: isPremiumSelected ? '100vh' : '0'}">
                    <p class="pl-12 text-14 text-neutral-300">{{ AppData.text[currentLanguage].mainstarspage.subscription }}</p>
                    <div class="select-top-item select-top-premium-box">
                    <div v-for="(premium, index) in AppData.text[currentLanguage].mainstarspage.subscriptions" :key="index"
                        @click="switchPremium(index)"
                        class="select-top-premium-card flex-col gap-4 rounded-12 text-white letter-spacing-04 bg-blue-900 p-12"
                        :class="{ 'select-top-premium-card-active': isPremiumActive(index) }">
                        <div class="custom-radio" :class="{ 'custom-radio-active': isPremiumActive(index) }"></div>
                        <p class="text-16">{{ premium }}</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="select-bottomm flex-col gap-4">
            <p class="pl-12">{{ AppData.text[currentLanguage].mainstarspage.payment }}</p>
            <div class="select-botoom-cards grid-row gap-8">
                <div v-for="(payment, index) in AppData.text[currentLanguage].mainstarspage.paymentmetdods" :key="index"
                    @click="switchPayment(index)"
                    class="select-bottom-card card bg-blue-900 grid-col items-center gap-8"
                    :class="{ 'select-bottom-card-active': isPaymentActive(index) }">
                    <div class="custom-radio" :class="{ 'custom-radio-active': isPaymentActive(index) }"></div>
                    <p class="text-16 text-white">{{ payment }}</p>
                    <img :src="`/src/assets/img/${AppData.text['en'].mainstarspage.paymentmetdods[index].replace(/ /g, '%20')}.svg`" alt="" class="img-28">
                </div>
            </div>
        </div>
        <div class="bottom-button btn bg-gradient-blue flex-col">
            <div class="bottom-button-stars flex-row gap-4 items-center justify-center" :style="{maxHeight: currentType === 0 ? '18px' : '0'}">
                <img src="../assets/img/StarGold.svg" alt="" class="img-16">
                <p class="text-17 font-geist font-600 letter-spacing-04 text-white">{{AppData.text[currentLanguage].mainstarspage.buy}} {{ stars ? stars : 100}}</p>
                <img src="../assets/img/StarGold.svg" alt="" class="img-16">
            </div>
            <div class="bottom-button-prem flex-row gap-4 items-center justify-center" :style="{maxHeight: currentType === 1 ? '18px' : '0'}">
                <p class="text-17 font-geist font-600 letter-spacing-04 text-white">{{AppData.text[currentLanguage].mainstarspage.buyPremium}}</p>
                <img src="../assets/img/StarPremium.svg" alt="" class="img-16">
            </div>
        </div>
    </main>
</template>

<style scoped>
main{
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
    max-width: 100%;
    overflow-x: hidden;
}
.select-top-swith{
    display: grid;
    width: calc(200% + 24px);
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    overflow-y: hidden;
    transition: transform 0.3s ease-in-out, max-height 0.3s ease-in-out;
}
.select-top-item {
    gap: 6px;
}
.select-top-item-input-text {
    padding: 15px 12px;
    border: 0;
    border: 2px solid #00000000;
}
.select-top-item-input-text:focus-visible{
    border: 2px solid var(--blue-500);
    outline: none;
}
.select-top-stars{
    transition: max-height 0.3s ease-in-out;
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
    transition: max-height 0.3s ease-in-out;
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
    gap: 0;
}
.bottom-button-stars{
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
}
.bottom-button-prem{
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
}
</style>