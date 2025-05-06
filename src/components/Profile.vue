<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { useScreenStore } from "../stores/screen";
import { sendToBackend } from "../modules/fetch";
import { ref, onMounted } from "vue";
 

const userId = ref(window.Telegram?.WebApp?.initDataUnsafe?.user?.id);
const referals_count = ref(0);
const income = ref(0);

const { switchScreen } = useScreenStore();
const { toggleModal } = useModalStore();
const { getTranslation, langs, getCurrentLanguage, switchLanguage } =
  useLanguageStore();
const shareData = {
  title: "FRAME Stars",
  text: "FRAME — твой лучший выбор для покупки звезд! Цены ниже, чем в официальном боте Telegram, и никакой KYC верификации. Заходи и убедись сам 👇",
  url:
    "https://t.me/Framestars_bot?start=" +
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
};

function linkTo(url, options = { tryInstantView: false, target: '_blank' }) {
  // Проверяем валидность URL
  try {
    new URL(url);
  } catch (error) {
    console.error('Invalid URL:', url, error);
    if (Telegram?.WebApp?.showAlert) {
      Telegram.WebApp.showAlert('Invalid link. Please try another.');
    } else {
      alert('Invalid link. Please try another.');
    }
    return;
  }

  // 1. Telegram Web App: используем openLink или openTelegramLink
  if (Telegram?.WebApp) {
    try {
      if (url.startsWith('https://t.me/') || url.startsWith('tg://')) {
        // Для Telegram-ссылок (например, каналы, чаты)
        Telegram.WebApp.openTelegramLink(url);
      } else {
        // Для внешних ссылок с возможностью Instant View
        Telegram.WebApp.openLink(url, { try_instant_view: options.tryInstantView });
      }
      return;
    } catch (error) {
      console.error('Telegram Web App link error:', error);
      Telegram.WebApp.showAlert('Failed to open link. Trying alternative...');
    }
  }

  // 2. Fallback: открытие ссылки в браузере
  try {
    window.open(url, options.target, 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to open link:', error);
    // Последний fallback: показываем URL для ручного копирования
    if (Telegram?.WebApp?.showAlert) {
      Telegram.WebApp.showAlert(`Please open this link manually: ${url}`);
    } else {
      prompt('Please open this link manually:', url);
    }
  }
}

const fetchUserInfo = async () => {
  const payload = {
    user_id: userId.value,
  };
  try {
    const result = await sendToBackend("/get_user_info", payload);
    const data = result.data.data;
    referals_count.value = result.data.data.count_referrals; // Обновляем счетчик рефералов
    if (getCurrentLanguage() != data.language.slice(0, 2)) {
      switchLanguage(data.language.slice(0, 2));
    }
    console.log("Response:", result.data);
  } catch (error) {
    console.error("Failed:", error);
  }
};

function copyToClipboard(text, url) {
  const textToCopy = `${text} ${url || ""}`;
  try {
    if (Telegram?.WebApp?.writeTextToClipboard) {
      Telegram.WebApp.writeTextToClipboard(textToCopy);
    } else {
      navigator.clipboard.writeText(textToCopy);
    }
    toggleModal("Copied")
  } catch (error) {
    console.error('Failed to copy:', error);
    // Fallback: показываем текст для ручного копирования
    Telegram.WebApp.showAlert(`Copy this link: ${textToCopy}`);
  }

}

// Функция для открытия внешних ссылок
function openShareLink(url) {
  if (Telegram?.WebApp?.openLink) {
    Telegram.WebApp.openLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function shareContent() {
  // 1. Проверяем Telegram Web App и используем нативный шаринг
  if (Telegram?.WebApp?.showShareMenu) {
    Telegram.WebApp.showShareMenu({
      text: `${shareData.title}\n${shareData.text}`,
      url: shareData.url
    });
    return;
  }

  // 2. Проверяем Telegram Web App и пробуем отправить в Telegram
  if (Telegram?.WebApp?.openTelegramLink) {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(`${shareData.title}\n${shareData.text}`);
    const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    Telegram.WebApp.openTelegramLink(telegramUrl);
    return;
  }

  // 3. Проверяем Web Share API (для случаев вне Telegram Web App)
  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => console.log('Share successful'))
      .catch((error) => console.error('Share error:', error));
    return;
  }

  // 4. Проверяем Clipboard API
  if (navigator.clipboard || Telegram?.WebApp?.writeTextToClipboard) {
    copyToClipboard(shareData.text, shareData.url);
    return;
  }

  // 5. Формируем ссылки для других платформ
  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedText = encodeURIComponent(shareData.text);
  const shareLinks = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    }
  ];

  // 6. Fallback: выбор платформы или ручное копирование
  Telegram.WebApp.showConfirm('Sharing is not fully supported. Choose a platform to share:', (confirmed) => {
    if (!confirmed) {
      Telegram.WebApp.showAlert(`Copy this link: ${shareData.text} ${shareData.url}`);
      return;
    }
    Telegram.WebApp.showPopup({
      title: 'Share via',
      message: 'Select a platform:',
      buttons: shareLinks.map((link, i) => ({
        id: `${i}`,
        type: 'default',
        text: link.name
      }))
    }, (buttonId) => {
      if (buttonId !== null) {
        openShareLink(shareLinks[parseInt(buttonId)].url);
      } else {
        Telegram.WebApp.showAlert(`Copy this link: ${shareData.text} ${shareData.url}`);
      }
    });
  });
}

// Инициализация user_id после загрузки компонента
onMounted(() => {
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
        <img src="../assets/img/TONMinimal.svg" alt="" class="img-20 lazy-img" />
      </p>
      <div
        @click="switchScreen(4)"
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
        @click="copyToClipboard('', shareData.url)"
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
          {{ langs[getCurrentLanguage()] }}
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
  background: url('../assets/img/SmoshStars.svg')
      no-repeat center,
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
