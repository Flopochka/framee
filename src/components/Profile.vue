<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { useScreenStore } from "../stores/screen";
import { sendToBackend } from "../modules/fetch";
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import WebApp from "@twa-dev/sdk";

const referals_count = ref(0);
const income = ref(0);

const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
const shareData = {
  text: getTranslation("FRAMEisyourbestchoiceforbuyingstars!ThepricesarelowerthanintheofficialTelegrambot,andthereisnoKYCverification.Comeinandseeforyourself"),
  url:
    "https://t.me/Framestars_bot?start=" +
    WebApp.initDataUnsafe?.user?.id,
};

function linkTo(url, options = { tryInstantView: false }) {
  if (url.startsWith("https://t.me/") || url.startsWith("tg://")) {
    WebApp.openTelegramLink(url);
  } else {
    WebApp.openLink(url, {
      try_instant_view: options.tryInstantView,
    });
  }
}

const fetchUserInfo = async () => {
  const payload = {
    user_id: useUserStore().getUserId(),
  };
  sendToBackend("/get_user_info", payload)
    .then((result) => {
      const data = result.data;
      referals_count.value = data.count_referrals; // Обновляем счетчик рефералов
      income.value = data.income;
      if (
        useLanguageStore().getCurrentLanguage() != data.language.slice(0, 2)
      ) {
        useLanguageStore().switchLanguage(data.language.slice(0, 2));
      }
    })
    .catch(() => {});
};

async function copyToClipboard(text) {
  if (typeof WebApp.writeTextToClipboard === "function") {
    WebApp.writeTextToClipboard(text);
    toggleModal("Copied");
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      toggleModal("Copied");
    } catch (e) {
      toggleModal("Clipboard error");
      console.error("Clipboard write failed:", e);
    }
  } else {
    toggleModal("Copy not supported");
  }
}

function shareContent() {
  const combinedText = `${shareData.text}\n${shareData.url}`;
  const shareUrl = `https://t.me/share/url?text=${encodeURIComponent(combinedText)}`;

  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, "_blank");
  }
}


// Инициализация user_id после загрузки компонента
onMounted(() => {
  console.log("Platform:", WebApp.platform);
  WebApp.ready()
  fetchUserInfo();
});
</script>

<template>
  <main class="gap-20 p-24">
    <div class="user-stat-box rounded-12">
      <p class="text-16 tac">{{ getTranslation("totalUsers") }}</p>
      <p class="text-16 tac">{{ getTranslation("totalEarnings") }}</p>
      <p
        class="text-20 font-600 lh-120 flex-row items-center justify-center gap-4"
      >
        {{ referals_count }}
        <img src="../assets/img/People.svg" alt="" class="img-24 lazy-img" />
      </p>
      <p class="text-20 font-600 lh-120 flex-row items-center justify-center">
        {{ income }}
        <img
          src="../assets/img/TONMinimal.svg"
          alt=""
          class="img-20 lazy-img"
        />
      </p>
      <div
        @click="useScreenStore().switchScreen(4)"
        class="user-stat-box-btn btn rounded-8 cupo"
      >
        <p class="user-stat-box-btn-text letter-spacing-04 text-14 lh-22 usen">
          {{ getTranslation("Withdraw") }}
        </p>
      </div>
    </div>
    <div class="user-referal-box">
      <p
        class="user-referal-box-header text-14 letter-spacing-04 letter-spacing-04 tac lh-22"
      >
        {{ getTranslation("Invitefriendsandearn5fromtheirpurchases") }}
      </p>
      <div
        @click="shareContent()"
        class="user-referal-box-btn-invite flex-row gap-4 rounded-12 items-center justify-center cupo usen"
      >
        <img src="../assets/img/Gift.svg" alt="" class="img-16 lazy-img" />
        <p class="text-17 letter-spacing-04 text-white">
          {{ getTranslation("Inviteafriend") }}
        </p>
      </div>
      <div
        @click="
          copyToClipboard(
            `${shareData.url}`
          )
        "
        class="user-referal-box-btn-copy rounded-12 items-center justify-center flex-row cupo usen"
      >
        <img src="../assets/img/Copy.svg" alt="" class="img-28 lazy-img" />
      </div>
    </div>
    <div class="user-buttons-1 flex-col gap-8">
      <div
        @click="toggleModal('history')"
        class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center cupo usen"
      >
        <p class="text-16 font-400 text-neutral-200">
          {{ getTranslation("History") }}
        </p>
        <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90" />
      </div>
      <div
        class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center cupo usen"
        @click="linkTo('https://t.me/framestars_support')"
      >
        <p class="text-16 font-400 text-neutral-200">
          {{ getTranslation("Support") }}
        </p>
        <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90" />
      </div>
      <div
        class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center cupo usen"
        @click="linkTo('https://t.me/FrameStarsNews')"
      >
        <p class="text-16 font-400 text-neutral-200">
          {{ getTranslation("OurTelegram") }}
        </p>
        <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90" />
      </div>
    </div>
    <div class="user-language flex-col gap-6">
      <p class="text-14 pl-12">{{ getTranslation("Language") }}</p>
      <div
        @click="toggleModal('lang')"
        class="user-language-item rounded-10 bg-blue-900 flex-row items-center cupo usen"
      >
        <p class="text-16 font-400 text-neutral-200">
          {{
            useLanguageStore().langs[useLanguageStore().getCurrentLanguage()]
          }}
        </p>
        <img src="../assets/img/Arrow down.svg" alt="" class="img-24" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.user-stat-box {
  padding: 28px 16px 12px 16px;
  display: grid;
  grid-template-areas: "A B" "C D" "E E";
  align-items: center;
  justify-items: center;
  gap: 6px;
  background: url("../assets/img/SmoshStars.svg") no-repeat center,
    linear-gradient(90deg, #133e67 0%, #0f497d 100%);
  background-size: contain;
}
.user-stat-box-btn {
  grid-area: E;
  width: 100%;
  background: var(--white-100);
  box-shadow: 0px 2px 6px 0px #10141c40;
  padding: 5px 12px;
  margin-top: 30px;
}
.user-stat-box-btn-text {
  display: table;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #0b2349;
  display: table;
}
.user-referal-box {
  display: grid;
  grid-template-areas: "A A" "B C";
  grid-template-columns: 1fr auto;
  gap: 8px;
  position: relative;
  padding-bottom: 21px;
}
.user-referal-box::after {
  content: "";
  position: absolute;
  width: 90%;
  height: 1px;
  background: var(--blue-900-60);
  bottom: 0;
  left: 5%;
}
.user-referal-box-header {
  grid-area: A;
}
.user-referal-box-btn-invite {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  box-shadow: 0px 9px 20.2px 0px #10141c1a;
  padding: 15px 12px;
}
.user-referal-box-btn-copy {
  padding: 13px;
  background: var(--white-100);
}
.user-buttons-1-item {
  justify-content: space-between;
  padding: 12px;
}
.user-language {
  padding-top: 8px;
}
.user-language-item {
  justify-content: space-between;
  padding: 12px;
}
</style>
