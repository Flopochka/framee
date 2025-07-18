const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8888/.netlify/functions/proxy'
    : '/.netlify/functions/proxy'

import { getTelegramInitData } from '../utils/device.js'
import { ERROR_MESSAGES } from '../constants/index.js'

export async function sendToBackend(target, payload) {
  const initData = getTelegramInitData()
  if (import.meta.env.PROD) {
    if (!initData) {
      const msg = ERROR_MESSAGES.NO_TELEGRAM_DATA
      console.warn(msg)
      throw new Error(msg)
    }
  }

  try {
    console.log('[fetch] Sending request to ', target, ': ', payload)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        initData, // Для проверки подписи
        target, // Цель, например "/search_recipient"
        payload // Данные для бэкенда
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('[fetch] Response from ', target, ': ', data)
    return data
  } catch (error) {
    const finalError = new Error(
      `[fetch] ❌ Backend call failed for "${target}": ${
        error.message || error
      }`
    )
    console.error(finalError)
    throw finalError
  }
}
