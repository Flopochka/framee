import { ref, onMounted, onBeforeUnmount } from 'vue'
import { isMobileDevice } from '../utils/device.js'

/**
 * Composable для управления состоянием клавиатуры
 */
export function useKeyboard() {
  const isKeyboardOpen = ref(false)
  let blurTimeout = null

  const onFocus = () => {
    clearTimeout(blurTimeout)
    isKeyboardOpen.value = true
  }

  const onBlur = () => {
    blurTimeout = setTimeout(() => {
      isKeyboardOpen.value = false
    }, 100)
  }

  const setupKeyboardListeners = () => {
    if (!isMobileDevice()) return

    const inputs = document.querySelectorAll(
      'input, textarea, [contenteditable]'
    )

    inputs.forEach((el) => {
      el.addEventListener('focus', onFocus)
      el.addEventListener('blur', onBlur)
    })
  }

  const cleanupKeyboardListeners = () => {
    const inputs = document.querySelectorAll(
      'input, textarea, [contenteditable]'
    )

    inputs.forEach((el) => {
      el.removeEventListener('focus', onFocus)
      el.removeEventListener('blur', onBlur)
    })

    clearTimeout(blurTimeout)
  }

  onMounted(() => {
    setupKeyboardListeners()
  })

  onBeforeUnmount(() => {
    cleanupKeyboardListeners()
  })

  return {
    isKeyboardOpen,
    setupKeyboardListeners,
    cleanupKeyboardListeners
  }
}
