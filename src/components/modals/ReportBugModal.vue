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

// Ограничиваем количество логов в памяти
function addLog(message) {
  logs.value.push(message)
  // Ограничиваем до 1000 логов
  if (logs.value.length > 1000) {
    logs.value = logs.value.slice(-1000)
  }
}

function captureConsole() {
  ['log', 'error', 'warn', 'info'].forEach(type => {
    originalConsole[type] = console[type]
    console[type] = function (...args) {
      let logMessage = `[${type}] ${args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')}`

      // Добавляем stack trace для ошибок
      if (type === 'error' && args[0] instanceof Error && args[0].stack) {
        logMessage += `\nStack: ${args[0].stack}`
      }

      addLog(logMessage)
      originalConsole[type].apply(console, args)
    }
  })
}

function captureNetworkErrors() {
  // Перехватываем сетевые ошибки
  window._originalFetch = window.fetch
  window.fetch = function(...args) {
    const url = args[0]
    const options = args[1] || {}

    addLog(`[network] Fetch request to: ${url} (${options.method || 'GET'})`)

    return window._originalFetch.apply(this, args).then(response => {
      if (!response.ok) {
        addLog(`[network-error] HTTP ${response.status} ${response.statusText} for ${url}`)
      } else {
        addLog(`[network] Fetch success: ${url} (${response.status})`)
      }
      return response
    }).catch(error => {
      addLog(`[network-error] Fetch failed for ${url}: ${error.message}`)
      if (error.name) addLog(`[network-error] Error type: ${error.name}`)
      throw error
    })
  }

  // Перехватываем XMLHttpRequest ошибки
  XMLHttpRequest.prototype._originalOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype._originalSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function(...args) {
    this._url = args[1]
    this._method = args[0]
    addLog(`[network] XHR request: ${this._method} ${this._url}`)
    return XMLHttpRequest.prototype._originalOpen.apply(this, args)
  }

  XMLHttpRequest.prototype.send = function(...args) {
    this.addEventListener('error', () => {
      addLog(`[network-error] XHR failed for: ${this._method} ${this._url}`)
    })
    this.addEventListener('abort', () => {
      addLog(`[network-error] XHR aborted for: ${this._method} ${this._url}`)
    })
    this.addEventListener('load', () => {
      if (this.status >= 400) {
        addLog(`[network-error] HTTP ${this.status} ${this.statusText} for ${this._method} ${this._url}`)
      } else {
        addLog(`[network] XHR success: ${this._method} ${this._url} (${this.status})`)
      }
    })
    return XMLHttpRequest.prototype._originalSend.apply(this, args)
  }
}

