import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useModalStore = defineStore('modal', () => {
  const activeModal = ref(null)
  const route = useRoute()
  const router = useRouter()

  const toggleModal = async (modalName) => {
    const isClosing = activeModal.value === modalName

    activeModal.value = isClosing ? null : modalName

    const newQuery = { ...route.query }

    if (isClosing) {
      delete newQuery.modal
    } else {
      newQuery.modal = modalName
    }

    await router.replace({ query: newQuery }) // без перезагрузки страницы
  }

  const getActiveModal = () => activeModal.value

  // Синхронизация: если в урле ?modal=xxx — открываем его
  watch(
    () => route.query.modal,
    (modalName) => {
      activeModal.value = modalName || null
    },
    { immediate: true }
  )

  return {
    toggleModal,
    activeModal,
    getActiveModal
  }
})
