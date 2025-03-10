<script setup>
import MenuModule from './components/MenuModule.vue'
import MainStars from './components/MainStars.vue'
import Tasks from './components/Tasks.vue'
import AboutUs from './components/AboutUs.vue'
import Profile from './components/Profile.vue'
import MadalScreens from './components/MadalScreens.vue'
import WithdrawScreen from './components/WithdrawScreen.vue'
import { ref } from 'vue'
const AppData = {
    langs:{en:'English', ru:'Русский', es:'Español', de:'Deutsch', ar:'فارسی', fa:'العربية'},
    text: {
        en:{
            stars:'Stars',
            premium:'Premium',
            username:'Username',
            example:'@example',
            amount:'Amount',
            min:'min 100',
            subscription:'Subscription',
            months3:'3 months',
            months6:'6 months',
            months12:'12 months',
            payment:'Payment',
            TONNetwork:'TON Network',
            USDT:'USDT',
            SBP:'SBP',
            VISAMasterCard:'VISA & MasterCard',
            buy:'Buy',
            buyPremium:'Buy Premium',
            tasks:'Tasks',
            followinTelegram:'Follow in Telegram',
            start:'Start',
            connectWallet:'Connect Wallet',
            theBestChoiceforPurchasingTelegramStarsandPremium:'The Best Choice for Purchasing Telegram Stars and Premium',
            paywithTONUSDTorcardpayments:'Pay with TON, USDT or card payments.',
            enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired:'Enjoy lower prices than the official Telegram bot with no KYC verification required',
            aboutus:'About us',
            boughttoday:'bought today',
            boughtyesterday:'bought yesterday',
            boughtalltime:'bought all time',
            boughtmonthpremium:'bought month premium',
            FAQ:'FAQ',
        }, 
        ru:{
            stars1:'Stars'
        }, 
        es:{
            stars1:'Stars'
        }, 
        de:{
            stars1:'Stars'
        }, 
        ar:{
            stars1:'Stars'
        }, 
        fa:{
            stars1:'Stars'
        }},
}
const currentScreen = ref(0)
const activeModal = ref(null)
const currentLanguage = ref("en")
const switchScreen = (type) => {currentScreen.value = type}
const toggleModal = (modalName) => {activeModal.value = activeModal.value == modalName ? null : modalName}
const switchLanguage = (lang) => {currentLanguage.value = lang}
</script>

<template>
    <div class="screen" :style="{transform: `translateX(-${currentScreen * 100}vw)`}">
        <div class="screen-item">
            <MainStars />
        </div>
        <div class="screen-item">
            <Tasks />
        </div>
        <div class="screen-item">
            <AboutUs />
        </div>
        <div class="screen-item">
            <Profile :AppData="AppData" :currentLanguage="currentLanguage" :toggleModal="toggleModal" :switchScreen="switchScreen"/>
        </div>
        <div class="screen-item">
            <WithdrawScreen/>
        </div>
    </div>
    <MenuModule :switchScreen="switchScreen" />
    <MadalScreens :AppData="AppData" :currentLanguage="currentLanguage" :activeModal="activeModal" :toggleModal="toggleModal" :switchLanguage="switchLanguage" />
</template>

<style scoped>
    .screen {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: calc(100vw * 5);
        transition: transform 0.3s;
        position: relative;
        height: 100vh;
    }
    .screen-item {
        overflow-x: hidden;
        overflow-y: visible;
        height: calc(100vh - 84px);
        transition: max-height 0.3s;
        width: 100%;
        position: relative;
    }
</style>