function captureGlobalErrors() {
  // Перехватываем необработанные ошибки JavaScript
  window.addEventListener('error', (event) => {
    addLog(`[js-error] ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`)
  })

  // Перехватываем необработанные Promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    addLog(`[promise-error] ${event.reason}`)
  })

  // Перехватываем Telegram WebView события, если доступны
  if (window.Telegram && window.Telegram.WebView) {
    const originalPostEvent = window.Telegram.WebView.postEvent
    if (originalPostEvent) {
      window.Telegram.WebView.postEvent = function(eventType, data) {
        addLog(`[telegram] postEvent ${eventType}: ${JSON.stringify(data)}`)
        return originalPostEvent.call(this, eventType, data)
      }
    }
  }

  // Перехватываем ошибки загрузки ресурсов
  window.addEventListener('error', (event) => {
    if (event.target && event.target.tagName) {
      const tagName = event.target.tagName.toLowerCase()
      const src = event.target.src || event.target.href || event.target.data
      addLog(`[resource-error] Failed to load ${tagName}: ${src}`)

      // Добавляем дополнительную информацию для разных типов ресурсов
      if (tagName === 'script') {
        addLog(`[resource-error] Script error details: ${event.message}`)
      } else if (tagName === 'link') {
        addLog(`[resource-error] CSS error details: ${event.message}`)
      }
    }
  }, true)

  // Перехватываем ошибки загрузки изображений
  window.addEventListener('error', (event) => {
    if (event.target && event.target.tagName === 'IMG') {
      addLog(`[image-error] Failed to load image: ${event.target.src}`)
      addLog(`[image-error] Image error details: ${event.message}`)

      // Добавляем информацию о размерах изображения
      if (event.target.width && event.target.height) {
        addLog(`[image-error] Expected dimensions: ${event.target.width}x${event.target.height}`)
      }
    }
  }, true)

  // Перехватываем ошибки base64img
  const originalConsoleError = console.error
  console.error = function(...args) {
    const message = args.join(' ')
    if (message.includes('[base64img]')) {
      addLog(`[base64img-error] ${message}`)
    }
    originalConsoleError.apply(console, args)
  }

  // Перехватываем изменения в URL
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function(...args) {
    addLog(`[navigation] pushState: ${args[2]}`)
    return originalPushState.apply(this, args)
  }

  history.replaceState = function(...args) {
    addLog(`[navigation] replaceState: ${args[2]}`)
    return originalReplaceState.apply(this, args)
  }

  // Перехватываем изменения в localStorage
  const originalSetItem = localStorage.setItem
  localStorage.setItem = function(key, value) {
    addLog(`[storage] localStorage.setItem: ${key} = ${value}`)
    return originalSetItem.call(this, key, value)
  }

  // Перехватываем изменения в sessionStorage
  const originalSessionSetItem = sessionStorage.setItem
  sessionStorage.setItem = function(key, value) {
    addLog(`[storage] sessionStorage.setItem: ${key} = ${value}`)
    return originalSessionSetItem.call(this, key, value)
  }

  // Перехватываем ошибки валидации форм
  window.addEventListener('invalid', (event) => {
    const target = event.target
    if (target && target.tagName) {
      addLog(`[validation-error] Form validation failed for ${target.tagName}: ${target.name || target.id || 'unnamed'}`)
      if (target.validationMessage) {
        addLog(`[validation-error] Validation message: ${target.validationMessage}`)
      }
      if (target.validity) {
        addLog(`[validation-error] Validity state: ${JSON.stringify(target.validity)}`)
      }
    }
  }, true)

  // Перехватываем ошибки загрузки iframe
  window.addEventListener('error', (event) => {
    if (event.target && event.target.tagName === 'IFRAME') {
      addLog(`[iframe-error] Failed to load iframe: ${event.target.src}`)
    }
  }, true)

  // Перехватываем ошибки загрузки видео/аудио
  window.addEventListener('error', (event) => {
    if (event.target && (event.target.tagName === 'VIDEO' || event.target.tagName === 'AUDIO')) {
      addLog(`[media-error] Failed to load ${event.target.tagName.toLowerCase()}: ${event.target.src}`)
    }
  }, true)
}

function restoreConsole() {
  ['log', 'error', 'warn', 'info'].forEach(type => {
    if (originalConsole[type]) console[type] = originalConsole[type]
  })
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
  // Добавляем информацию о браузере и системе
  addLog(`[system] User Agent: ${navigator.userAgent}`)
  addLog(`[system] Platform: ${navigator.platform}`)
  addLog(`[system] Language: ${navigator.language}`)
  addLog(`[system] Screen: ${screen.width}x${screen.height}`)
  addLog(`[system] Viewport: ${window.innerWidth}x${window.innerHeight}`)

  // Добавляем информацию о производительности
  if ('performance' in window) {
    const perf = performance.getEntriesByType('navigation')[0]
    if (perf) {
      addLog(`[performance] Page load time: ${perf.loadEventEnd - perf.loadEventStart}ms`)
      addLog(`[performance] DOM content loaded: ${perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart}ms`)
    }
  }

  // Добавляем информацию о памяти (если доступно)
  if ('memory' in performance) {
    addLog(`[memory] Used: ${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB`)
    addLog(`[memory] Total: ${Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)}MB`)
    addLog(`[memory] Limit: ${Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)}MB`)
  }

  // Добавляем информацию о времени
  addLog(`[system] Current time: ${new Date().toISOString()}`)
  addLog(`[system] Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`)

  captureConsole()
  captureNetworkErrors()
  captureGlobalErrors()
})

onUnmounted(() => {
  restoreConsole()
  restoreNetworkCapture()
})

async function sendReport() {
  if (!message.value.trim()) return
  loading.value = true
  error.value = false
  success.value = false
  try {
    await sendToBackend('/log', {
      user: useUserStore().getUserId(),
      message: message.value,
      log_text: logs.value.join('\n')
    })
    success.value = true
    message.value = ''
    // Очищаем логи после успешной отправки
    logs.value = []
  } catch (e) {
    error.value = true
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