<script setup>
import { useLanguageStore } from '../../stores/language'
import { useModalStore } from '../../stores/modal'

const { toggleModal } = useModalStore()
const { getTranslation } = useLanguageStore()

defineProps({
  title: String,
  message: String,
  closeText: String
})
</script>

<template>
  <div class="popup-img flex-row items-center justify-center">
    <img src="../../assets/img/Copy.svg" alt="" class="img-32 lazy-img" />
  </div>
  <div class="popup-block flex-col">
    <p class="text-16 text-white">
      {{ title || getTranslation('taskCompleted') }}
    </p>
    <p class="text-14 font-400 text-neutral-300 lh-120">
      {{ message || getTranslation('rewardWillBeCreditedWithin10Minutes') }}
    </p>
    <div
      @click="toggleModal(null)"
      class="popup-btn letter-spacing-04 font-600 btn rounded-12 cupo usen"
    >
      {{ closeText || getTranslation('Close') }}
    </div>
  </div>
</template>

<style scoped></style>
