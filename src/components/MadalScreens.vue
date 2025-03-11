<script setup>
import { ref } from 'vue'
defineProps(['AppData', 'activeModal', 'toggleModal', 'currentLanguage', 'switchLanguage'])
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
                <div v-for="(label, key) in AppData.langs"
                    :key="key"
                    @click="switchLanguage(key)"
                    class="lang-select-card flex-row" >
                    <p class="text-16">{{ label }}</p>
                    <img src="../assets/img/Check.svg" :alt="currentLanguage !== key ? 'Галочки нет' : 'Галочка'" class="img-24" :class="{ hidden: currentLanguage !== key }" />
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
        <div @click.stop class="user-history-body madal-screen-body madal-screen-body-high">
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
    <div @click="toggleModal(null)" class="withdrawton madal-screen" :class="{ 'madal-active': activeModal == 'withdrawton' }">
        <div @click.stop class="withdrawton-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">Your balance: 10.23 <img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="withdrawton-body madal-screen-body madal-screen-body-high jcsb">
            <div class="withdraw-inputs flex-col gap-8">
                <p class="pl-12 text-14">Ammount</p>
                <input v-model.number="stars"  type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="Min 0.3" min="0.3" max="1000000">
                <p class="pl-12 text-14">Wallet</p>
                <input v-model.number="stars"  type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@UQA63stAKU17GZ80mcHctRX3DBSbm4Ks_dBwGiX9JTrIAi2">
                <div class="withdraw-info gap-12">
                    <p style="grid-area: A;" class="text-16 text-white">You get</p>
                    <p class="text-24 text-white">0.35 TON</p>
                    <p class="text-14 text-white-60 jse">Fee  0.3 TON</p>
                </div>
            </div>
            <div @click="toggleModal('popupwalletnc')" class="withdraw-btn btn text-17">Withdraw in TON</div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="withdrawstars madal-screen" :class="{ 'madal-active': activeModal == 'withdrawstars' }">
        <div @click.stop class="withdrawstars-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">Your balance: 10.23 <img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="withdrawstars-body madal-screen-body madal-screen-body-high jcsb">
            <div class="withdraw-inputs flex-col gap-8">
                <p class="pl-12 text-14">Ammount</p>
                <input v-model.number="stars"  type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="Min 100" min="100" max="1000000">
                <p class="pl-12 text-14">Username</p>
                <input v-model.number="stars"  type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@example">
                <div class="withdrawton-info gap-12">
                    <p style="grid-area: A;" class="text-16 text-white">You get for 0.3 TON ≈</p>
                    <p class="text-24 text-white">100 <img src="../assets/img/Star.svg" alt="" class="img-20"></p>
                    <p class="text-14 text-white-60 jse">Fee  0.3 TON</p>
                </div>
            </div>
            <div @click="toggleModal('popupstars')" class="withdraw-btn btn text-17">Withdraw in Stars</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': activeModal == 'popupstars' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white">Stars have been sent</p>
            <p class="text-14 lh-120">Your account will be updated within a few minutes</p>
            <div @click="toggleModal(null)" class="popup-btn btn rounded-12">Close</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': activeModal == 'popuppremium' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white">Premium have been sent</p>
            <p class="text-14 lh-120">Your account will be updated within a few minutes</p>
            <div @click="toggleModal(null)" class="popup-btn btn rounded-12">Close</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': activeModal == 'popupwalletnc' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white">Wallet not connected</p>
            <p class="text-14 lh-120">Please connect your TON wallet on the main page to start purchasing</p>
            <div @click="toggleModal(null)" class="popup-btn btn rounded-12">Close</div>
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