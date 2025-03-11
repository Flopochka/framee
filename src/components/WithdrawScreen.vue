<script setup>
import { ref } from 'vue'
defineProps(['toggleModal', 'currentLanguage'])
</script>

<template>
    <main class="flex-col gap-28 p-24">
        <div class="withdraw-info">
            <p class="text-20 text-white">Your balance</p>
            <p class="text-24 text-white jse">10.23<img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></p>
            <div style="grid-area: C;" class="withdraw-ton-btn btn text-17 text-white letter-spacing-04">Withdraw in TON</div>
            <div style="grid-area: D;" class="withdraw-stars-btn btn"><p class="wis text-17 letter-spacing-04">Withdraw in Stars</p></div>
        </div>
        <div class="referal-info flex-col">
            <p class="text-20 text-white">Your Referals</p>
            <div class="referal-cards gap-8">
                <div class="referal-card-head items-center">
                    <img style="grid-area: A;" src="../assets/img/testuserphoto.png" alt="" class="img-44 rounded-22">
                    <p class="text-20 text-white">Alex Makit</p>
                    <p class="text-16 text-white-60">@alexafani</p>
                </div>
                <div class="referal-card">
                    <img src="../assets/img/TESTReferalPhoto.png" alt="" class="img-16">
                    <p class="text-16">Pavel</p>
                    <p class="text-16">+ 15000<img src="../assets/img/TONMinimal.svg" alt="" class="img-16"></p>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.withdraw-info {
    display: grid;
    grid-template-areas: "A B" "C C" "D D";
    gap: 20px;
}
.withdraw-ton-btn {
    background: var(--but-blue-2);
}
.withdraw-stars-btn {
    background: var(--white-100);
}
.wis{
    display: table;
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.referal-info {
    gap: 13px;
}
.text-16 {
}
.referal-cards {
    display: grid;
    grid-template-rows: auto 1fr;
    border-radius: 14px;
    background: var(--Surface-white-5, #FFFFFF0D);
    overflow: hidden;
    padding-bottom: 16px;
}
.referal-card-head {
    background: var(--Surface-white-10, #FFFFFF1A);
    padding: 14px 12px;
    display: grid;
    grid-template-areas: "A B""A C";
    justify-content: start;
    gap: 12px;
}
.referal-card {
    padding: 0 16px;
}
</style>