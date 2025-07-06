import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendToBackend } from '../modules/fetch'
import { useUserStore } from '../stores/user'
import { ERROR_MESSAGES } from '../constants/index.js'

export const useHistoryStore = defineStore('history', () => {
  const history = ref([])
  const pageInfo = ref([0, 0]) // [totalPages, currentPage]

  const CACHE_KEY = 'cached_history'

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  function normalizeDate(dateString) {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear()
    }
  }

  const setPage = (page) => {
    fetchUserHistory(page)
    if (page >= 0 && page <= pageInfo.value[0]) {
      pageInfo.value[1] = page
    }
  }

  const getVisiblePages = () => {
    const total = pageInfo.value[0]
    const current = pageInfo.value[1]

    if (total <= 1) {
      return total > 2
        ? Array.from({ length: total - 1 }, (_, i) => i + 1)
        : []
    }

    let start = Math.max(1, current - 2)
    let end = Math.min(total - 2, current + 2)

    if (end - start < 4) {
      if (start === 1) end = Math.min(total - 1, start + 4)
      else if (end === total - 1) start = Math.max(1, end - 4)
    }
    console.log(Array.from({ length: end - start + 1 }, (_, i) => start + i))
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const getCurrentPage = () => pageInfo.value[1]
  const getPagesCount = () => pageInfo.value[0]

  const fetchUserHistory = async (pageIndex = 0) => {
    const userId = useUserStore().getUserId()
    const cacheKey = `${CACHE_KEY}_${userId}_${pageIndex}`

    // Попытка достать из кэша
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        history.value = JSON.parse(cached)
      } catch (e) {
        localStorage.removeItem(cacheKey)
      }
    }

    const payload = {
      user_id: userId,
      current_page: pageIndex
    }

    try {
      const result = await sendToBackend('/get_user_history', payload)
      const rawHistory = result.data.history,
        totalPages = result.data.pages

      const groupedByDate = rawHistory.reduce((acc, item) => {
        const { date, ...rest } = item
        const dateOnly = date.split(' ')[0]
        if (!acc[dateOnly]) acc[dateOnly] = []
        acc[dateOnly].push(rest)
        return acc
      }, {})

      const normalized = Object.keys(groupedByDate)
        .map((date) => ({
          date: normalizeDate(date),
          data: groupedByDate[date]
        }))
        .sort(
          (a, b) =>
            new Date(b.date.year, months.indexOf(b.date.month), b.date.day) -
            new Date(a.date.year, months.indexOf(a.date.month), a.date.day)
        )

      history.value = normalized
      pageInfo.value[0] = totalPages

      localStorage.setItem(cacheKey, JSON.stringify(normalized))
    } catch (error) {
      console.error(ERROR_MESSAGES.HISTORY_FETCH_FAILED, error)
    }
  }

  const getHistory = () => history.value

  return {
    getHistory,
    fetchUserHistory,
    setPage,
    getVisiblePages,
    getCurrentPage,
    getPagesCount
  }
})
