<script setup>
import { ref } from 'vue'
defineProps(['AppData', 'toggleModal', 'currentLanguage', 'switchScreen'])
</script>

<template>
    <main class="gap-28 p-24">
        <div class="user-stat-box rounded-12">
            <p class="text-16">{{ AppData.text[currentLanguage].profilepage.totalUsers }}</p>
            <p class="text-16">{{ AppData.text[currentLanguage].profilepage.totalEarnings }}</p>
            <p class="text-20 lh-120 flex-row items-center justify-center gap-4">
                3
                <img src="../assets/img/People.svg" alt="" class="img-24">
            </p>
            <p class="text-20 lh-120 flex-row items-center justify-center">
                2.33
                <img src="../assets/img/TONMinimal.svg" alt="" class="img-20">
            </p>
            <div @click="switchScreen(4)" class="user-stat-box-btn btn rounded-8">
                <p class="user-stat-box-btn-text text-14 lh-22">{{ AppData.text[currentLanguage].profilepage.Withdraw }}</p>
            </div>
        </div>
        <div class="user-referal-box">
            <p class="user-referal-box-header text-12 tac lh-22">{{ AppData.text[currentLanguage].profilepage.Invitefriendsandearn5fromtheirpurchases }}</p>
            <div class="user-referal-box-btn-invite flex-row gap-4 rounded-12 items-center justify-center">
                <img src="../assets/img/Gift.svg" alt="" class="img-16">
                <p class="text-17 text-white">{{ AppData.text[currentLanguage].profilepage.Inviteafriend }}</p>
            </div>
            <div class="user-referal-box-btn-copy rounded-12 items-center justify-center flex-row">
                <img src="../assets/img/Copy.svg" alt="" class="img-28">
            </div>
        </div>
        <div class="user-buttons-1 flex-col gap-8">
            <div @click="toggleModal('history')" class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center">
                <p class="text-16 text-neutral-200">{{ AppData.text[currentLanguage].profilepage.History }}</p>
                <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90">
            </div>
            <div class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center">
                <p class="text-16 text-neutral-200">{{ AppData.text[currentLanguage].profilepage.Support }}</p>
                <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90">
            </div>
            <div class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center">
                <p class="text-16 text-neutral-200">{{ AppData.text[currentLanguage].profilepage.OurTelegram }}</p>
                <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90">
            </div>
        </div>
        <div class="user-language flex-col gap-6">
            <p class="text-14 pl-12">{{ AppData.text[currentLanguage].profilepage.Language }}</p>
            <div @click="toggleModal('lang')" class="user-language-item rounded-10 bg-blue-900 flex-row items-center">
                <p class="text-16 text-neutral-200">{{ AppData.langs[currentLanguage] }}</p>
                <img src="../assets/img/Arrow down.svg" alt="" class="img-24">
            </div>
        </div>
    </main>
</template>

<style scoped>
.user-stat-box {
    padding: 28px 16px 12px 16px;
    display: grid;
    grid-template-areas: "A B" "C D" "E E";
    align-items: center;
    justify-items: center;
    gap: 6px;
    background: url("../assets/img/card.svg") no-repeat center, linear-gradient(90deg, #133E67 0%, #0F497D 100%);
    background-size: contain;
}
.user-stat-box-btn {
    grid-area: E;
    width: 100%;
    background: var(--white-100);
    box-shadow: 0px 2px 6px 0px #10141C40;
    padding: 15px 12px;
    margin-top: 30px;
}
.user-stat-box-btn-text{
    display: table;
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #0B2349;
    display: table;
}
.user-referal-box {
    display: grid;
    grid-template-areas: "A A""B C";
    grid-template-columns: 1fr auto;
    gap: 8px;
    position: relative;
}
.user-referal-box::after{
    content: "";
    position: absolute;
    width: 80%;
    height: 1px;
    background: var(--blue-900-60);
    bottom: -14px;
    left: 10%;
}
.user-referal-box-header{
    grid-area: A;
}
.user-referal-box-btn-invite {
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
    box-shadow: 0px 9px 20.2px 0px #10141C1A;
    padding: 15px 12px;
}
.user-referal-box-btn-copy {
    padding: 13px;
    background: var(--white-100);
}
.user-buttons-1 {
    
}
.user-buttons-1-item {
    justify-content: space-between;
    padding: 12px;
}
.user-language {
}
.user-language-item {
    justify-content: space-between;
    padding: 12px;
}
</style>