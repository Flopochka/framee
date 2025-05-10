<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";
import { ref, onMounted, computed } from "vue";
import refPhoto from "../assets/img/TESTReferalPhoto.png";

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();

const pageInfo = ref([0, 0]);
const referals = ref([]);

const setPage = (page) => {
  fetchUserReferals(page);
  if (page >= 0 && page < pageInfo.value[0]) {
    pageInfo.value[1] = page;
  }
};

const visiblePages = computed(() => {
  const total = pageInfo.value[0];
  const current = pageInfo.value[1];

  let start = Math.max(1, current - 2);
  let end = Math.min(total - 1, current + 2);

  if (end - start < 4) {
    if (start === 1) end = Math.min(total - 1, start + 4);
    else if (end === total - 1) start = Math.max(1, end - 4);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const fetchUserReferals = async (i) => {
  const payload = {
    user_id: useUserStore().getUserId(),
    current_page: i,
  };

  try {
    const result = await sendToBackend("/get_user_referrals", payload);
    const data = result.data;
    referals.value = data.referrals;
    pageInfo.value[0] = data.pages;
  } catch (у) {}
};

const fetchWithdraw = async () => {
  const payload = {
    user_id: useUserStore().getUserId(),
  };
  sendToBackend("/page_withdraw_info", payload)
    .then((result) => {
      const data = result.data;
      useUserStore().updateUser(
        data.user_profile.name,
        data.username,
        data.user_profile.photo,
        data.balance,
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id
      );
    })
    .catch(() => {});
};

// Инициализация user_id после загрузки компонента
onMounted(() => {
  fetchUserReferals(0);
  fetchWithdraw();
});
</script>

<template>
  <main class="flex-col gap-28 p-24">
    <div class="withdraw-info">
      <p class="text-20 text-white">{{ getTranslation("Yourbalance") }}</p>
      <p class="text-24 text-white jse">
        {{ useUserStore().getUserBalance()
        }}<img src="../assets/img/TONMinimal.svg" alt="" class="img-20" />
      </p>
      <div
        @click="toggleModal('withdrawton')"
        style="grid-area: C"
        class="withdraw-ton-btn font-600 btn text-17 text-white letter-spacing-04 cupo usen"
      >
        {{ getTranslation("WithdrawinTON") }}
      </div>
      <div
        @click="toggleModal('withdrawstars')"
        style="grid-area: D"
        class="withdraw-stars-btn btn cupo usen"
      >
        <p class="wis text-17 font-600 letter-spacing-04">
          {{ getTranslation("WithdrawinStars") }}
        </p>
      </div>
    </div>
    <div class="referal-info flex-col">
      <p class="text-20 text-white">{{ getTranslation("YourReferals") }}</p>
      <div class="referal-cards gap-8">
        <div class="referal-card-head items-center">
          <img
            style="grid-area: A"
            :src="
              useUserStore().getUserPhoto()
                ? 'data:image/png;base64,' + useUserStore().getUserPhoto()
                : refPhoto
            "
            alt=""
            class="img-44 rounded-22"
          />
          <p class="text-20 text-white">{{ useUserStore().getUserName() }}</p>
          <p class="text-16 text-white-60">@{{ useUserStore().getUser() }}</p>
        </div>
        <template v-if="referals && referals.length">
          <div
            v-for="referal in referals"
            class="referal-card items-center gap-8"
          >
            <img
              :src="
                referal.photo
                  ? 'data:image/png;base64,' + referal.photo
                  : refPhoto
              "
              alt=""
              class="img-40 rounded-20"
            />
            <p class="text-16 text-white-60">{{ referal.name }}</p>
            <p class="text-16 text-neutral-200 jse flex-row">
              + {{ referal.income
              }}<img src="../assets/img/TONMinimal.svg" alt="" class="img-16" />
            </p>
          </div>
          <div class="referal-pages">
            <!-- Кнопка первой страницы -->
            <div
              class="page-btn"
              @click="setPage(0)"
              :class="pageInfo[1] == 0 ? 'page-btn-current' : ''"
            >
              <p class="text-14">1</p>
            </div>

            <!-- Динамический диапазон -->
            <div
              v-for="page in visiblePages"
              :key="page"
              class="page-btn"
              :class="{ 'page-btn-current': page === pageInfo[1] }"
              @click="setPage(page)"
            >
              <p class="text-14">{{ page + 1 }}</p>
            </div>

            <!-- Кнопка последней страницы -->
            <div
              class="page-btn"
              @click="setPage(pageInfo[0] - 1)"
              :class="pageInfo[1] == pageInfo[0] ? 'page-btn-current' : ''"
            >
              <p class="text-14">{{ pageInfo[0] }}</p>
            </div>
          </div>
        </template>
        <template v-else>
          <span style="padding: 6px 14px" class="flex-col gap-8">
            <p class="text-24 lh-120">{{ getTranslation("Noreferralsyet") }}</p>
            <p class="text-16 lh-120">
              {{
                getTranslation(
                  "Inviteyourfriendstojoinandstartearningrewardstogether"
                )
              }}
            </p>
          </span>
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
.withdraw-info {
  display: grid;
  grid-template-areas: "A B" "C C" "D D";
  gap: 20px;
}
.withdraw-ton-btn {
  background: var(--but-blue-2);
}
.withdraw-stars-btn {
  background: var(--white-100);
}
.wis {
  display: table;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.referal-info {
  gap: 13px;
}
.referal-cards {
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: 14px;
  background: var(--Surface-white-5, #ffffff0d);
  overflow: hidden;
  padding-bottom: 16px;
}
.referal-card-head {
  background: var(--Surface-white-10, #ffffff1a);
  padding: 14px 12px;
  display: grid;
  grid-template-areas: "A B" "A C";
  justify-content: start;
  gap: 12px;
}
.referal-card {
  display: grid;
  grid-template-columns: auto auto 1fr;
  padding: 0 16px;
  width: 100%;
  position: relative;
}
.referal-card:nth-child(n + 3)::after {
  content: "";
  position: absolute;
  width: 80%;
  height: 1px;
  background: var(--blue-900-60);
  left: 10%;
  top: -4px;
}
.referal-pages {
  display: grid;
  grid-template-columns: repeat(auto-fit, 42px);
  gap: 16px;
  justify-content: space-between;
  align-content: center;
  padding: 16px;
}
.page-btn {
  background: var(--blue-600);
  padding: 12px;
  border-radius: 12px;
  aspect-ratio: 1/1;
  text-align: center;
}
.page-btn-current {
  background: var(--blue-900);
}
</style>
