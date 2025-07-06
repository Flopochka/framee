<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useLanguageStore } from '../../stores/language'
import { useModalStore } from '../../stores/modal'
import { useUserStore } from '../../stores/user'
import { sendToBackend } from '../../modules/fetch'
import { useHistoryStore } from '../../stores/history'

const { toggleModal } = useModalStore()
const { getTranslation } = useLanguageStore()
const userStore = useUserStore()

// Переменные для вывода звезд из заданий
const targetUserName = ref('') // Имя пользователя для вывода
const recipientName = ref('') // Имя найденного получателя
const recipientPhoto = ref('') // Фото получателя
const recipient = ref(null) // Данные получателя
const recipientCorrect = ref(true) // Флаг валидности получателя
const recipientIncorrects = ref([])
const withdrawAmount = ref(null)
const searchTimeout = ref(null)
const tasksBalance = ref(0) // Баланс звезд из заданий
const valueCorrect = ref(true)
const valueIncorrects = ref([])

const MAX_LENGTH = 45

// Максимальное допустимое значение
const MAX_NUMBER = 1000000

// Watcher — ограничивает ввод чисел по max
watch(withdrawAmount, (newVal, oldVal) => {
  if (newVal === '') return

  // Разрешаем числа с точкой на конце (например, "1.")
  if (/^\d+\.$/.test(newVal)) return

  const parsed = parseFloat(newVal)
  if (!isNaN(parsed) && parsed > MAX_NUMBER) {
    // Если на единицу больше max и это целое — удаляем последнюю цифру
    if (Number.isInteger(parsed) && parsed === MAX_NUMBER + 1) {
      withdrawAmount.value = newVal.slice(0, -1)
    } else {
      withdrawAmount.value = String(MAX_NUMBER)
    }
  }
})

const clearStars = () => {
  withdrawAmount.value = null
}

watch(targetUserName, (newValue) => {
  if (newValue && newValue.length > MAX_LENGTH) {
    targetUserName.value = newValue.slice(0, MAX_LENGTH)
  }
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(async () => {
    if (newValue && newValue.length >= 3) {
      await searchRecipient(newValue)
    } else {
      recipient.value = null
      recipientCorrect.value = false
    }
  }, 300)
})

// Получение баланса звезд из заданий
const fetchTasksBalance = async () => {
  try {
    const payload = {
      user_id: userStore.getUserId()
    }
    const result = await sendToBackend('/get_user_balance_stars', payload)
    if (result.status === 'success') {
      tasksBalance.value = result.data.balance || 0
      // Обновляем заголовок модального окна
      updateModalTitle()
    }
  } catch (error) {
    console.error('Failed to fetch tasks balance:', error)
  }
}

// Обновление заголовка модального окна
const updateModalTitle = () => {
  nextTick(() => {
    const titleElement = document.querySelector('.withdrawtasksstars .tasks-balance-placeholder')
    if (titleElement) {
      titleElement.innerHTML = `
        ${tasksBalance.value}
        <img src="../../assets/img/Star.svg" alt="Stars" class="img-20 lazy-img" />
      `
    }
  })
}

const searchRecipient = async (username) => {
  if (!username) return
  const payload = { username }
  try {
    const result = await sendToBackend('/search_recipient', payload)
    const data = result.data
    if (result.status.message !== 'Пользователь не найден') {
      recipientName.value = data.name
      recipientPhoto.value = data.photo
      recipient.value = data.recipient
      recipientCorrect.value = true
    } else {
      recipient.value = null
      recipientCorrect.value = false
    }
  } catch (error) {
    console.error('Failed to search recipient:', error)
    recipientCorrect.value = false
  }
}

const buyForMyself = () => {
  targetUserName.value = userStore.getUser()
}

