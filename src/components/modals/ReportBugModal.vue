<template>
  <div class="report-bug-modal" v-if="isModalReady">
    <textarea v-model="message" class="bug-textarea rounded-12 bg-neutral-200 text-neutral-700 text-16 usea" :placeholder="getTranslation('reportBugPlaceholder')"></textarea>
    <button class="btn-send" @click="sendReport" :disabled="loading || !message.trim()">
      <span v-if="!loading">{{ getTranslation('send') }}</span>
      <span v-else>{{ getTranslation('sending') }}</span>
    </button>
    <p v-if="success" class="success-msg">{{ getTranslation('reportBugSuccess') }}</p>
    <p v-if="error" class="error-msg">{{ getTranslation('reportBugError') }}</p>
  </div>
  <div v-else class="report-bug-modal">
    <p>Loading...</p>
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
const logs = ref([])
const originalConsole = {}
const isModalReady = ref(false)

// Ограничиваем количество логов в памяти
function addLog(message) {
  try {
    if (!logs.value) {
      console.warn('[ReportBugModal] logs.value is undefined, initializing')
      logs.value = []
    }

    logs.value.push(message)
    // Ограничиваем до 1000 логов
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(-1000)
    }
  } catch (error) {
    console.error('[ReportBugModal] Error in addLog:', error.message)
    // Fallback logging
    console.log(`[FALLBACK-LOG] ${message}`)
  }
}

// Простое логирование без агрессивного сбора данных
function captureConsole() {
  try {
    ['log', 'error', 'warn', 'info'].forEach(type => {
      originalConsole[type] = console[type]
      console[type] = function (...args) {
        // Логируем только базовые сообщения
        const logMessage = `[${type}] ${args.map(a => {
          if (typeof a === 'object') {
            // Ограничиваем размер объектов для безопасности
            try {
              const str = JSON.stringify(a)
              return str.length > 200 ? `${str.substring(0, 200)}...` : str
            } catch {
              return '[Object]'
            }
          }
          return String(a)
        }).join(' ')}`

        logs.value.push(logMessage)

        // Ограничиваем количество логов
        if (logs.value.length > 100) {
          logs.value = logs.value.slice(-100)
        }

        // Вызываем оригинальный метод
        originalConsole[type].apply(console, args)
      }
    })
  } catch (e) {
    console.warn('Console capture failed:', e.message)
  }
}

function restoreConsole() {
  try {
    ['log', 'error', 'warn', 'info'].forEach(type => {
      if (originalConsole[type]) {
        console[type] = originalConsole[type]
      }
    })
  } catch (e) {
    console.warn('Console restore failed:', e.message)
  }
}

function restoreNetworkCapture() {
  // Восстанавливаем оригинальные методы
  if (window._originalFetch) {
    window.fetch = window._originalFetch
  }
  if (XMLHttpRequest.prototype._originalOpen) {
    XMLHttpRequest.prototype.open = XMLHttpRequest.prototype._originalOpen
  }
  if (XMLHttpRequest.prototype._originalSend) {
    XMLHttpRequest.prototype.send = XMLHttpRequest.prototype._originalSend
  }
}

onMounted(() => {
  // Добавляем базовую информацию о системе
  logs.value.push(`[system] User Agent: ${navigator.userAgent}`)
  logs.value.push(`[system] Platform: ${navigator.platform}`)
  logs.value.push(`[system] Time: ${new Date().toISOString()}`)

  // Проверяем Telegram WebView
  if (window.Telegram && window.Telegram.WebView) {
    logs.value.push('[telegram] WebView detected')
  } else {
    logs.value.push('[telegram] WebView not detected')
  }

  captureConsole()
})

onUnmounted(() => {
  try {
    addLog('[system] ReportBugModal unmounting - starting cleanup')
    restoreConsole()
    restoreNetworkCapture()
    addLog('[system] ReportBugModal cleanup completed')
  } catch (error) {
    addLog(`[error] Error during modal cleanup: ${error.message}`)
  }
})

async function sendReport() {
  if (!message.value.trim()) return

  loading.value = true
  error.value = false
  success.value = false

  try {
    if (!message.value.trim()) return

    addLog('[report] Starting bug report submission')
    loading.value = true
    error.value = false
    success.value = false

    const reportData = {
      user: useUserStore().getUserId(),
      message: message.value,
      log_text: logs.value.join('\n')
    })

    success.value = true
    message.value = ''
    // Очищаем логи после успешной отправки
    logs.value = []
  } catch (e) {
    addLog(`[report-error] Failed to send report: ${e.message}`)
    error.value = true
    console.error('Failed to send report:', e)
  } finally {
    loading.value = false
  }
}

function clearLogs() {
  logs.value = []
  addLog('[system] Logs cleared manually')
}

function exportLogs() {
  if (logs.value.length === 0) return

  const logContent = logs.value.join('\n')
  const blob = new Blob([logContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bug-report-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  addLog('[system] Logs exported to file')
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
.log-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
}
.log-buttons {
  display: flex;
  gap: 8px;
}
.btn-clear, .btn-export {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-export {
  background-color: #4da9ec;
  color: white;
}
.btn-clear:hover:not(:disabled), .btn-export:hover:not(:disabled) {
  background-color: #d0d0d0;
}
.btn-export:hover:not(:disabled) {
  background-color: #0f67be;
}
.btn-clear:disabled, .btn-export:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 