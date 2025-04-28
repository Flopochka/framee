<script setup>
import { ref, nextTick } from "vue";
import { useModalStore } from "../stores/modal";

const { toggleModal } = useModalStore();

const props = defineProps({
  modalId: {
    type: String,
    required: true,
  },
});

// Modal height management
const modalHeight = ref("auto");
const isDragging = ref(false);
const startY = ref(0);
const currentHeight = ref(0);
const isFullScreen = ref(false);
const defaultHeight = ref(0);

// Convert vh to pixels
const vhToPx = (vh) => (vh * window.innerHeight) / 100;
const maxHeight = vhToPx(80);
const minHeight = vhToPx(0);

// Start dragging
const startDragging = async (event) => {
  isDragging.value = true;
  startY.value = event.clientY || event.touches[0].clientY;

  const modalBody = document.querySelector(`#modal-body-${props.modalId}`);
  await nextTick();

  if (modalHeight.value === "auto") {
    const computedHeight = modalBody.offsetHeight;
    defaultHeight.value = computedHeight;
    currentHeight.value = computedHeight;
    modalHeight.value = computedHeight;
  } else {
    currentHeight.value = modalHeight.value;
  }

  modalBody.style.transition = "none";
  modalBody.style.maxHeight = "none";

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("mouseup", stopDragging);
  document.addEventListener("touchend", stopDragging);
};

// Dragging
const onDrag = (event) => {
  if (!isDragging.value) return;

  const currentY = event.clientY || event.touches[0].clientY;
  const deltaY = startY.value - currentY;
  let newHeight = currentHeight.value + deltaY;

  newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
  modalHeight.value = newHeight;

  startY.value = currentY;
  currentHeight.value = newHeight;
};

// Stop dragging
const stopDragging = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  const modalBody = document.querySelector(`#modal-body-${props.modalId}`);
  modalBody.style.transition = "height 0.3s ease";

  if (isFullScreen.value) {
    const closeThreshold = (maxHeight - currentHeight.value) / (maxHeight - minHeight);
    if (closeThreshold > 0.2) {
      modalHeight.value = minHeight;
      setTimeout(() => {
        toggleModal(null);
        resetHeight();
      }, 300);
    } else {
      modalHeight.value = maxHeight;
    }
  } else {
    const openThreshold = (currentHeight.value - defaultHeight.value) / (maxHeight - defaultHeight.value);
    const closeThreshold = (defaultHeight.value - currentHeight.value) / (defaultHeight.value - minHeight);

    if (openThreshold > 0.2) {
      modalHeight.value = maxHeight;
      isFullScreen.value = true;
    } else if (closeThreshold > 0.2) {
      modalHeight.value = minHeight;
      setTimeout(() => {
        toggleModal(null);
        resetHeight();
      }, 300);
    } else {
      modalHeight.value = defaultHeight.value;
      isFullScreen.value = false;
    }
  }

  currentHeight.value = modalHeight.value;

  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("mouseup", stopDragging);
  document.removeEventListener("touchend", stopDragging);
};

// Reset height
const resetHeight = () => {
  modalHeight.value = "auto";
  currentHeight.value = 0;
  defaultHeight.value = 0;
  isFullScreen.value = false;

  const modalBody = document.querySelector(`#modal-body-${props.modalId}`);
  if (modalBody) {
    modalBody.style.transition = "height 0.3s ease";
    modalBody.style.maxHeight = null;
  }
};
</script>

<template>
  <div @click.stop class="madal-screen-head items-start cude">
    <div
      class="madal-screen-swipka"
      @mousedown="startDragging"
      @touchstart="startDragging"
    ></div>
    <div class="text-20 madal-screen-title">
      <slot name="title" />
    </div>
    <div @click="() => { toggleModal(null); resetHeight(); }" class="madal-screen-close">
      <img src="../assets/img/Cross.svg" alt="Close" class="img-24" />
    </div>
  </div>
  <div
    @click.stop
    :id="`modal-body-${modalId}`"
    class="madal-screen-body madal-screen-body-high"
    :style="{ height: typeof modalHeight === 'number' ? modalHeight + 'px' : modalHeight }"
  >
    <slot />
  </div>
</template>

<style scoped>

.madal-screen-body {
  gap: 8px;
  transition: height 0.3s ease;
  overflow-y: auto;
  max-height: 60vh;
  padding: 16px;
}

.madal-screen-swipka {
  width: 40px;
  height: 4px;
  background: var(--Surface-white-20, #ffffff33);
  border-radius: 2px;
  margin: 8px auto;
  cursor: grab;
  user-select: none;
}

.madal-screen-swipka:active {
  cursor: grabbing;
}
</style>