<script setup>
import { ref } from 'vue'
defineProps(['activeModal', 'toggleModal', 'currentLanguage', 'switchLanguage'])
</script>

<template>
    <div @click="toggleModal(null)" class="lang-menu madal-screen" :class="{ 'madal-active': activeModal == 'lang' }">
        <div @click.stop class="lang-menu-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">System language</p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="lang-menu-body madal-screen-body">
            <div class="lang-select-cards">
                <div @click="switchLanguage('English')" class="lang-select-card flex-row">
                    <p class="text-16">English</p>
                    <img src="../assets/img/Check.svg" alt="" class="img-24" :class="{ 'hidden': currentLanguage != 'English' }">
                </div>
                <div @click="switchLanguage('Русский')" class="lang-select-card flex-row">
                    <p class="text-16">Русский</p>
                    <img src="../assets/img/Check.svg" alt="" class="img-24" :class="{ 'hidden': currentLanguage != 'Русский' }">
                </div>
                <div @click="switchLanguage('Español')" class="lang-select-card flex-row">
                    <p class="text-16">Español</p>
                    <img src="../assets/img/Check.svg" alt="" class="img-24" :class="{ 'hidden': currentLanguage != 'Español' }">
                </div>
                <div @click="switchLanguage('Deutsch')" class="lang-select-card flex-row">
                    <p class="text-16">Deutsch</p>
                    <img src="../assets/img/Check.svg" alt="" class="img-24" :class="{ 'hidden': currentLanguage != 'Deutsch' }">
                </div>
                <div @click="switchLanguage('فارسی')" class="lang-select-card flex-row">
                    <p class="text-16">فارسی</p>
                    <img src="../assets/img/Check.svg" alt="" class="img-24" :class="{ 'hidden': currentLanguage != 'فارسی' }">
                </div>
                <div @click="switchLanguage('العربية')" class="lang-select-card flex-row">
                    <p class="text-16">العربية</p>
                    <img src="../assets/img/Check.svg" alt="" class="img-24" :class="{ 'hidden': currentLanguage != 'العربية' }">
                </div>
            </div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="user-history madal-screen" :class="{ 'madal-active': activeModal == 'history' }">
        <div @click.stop class="user-history-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">History:</p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="user-history-body madal-screen-body">
            <p class="text-14 pl-12">Apr, 17</p>
            <div class="history-cards flex-col rounded-24">
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/stargold.svg" alt="" class="img-20"></div>
                    <p class="text-14">Buy 100 Stars for @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/starpremium.svg" alt="" class="img-20"></div>
                    <p class="text-14">Buy Premium 3 months for @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></div>
                    <p class="text-14">Withdraw 24.02 TON</p>
                </div>
            </div>
            <p class="text-14 pl-12">Apr, 17</p>
            <div class="history-cards flex-col rounded-24">
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/stargold.svg" alt="" class="img-20"></div>
                    <p class="text-14">Buy 100 Stars for @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/starpremium.svg" alt="" class="img-20"></div>
                    <p class="text-14">Buy Premium 3 months for @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></div>
                    <p class="text-14">Withdraw 24.02 TON</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lang-select-cards {
}
.lang-select-card {
    justify-content: space-between;
    padding: 12px 6px 12px 0;
}
.user-history-body {
    gap: 8px;
}
.history-cards {
    background: var(--Surface-white-5, #FFFFFF0D);
    padding: 16px;
    margin-bottom: 12px;
    gap: 8px;
}
.history-card {
    gap: 8px;
}
.history-img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background: var(--Surface-white-20, #FFFFFF33);
}
</style>