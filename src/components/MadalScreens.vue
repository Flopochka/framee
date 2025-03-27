<script setup>
import { useLanguageStore } from '../stores/language';
import { useModalStore } from "../stores/modal";

const { toggleModal, activeModal, getActiveModal } = useModalStore();
const {getTranslation, switchLanguage, langs, getCurrentLanguage} = useLanguageStore();
</script>

<template>
    <div @click="toggleModal(null)" class="lang-menu madal-screen" :class="{ 'madal-active': getActiveModal() == 'lang' }">
        <div @click.stop class="lang-menu-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">{{ getTranslation('Systemlanguage') }}</p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="lang-menu-body madal-screen-body">
            <div class="lang-select-cards">
                <div v-for="(label, key) in langs"
                    :key="key"
                    @click="switchLanguage(key)"
                    class="lang-select-card flex-row" >
                    <p class="text-16">{{ label }}</p>
                    <img src="../assets/img/Check.svg" :alt="getCurrentLanguage() === key ? 'Галочки нет' : 'Галочка'" class="img-24" :class="{ hidden: getCurrentLanguage() !== key }" />
                </div>
            </div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="user-history madal-screen" :class="{ 'madal-active': getActiveModal() == 'history' }">
        <div @click.stop class="user-history-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">{{ getTranslation('History') }}</p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="user-history-body madal-screen-body madal-screen-body-high">
            <p class="text-14 pl-12">{{ getTranslation('Apr') }}, 17</p>
            <div class="history-cards flex-col rounded-24">
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/Stargold.svg" alt="" class="img-20"></div>
                    <p class="text-14">{{ getTranslation('Buy') }} 100 {{ getTranslation('Stars') }} {{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/Starpremium.svg" alt="" class="img-20"></div>
                    <p class="text-14">{{ getTranslation('Buy') }} {{ getTranslation('Premium3months') }} {{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></div>
                    <p class="text-14">{{ getTranslation('Withdraw') }} 24.02 TON</p>
                </div>
            </div>
            <p class="text-14 pl-12">{{ getTranslation('Apr') }}, 17</p>
            <div class="history-cards flex-col rounded-24">
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/Stargold.svg" alt="" class="img-20"></div>
                    <p class="text-14">{{ getTranslation('Buy') }} 100 {{ getTranslation('Stars') }} {{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/Starpremium.svg" alt="" class="img-20"></div>
                    <p class="text-14">{{ getTranslation('Buy') }} {{ getTranslation('Premium3months') }} {{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></div>
                    <p class="text-14">{{ getTranslation('Withdraw') }} 24.02 TON</p>
                </div>
            </div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="withdrawton madal-screen" :class="{ 'madal-active': getActiveModal() == 'withdrawton' }">
        <div @click.stop class="withdrawton-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">{{ getTranslation('Yourbalance') }}: 10.23 <img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="withdrawton-body madal-screen-body madal-screen-body-high jcsb">
            <div class="withdraw-inputs flex-col gap-8">
                <p class="pl-12 text-14">{{ getTranslation('Ammount') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="Min 0.3" min="0.3" max="1000000">
                <p class="pl-12 text-14">{{ getTranslation('Wallet') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@UQA63stAKU17GZ80mcHctRX3DBSbm4Ks_dBwGiX9JTrIAi2">
                <div class="withdraw-info gap-12">
                    <p style="grid-area: A;" class="text-16 text-white">{{ getTranslation('Youget') }}</p>
                    <p class="text-24 text-white">0.35 TON</p>
                    <p class="text-14 text-white-60 jse">{{ getTranslation('Fee') }}  0.3 TON</p>
                </div>
            </div>
            <div @click="toggleModal('popupwalletnc')" class="withdraw-btn btn text-17">{{ getTranslation('WithdrawinTON') }}</div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="withdrawstars madal-screen" :class="{ 'madal-active': getActiveModal() == 'withdrawstars' }">
        <div @click.stop class="withdrawstars-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">{{ getTranslation('Yourbalance') }}: 10.23 <img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="withdrawstars-body madal-screen-body madal-screen-body-high jcsb">
            <div class="withdraw-inputs flex-col gap-8">
                <p class="pl-12 text-14">{{ getTranslation('Ammount') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="Min 100" min="100" max="1000000">
                <p class="pl-12 text-14">{{ getTranslation('Username') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@example">
                <div class="withdrawton-info gap-12">
                    <p style="grid-area: A;" class="text-16 text-white">{{ getTranslation('Yougetfor') }} 0.3 TON ≈</p>
                    <p class="text-24 text-white">100 <img src="../assets/img/Star.svg" alt="" class="img-20"></p>
                    <p class="text-14 text-white-60 jse">{{ getTranslation('Fee') }}  0.3 TON</p>
                </div>
            </div>
            <div @click="toggleModal('popupstars')" class="withdraw-btn btn text-17">{{ getTranslation('WithdrawinStars') }}</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': getActiveModal() == 'popupstars' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white">{{ getTranslation('Starshavebeensent') }}</p>
            <p class="text-14 lh-120">{{ getTranslation('Youraccountwillbeupdatedwithinafewminutes') }}</p>
            <div @click="toggleModal(null)" class="popup-btn btn rounded-12">{{ getTranslation('Close') }}</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': getActiveModal() == 'popuppremium' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white">{{ getTranslation('Premiumhavebeensent') }}</p>
            <p class="text-14 lh-120">{{ getTranslation('Youraccountwillbeupdatedwithinafewminutes') }}</p>
            <div @click="toggleModal(null)" class="popup-btn btn rounded-12">{{ getTranslation('Close') }}</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': getActiveModal() == 'popupwalletnc' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white">{{ getTranslation('Walletnotconnected') }}</p>
            <p class="text-14 lh-120">{{ getTranslation('PleaseconnectyourTONwalletonthemainpagetostartpurchasing') }}</p>
            <div @click="toggleModal(null)" class="popup-btn btn rounded-12">{{ getTranslation('Close') }}</div>
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
.withdraw-inp {
    padding: 15px 12px;
    border: 0;
    border: 2px solid #00000000;
}
.withdraw-inp:focus-visible{
    border: 2px solid var(--blue-500);
    outline: none;
}
.withdraw-info{
    display: grid;
    grid-template-areas: "A A""B C";
}
.withdraw-btn{
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
}
.popup-block {
}
.popup-btn {
}
</style>