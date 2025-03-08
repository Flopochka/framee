<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})
</script>

<template>
    <main class="flex-col gap-28 p-24">
        <div class="select-type flex-row gap-4 bg-blue-900 rounded-10 p-2">
            <div class="select-type-item select-type-item-selected flex-row items-center justify-center gap-4 text-white p-6 rounded-8 bg-blue-500">
                Stars
                <img src="../assets/3456345345345345.png" alt="" class="img-16">
            </div>
            <div class="select-type-item flex-row items-center justify-center gap-4 text-white p-6 rounded-8 bg-blue-500">
                Premium
                <img src="../assets/23765848672354867236548723.png" alt="" class="img-16">
            </div>
        </div>
        <div  class="select-top select-top-1 flex-col gap-16">
            <div class="select-top-item flex-col gap-6">
                <p class="pl-12">Username</p>
                <input type="text" class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-14" placeholder="@example">
            </div>
            <div class="select-top-item flex-col gap-6">
                <p class="pl-12">Username</p>
                <input type="text" class="select-top-item-input-text rounded-12 bg-neutral-200 text-neutral-700 text-14" placeholder="@example">
            </div>
            <div class="select-top-item select-top-stars-box">
                <div class="select-top-stars-card">
                    +100
                    <img src="../assets/23764287462837648237462897342985.png" alt="" class="select-top-stars-card-img">
                </div>
                <div class="select-top-stars-card">
                    +1 000
                    <img src="../assets/23764287462837648237462897342985.png" alt="" class="select-top-stars-card-img">
                </div>
                <div class="select-top-stars-card">
                    +10 000
                    <img src="../assets/23764287462837648237462897342985.png" alt="" class="select-top-stars-card-img">
                </div>
            </div>
        </div>
        <div class="select-bottom">
            <p class="pl-12">Payment</p>
            <div class="select-botoom-cards grid-row gap-8">
                <div class="select-bottom-card select-bottom-card-active card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio custom-radio-active"></div>
                    <p class="text-16 text-contrast">TON Network</p>
                    <img src="" alt="" class="img-16">
                </div>
                <div class="select-bottom-card card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio"></div>
                    <p class="text-16 text-contrast">USDT</p>
                    <img src="" alt="" class="img-16">
                </div>
                <div class="select-bottom-card card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio"></div>
                    <p class="text-16 text-contrast">SBP</p>
                    <img src="" alt="" class="img-16">
                </div>
                <div class="select-bottom-card card bg-blue-900 grid-col items-center gap-8">
                    <div class="custom-radio"></div>
                    <p class="text-16 text-contrast">VISA & MasterCard</p>
                    <img src="" alt="" class="img-16">
                </div>
            </div>
        </div>
        <div class="bottom-button btn bg-gradient-blue">
            <img src="../assets/3456345345345345.png" alt=""  class="img-16">
            <p class="text-17 font-geist font-600 letter-spacing-04 text-white">Buy 3 500</p>
            <img src="../assets/3456345345345345.png" alt=""  class="img-16">
        </div>
    </main>
</template>

<style scoped>
main{
    box-sizing: border-box;
    min-height: calc(100vh - 100px);
    width: 100%;
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
}
.select-top-1 {
}
.select-top-item {
    gap: 6px;
}
.select-top-item-input-text {
    padding: 15px 12px;
    border: 0;
}
.select-top-stars-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
.select-top-stars-card {
    width: 100%;
    background: linear-gradient(129.45deg, var(--blue-400) 9.38%, var(--but-blue-1) 117.65%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 12px;
    gap: 4px;
    border-radius: 12px;
    color: var(--white-100);
    box-shadow: 0px 2px 6px 0px var(--shadow-25);
    letter-spacing: -0.4px;
    line-height: 22px;
}
.select-top-stars-card-img {
    height: 16px;
}
.select-bottom {
}
.select-botoom-cards {
    grid-template-rows: repeat(4, 1fr);
}
.select-bottom-card {
    width: 100%;
    grid-template-columns: auto auto 1fr;
}
.select-bottom-card-active {
    border: 2px solid var(--System-azure-700-80, #007AFFCC)
}
.bottom-button {
    width: 100%;
    background: linear-gradient(129.45deg, var(--blue-400) 9.38%, var(--blue-600) 117.65%);
}
.bottom-button-img {
    height: 16px;
}
</style>
