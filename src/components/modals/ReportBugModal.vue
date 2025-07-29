<template>
  <div class="report-bug-modal">
    <textarea v-model="message" class="bug-textarea rounded-12 bg-neutral-200 text-neutral-700 text-16 usea" :placeholder="getTranslation('reportBugPlaceholder')"></textarea>
    <button class="btn-send" @click="sendReport" :disabled="loading || !message.trim()">
      <span v-if="!loading">{{ getTranslation('send') }}</span>
      <span v-else>{{ getTranslation('sending') }}</span>
    </button>
    <p v-if="success" class="success-msg">{{ getTranslation('reportBugSuccess') }}</p>
    <p v-if="error" class="error-msg">{{ getTranslation('reportBugError') }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '../../stores/language'
import { sendToBackend } from '../../modules/fetch'
import { useUserStore } from '../../stores/user'

const { getTranslation } = useLanguageStore()
const message = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref(false)
const title = 'Сообщить об ошибке'
const logs = ref([])
const originalConsole = {}

function captureConsole() {
  ['log', 'error', 'warn', 'info'].forEach(type => {
    originalConsole[type] = console[type]
    console[type] = function (...args) {
      logs.value.push(`[${type}] ${args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')}`)
      originalConsole[type].apply(console, args)
    }
  })
}

function restoreConsole() {
  ['log', 'error', 'warn', 'info'].forEach(type => {
    if (originalConsole[type]) console[type] = originalConsole[type]
  })
}

onMounted(() => {
  captureConsole()
})
onUnmounted(() => {
  restoreConsole()
})

async function sendReport() {
  if (!message.value.trim()) return
  loading.value = true
  error.value = false
  success.value = false
  try {
    await sendToBackend('/report_bug', {
      user_id: useUserStore().getUserId(),
      message: message.value,
      logs: logs.value.join('\n')
    })
    success.value = true
    message.value = ''
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.report-bug-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.bug-textarea {
  padding: 15px 12px;
  border: 0;
  border: 2px solid #00000000;
  resize: none;
}
.bug-textarea:focus-visible {
  border: 2px solid var(--blue-500);
  outline: none;
}
.btn-send {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.success-msg {
  color: #2ecc40;
  font-size: 14px;
}
.error-msg {
  color: #e74c3c;
  font-size: 14px;
}
</style> 