const withdraw = async () => {
  valueIncorrects.value = []
  recipientIncorrects.value = []

  const amount = withdrawAmount.value || 0
  if (amount >= 50 && amount <= 1000000 && amount <= tasksBalance.value) {
    valueCorrect.value = true
  } else {
    valueCorrect.value = false
    valueIncorrects.value.push(
      amount < 50 ? 'Min01' : amount > 1000000 ? 'Max1000000' : 'Notenoughbalace'
    )
  }

  await searchRecipient(targetUserName.value)
  if (!recipient.value) {
    recipientCorrect.value = false
    recipientIncorrects.value.push('Recipientnotavalible')
  }

  if (valueCorrect.value && recipientCorrect.value) {
    const payload = {
      user_id: userStore.getUserId(),
      username: targetUserName.value,
      count: Math.floor(withdrawAmount.value)
    }
    try {
      await sendToBackend('/withdraw_stars', payload)
      toggleModal('popupstars')
      useHistoryStore().fetchUserHistory()
      // Обновляем баланс после успешного вывода
      await fetchTasksBalance()
      // Обновляем заголовок модального окна
      updateModalTitle()
    } catch (error) {
      console.error('Withdraw failed:', error)
      toggleModal('Error')
    }
  }
}

onMounted(() => {
  fetchTasksBalance()
})
</script>

<template>
  <div class="withdrawstars-body jcsb">
    <div class="withdraw-inputs flex-col gap-8" style="position: relative;">
      <p class="pl-14 text-neutral-300 text-14">{{ getTranslation("amount") }}</p>
      <input
        type="number"
        :class="{ incorrect: !valueCorrect }"
        class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
        placeholder="Min 50"
        min="50"
        max="1000000"
        v-model="withdrawAmount"
      />
      <img
        v-if="withdrawAmount"
        @click="clearStars()"
        class="input-clear img-32 cupo"
        style="top: 36px"
        src="../../assets/img/CrossRed.svg"
        alt=""
      />
      <p v-for="error in valueIncorrects" :key="error" class="pl-14 text-red text-14">
        {{ getTranslation(error) }}
      </p>
      <span :class="{ 'with-dog-inputed': targetUserName }" class="with-dog flex-col gap-6">
        <p class="pl-14 text-neutral-300 text-14">{{ getTranslation("username") }}</p>
        <input
          type="text"
          :class="{ incorrect: !recipientCorrect }"
          class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16 usea"
          style="padding-left: 24px"
          placeholder="username"
          v-model="targetUserName"
          maxlength="45"
        />
        <div v-if="recipient" class="input-recipient flex-row gap-16 items-center text-neutral-700">
          <p>{{ recipientName }}</p>
          <img
            class="img-32 rounded-50p"
            :src="'data:image/png;base64,' + recipientPhoto"
            alt="Recipient"
          />
        </div>
        <p class="buyformyself cupo usen" @click="buyForMyself">
          {{ getTranslation("BuyForMyself") }}
        </p>
      </span>
      <p v-for="error in recipientIncorrects" :key="error" class="pl-14 text-red text-14">
        {{ getTranslation(error) }}
      </p>
    </div>
    <div
      @click="withdraw"
      class="withdraw-btn font-600 letter-spacing-04 btn text-17 cupo usen"
    >
      {{ getTranslation("WithdrawinStars") }}
    </div>
  </div>
</template>

<style scoped>
.withdrawstars-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.withdraw-inp {
  padding: 15px 12px;
  border: 2px solid transparent;
}

.withdraw-inp:focus-visible {
  border: 2px solid var(--blue-500);
  outline: none;
}

.withdraw-inp.incorrect {
  border: 2px solid var(--red);
}

.withdraw-info {
  display: grid;
  grid-template-areas: "A A" "B C";
}

.withdraw-btn {
  margin-top: 18px;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 16px;
  text-align: center;
  border-radius: 12px;
  cursor: pointer;
}

.input-clear {
  position: absolute;
  right: 12px;
  top: 36px;
  cursor: pointer;
}
</style>
