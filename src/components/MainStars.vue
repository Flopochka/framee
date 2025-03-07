<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})
</script>

<template>
    <main>
        <div class="select-type">
            <div class="select-type-item select-type-item-selected">
                Stars
                <img src="../assets/3456345345345345.png" alt="" class="select-type-item-img">
            </div>
            <div class="select-type-item">
                Premium
                <img src="../assets/23765848672354867236548723.png" alt="" class="select-type-item-img">
            </div>
        </div>
        <div class="select-top select-top-1">
            <div class="select-top-item">
                <p class="select-top-item-text">Username</p>
                <input type="text" class="select-top-item-input-text" placeholder="@example">
            </div>
            <div class="select-top-item">
                <p class="select-top-item-text">Username</p>
                <input type="text" class="select-top-item-input-text" placeholder="@example">
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
            <p class="select-bottom-text">Payment</p>
            <div class="select-botoom-cards">
                <div class="select-bottom-card select-bottom-card-active">
                    <div class="select-bottom-card-custom-radio select-bottom-card-custom-radio-active"></div>
                    <p class="select-bottom-card-text">TON Network</p>
                    <img src="" alt="" class="select-bottom-card-img">
                </div>
                <div class="select-bottom-card">
                    <div class="select-bottom-card-custom-radio"></div>
                    <p class="select-bottom-card-text">USDT</p>
                    <img src="" alt="" class="select-bottom-card-img">
                </div>
                <div class="select-bottom-card">
                    <div class="select-bottom-card-custom-radio"></div>
                    <p class="select-bottom-card-text">SBP</p>
                    <img src="" alt="" class="select-bottom-card-img">
                </div>
                <div class="select-bottom-card">
                    <div class="select-bottom-card-custom-radio"></div>
                    <p class="select-bottom-card-text">VISA & MasterCard</p>
                    <img src="" alt="" class="select-bottom-card-img">
                </div>
            </div>
        </div>
        <div class="bottom-button">
            <img src="../assets/3456345345345345.png" alt="" class="bottom-button-img">
            <p class="bottom-button-text">Buy 3 500</p>
            <img src="../assets/3456345345345345.png" alt="" class="bottom-button-img">
        </div>
    </main>
</template>

<style scoped>
main{
    box-sizing: border-box;
    min-height: calc(100vh - 100px);
    width: 100%;
    padding: 24px;
    gap: 28px;
    display: flex;
    flex-direction: column;
}
.select-type {
    width: 100%;
    display: flex;
    gap: 4px;
    background: var(--dark-blue3);
    border-radius: 10px;
    padding: 2px;
}
.select-type-item {
    width: 100%;
    color: var(--contrast);
    padding: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}
.select-type-item-selected {
    background: var(--blue3);
}
.select-type-item-img {
    height: 16px;
}
.select-top {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.select-top-1 {
}
.select-top-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.select-top-item-text{
    padding-left: 12px;
}
.select-top-item-input-text {
    border-radius: 12px;
    padding: 15px 12px;
    background: #EBEEF3;
    border: 0;
    font-size: 14px;
}
.select-top-stars-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
.select-top-stars-card {
    width: 100%;
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 12px;
    gap: 4px;
    border-radius: 12px;
    color: var(--contrast);
    box-shadow: 0px 2px 6px 0px #10141C40;
    letter-spacing: -0.4px;
    line-height: 22px;
}
.select-top-stars-card-img {
    height: 16px;
}
.select-bottom {
}
.select-bottom-text {
    padding-left: 12px;
}
.select-botoom-cards {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;

}
.select-bottom-card {
    width: 100%;
    background: #133E67;
    border-radius: 10px;
    padding: 12px;
    display: grid;
    align-items: center;
    grid-template-columns: auto auto 1fr;
    gap: 8px;
}
.select-bottom-card-active {
    border: 2px solid var(--System-azure-700-80, #007AFFCC)
}
.select-bottom-card-custom-radio {
    width: 18px;
    height: 18px;
    border: 2px solid var(--text-icons-neutral-300, #B0B5BA);
    border-radius: 50%;
}
.select-bottom-card-active .select-bottom-card-custom-radio{
    border: 2px solid var(--System-azure-700, #007AFF);
    position: relative;
}
.select-bottom-card-active .select-bottom-card-custom-radio::after{
    content: "";
    display: block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #007AFF;
    position: absolute;
    left: calc(50% - 4.5px);
    top: calc(50% - 4.5px);
}
.select-bottom-card-text {
    font-size: 16px;
}
.select-bottom-card-active .select-bottom-card-text{
    color: var(--contrast);
}
.select-bottom-card-img {
}
.bottom-button {
    width: 100%;
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
    width: 354;
    min-width: 50px;
    padding: 15px 12px;
    gap: 4px;
    border-radius: 12px;
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
}
.bottom-button-img {
    height: 16px;
}
.bottom-button-text {
    font-size: 17px;
    font-family: Geist;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: var(--contrast);
}
</style>
