<script setup>
import { ref } from 'vue'
</script>

<template>
    <main class="flex-col gap-28 p-24">
        <p class="text-20 text-white">Tasks</p>
        <div class="tasks-cards flex-col gap-8">
            <div class="task-card bg-blue-900 rounded-12 items-center">
                <p class="text-16 text-white">Follow in Telegram</p>
                <div class="task-btn rounded-8 lh-22 letter-spacing-04 text-white">Start</div>
                <p class="text-14 text-white">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    0.15
                </p>
            </div>
            <div class="task-card bg-blue-900 rounded-12 items-center">
                <p class="text-16 text-white">Follow in Telegram</p>
                <div class="task-btn rounded-8 lh-22 letter-spacing-04 text-white">Start</div>
                <p class="text-14 text-white">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    0.15
                </p>
            </div>
            <div class="task-card bg-blue-900 rounded-12 items-center">
                <p class="text-16 text-white">Follow in Telegram</p>
                <div class="task-btn rounded-8 lh-22 letter-spacing-04 text-white">Start</div>
                <p class="text-14 text-white">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    0.15
                </p>
            </div>
            <div class="task-card bg-blue-900 rounded-12 items-center">
                <p class="text-16 text-white">Follow in Telegram</p>
                <div class="task-btn rounded-8 lh-22 letter-spacing-04 text-white">Start</div>
                <p class="text-14 text-white">
                    <img src="../assets/img/Star.svg" alt="" class="img-16">
                    0.15
                </p>
            </div>
        </div>
    </main>
</template>

<style scoped>
main{
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: calc(84px + 24px);
    width: 100%;
    display: grid;
    grid-template-rows: repeat(3, auto) 1fr;
    align-items: end;
}
.task-card {
    padding: 14px 12px;
    display: grid;
    grid-template-areas: "A B" "C B";
}
.task-btn {
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
    padding: 4px 11px;
    grid-area: B;
    width: fit-content;
    justify-self: end;
}
</style>