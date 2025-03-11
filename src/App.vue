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
            mainstarspage:{
                stars:'Stars',
                premium:'Premium',
                username:'Username',
                amount:'Amount',
                subscription:'Subscription',
                subscriptions:[
                    '3 months',
                    '6 months',
                    '12 months',
                ],
                payment:'Payment',
                paymentmetdods:[
                    'TON Network',
                    'USDT',
                    'SBP',
                    'VISA & MasterCard',
                ],
                buy:'Buy',
                buyPremium:'Buy Premium',
            },
            taskspage:{
                tasks:'Tasks',
                followinTelegram:'Follow in Telegram',
                start:'Start',
            },
            aboutuspage:{
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
                FAQData:[
                    ['Why are your prices up to 39.7% lower?','When purchasing Telegram Stars & Premium through the Telegram app, the price includes Apple/Google Store commissions of approximately 40%. By using our service, you bypass these fees and get a better deal.'],
                    ['What is the commission for purchasing through FRAME?','All prices listed in our Telegram service @FrameStars_Bot and on our website are final. The only additional cost is a small network fee when transferring funds.'],
                    ['What payment methods do you accept?','We accept payments in TON, USDT, and bank cards. Choose the most convenient option during checkout.'],
                    ['How long does the delivery take?','Orders are typically processed instantly. In rare cases, it may take a few minutes. If your purchase hasn\'t arrived, please check your transaction details or contact our @framestars_support.'],
                    ['What happens if my purchase doesn’t arrive?','If you haven\'t received your Stars or Premium subscription within a reasonable time, please reach out to our @framestars_support with your payment details. We’ll assist you as quickly as possible.'],
                    ['Is it safe to buy from FRAME?','Yes, our service is secure and reliable. We process transactions without requiring personal data, ensuring privacy and safety.'],
                    ['How can I send Stars to a friend?','Simply enter the recipient’s Telegram @username during the purchase process, and the Stars or Premium subscription will be sent directly to their account.'],
                    ['How can I get Telegram Stars for free?','Our task page is currently in development. Soon, you’ll be able to earn Stars by watching short promotional videos.']
                ],
            },
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
            <MainStars :AppData="AppData" :currentLanguage="currentLanguage"/>
        </div>
        <div class="screen-item">
            <Tasks :AppData="AppData" :currentLanguage="currentLanguage"/>
        </div>
        <div class="screen-item">
            <AboutUs :AppData="AppData" :currentLanguage="currentLanguage"/>
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
