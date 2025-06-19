<script setup>
import { ref, onMounted } from "vue";
import { sendToBackend } from "../../modules/fetch";
import { useUserStore } from "../../stores/user";

const traffyTasks = ref(null);
const userStore = useUserStore();

function onTaskLoad(tasks) {
  console.log("[traffy] Tasks loaded:", tasks);
}

function onTaskRender(
  changeReward,
  changeCardTitle,
  changeDescription,
  changeButtonCheckText
) {
  changeReward("200K");
  changeCardTitle("Subscribe on: ");
  changeButtonCheckText("Check");
}

async function onTaskReward(task, signedToken) {
  try {
    const payload = {
      user_id: userStore.getUserId(),
      task_id: task.id,
      signed_token: signedToken
    };
    
    const result = await sendToBackend("/verify_traffy_task", payload);
    
    if (result.status === "success") {
      console.log("[traffy] Task verified successfully");
      // Здесь можно добавить обновление баланса или другие действия
    } else {
      console.error("[traffy] Task verification failed:", result.message);
    }
  } catch (error) {
    console.error("[traffy] Error verifying task:", error);
  }
}

function onTaskReject(task) {
  console.log("[traffy] Task rejected:", task);
}

onMounted(() => {
  const traffyTasksVal = traffyTasks.value;
  if(traffyTasksVal) {
    window.Traffy.renderTasks(
      traffyTasksVal,
      {
        max_tasks: 3,
        onTaskLoad,
        onTaskRender,
        onTaskReward,
        onTaskReject
      }
    );
  }
});
</script>

<template>
  <div class="traffyTasks" ref="traffyTasks"></div>
</template>

<style scoped>
.traffyTasks {
  width: 100%;
  min-height: 200px;
}
</style> 