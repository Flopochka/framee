<script setup>
import { ref, nextTick, onUnmounted } from 'vue'
import { useModalStore } from '../stores/modal'

const { toggleModal } = useModalStore()

const props = defineProps({
  modalId: {
    type: String,
    required: true
  }
})

// Modal refs & state
const modalBody = ref(null)
const modalHeight = ref('auto')
const isDragging = ref(false)
const startY = ref(0)
const currentHeight = ref(0)
const isFullScreen = ref(false)
const defaultHeight = ref(0)

// Convert vh to px
const vhToPx = (vh) => (vh * window.innerHeight) / 100
const maxHeight = vhToPx(80)
const minHeight = vhToPx(0)

// Drag start
const startDragging = async (event) => {
  isDragging.value = true
  startY.value = event.clientY || event.touches[0].clientY

  await nextTick()
  const el = modalBody.value
  if (!el) return

  if (modalHeight.value === 'auto') {
    const computedHeight = el.offsetHeight
    defaultHeight.value = computedHeight
    currentHeight.value = computedHeight
    modalHeight.value = computedHeight
  } else {
    currentHeight.value = modalHeight.value
  }

  el.style.transition = 'none'
  el.style.maxHeight = 'none'

  attachListeners()
}

// Drag move
const onDrag = (event) => {
  if (!isDragging.value) return

  const currentY = event.clientY || event.touches[0].clientY
  const deltaY = startY.value - currentY
  let newHeight = currentHeight.value + deltaY

  newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))
  modalHeight.value = newHeight

  startY.value = currentY
  currentHeight.value = newHeight
}

// Drag stop
const stopDragging = () => {
  if (!isDragging.value) return
  isDragging.value = false

  const el = modalBody.value
  if (!el) return

  el.style.transition = 'height 0.3s ease'

  if (isFullScreen.value) {
    const closeThreshold =
      (maxHeight - currentHeight.value) / (maxHeight - minHeight)
    if (closeThreshold > 0.2) {
      modalHeight.value = minHeight
      setTimeout(() => {
        toggleModal(null)
        resetHeight()
      }, 300)
    } else {
      modalHeight.value = maxHeight
    }
  } else {
    const openThreshold =
      (currentHeight.value - defaultHeight.value) /
      (maxHeight - defaultHeight.value)
    const closeThreshold =
      (defaultHeight.value - currentHeight.value) /
      (defaultHeight.value - minHeight)

    if (openThreshold > 0.2) {
      modalHeight.value = maxHeight
      isFullScreen.value = true
    } else if (closeThreshold > 0.2) {
      modalHeight.value = minHeight
      setTimeout(() => {
        toggleModal(null)
        resetHeight()
      }, 300)
    } else {
      modalHeight.value = defaultHeight.value
      isFullScreen.value = false
    }
  }

  currentHeight.value = modalHeight.value
  detachListeners()
}

// Reset height
const resetHeight = () => {
  modalHeight.value = 'auto'
  currentHeight.value = 0
  defaultHeight.value = 0
  isFullScreen.value = false

  const el = modalBody.value
  if (el) {
    el.style.transition = 'height 0.3s ease'
    el.style.maxHeight = null
  }
}

// Handle listeners
const attachListeners = () => {
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('mouseup', stopDragging)
  document.addEventListener('touchend', stopDragging)
}

const detachListeners = () => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDragging)
  document.removeEventListener('touchend', stopDragging)
}

onUnmounted(() => {
  detachListeners()
})
</script>

<template>
  <div @click.stop class="madal-screen-head items-start cude">
    <div
      class="madal-screen-swipka"
      @mousedown="startDragging"
      @touchstart="startDragging"
    ></div>
    <span>
      <div class="text-20 madal-screen-title">
        <slot name="title" />
      </div>
      <div
        @click="
          () => {
            toggleModal(null);
            resetHeight();
          }
        "
        class="madal-screen-close"
      >
        <img src="../assets/img/Cross.svg" alt="Close" class="img-24" />
      </div>
    </span>
  </div>

  <div
    @click.stop
    ref="modalBody"
    class="madal-screen-body madal-screen-body-high"
    :style="{
      height:
        typeof modalHeight === 'number' ? modalHeight + 'px' : modalHeight,
    }"
  >
    <slot />
  </div>
</template>
