<script setup>
import { ref } from 'vue'
defineProps(['AppData', 'currentLanguage'])
</script>

<template>
    <main class="gap-28 p-24">
        <p class="text-20 text-white">{{AppData.text[currentLanguage].taskspage.tasks}}</p>
        <div class="tasks-cards flex-col gap-8">
            <div v-for="i in [0, 0, 0, 0]" class="task-card bg-blue-900 rounded-12 items-center">
                <p class="text-16 text-white">{{AppData.text[currentLanguage].taskspage.followinTelegram}}</p>
                <div class="task-btn rounded-8 lh-22 letter-spacing-04 text-white">{{AppData.text[currentLanguage].taskspage.start}}</div>
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