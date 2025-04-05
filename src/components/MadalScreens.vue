<script setup>
import { useLanguageStore } from '../stores/language';
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { useUserStore } from "../stores/user";
import { ref, onMounted } from "vue";

const { toggleModal, activeModal, getActiveModal } = useModalStore();
const {getTranslation, switchLanguage, langs, getCurrentLanguage} = useLanguageStore();
const { updateUser, getUserName, getUser, getUserPhoto, getUserBalance } = useUserStore();

const userId = ref(null);

const fetchUserHistory = async () => {
  const payload = {
    user_id: userId.value,
  };
  try {
    const result = await sendToBackend("/get_user_history", payload);
    const data = result.data.data;
    console.log("Response:", result.data);
  } catch (error) {
    console.error("Failed:", error);
  }
};

// Инициализация user_id после загрузки компонента
onMounted(() => {
  if (window.Telegram?.WebApp?.initData) {
    userId.value = window.Telegram.WebApp.initData.user.id;
  } else {
    userId.value = 1341978600; // Значение по умолчанию для отладки 227363776
    // userId.value = 227363776; // Значение по умолчанию для отладки
  }

//   fetchUserHistory(); // Вызываем запрос после установки userId
});
</script>

<template>
    <div @click="toggleModal(null)" class="lang-menu madal-screen" :class="{ 'madal-active': getActiveModal() == 'lang' }">
        <div @click.stop class="lang-menu-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title lh-120">{{ getTranslation('Systemlanguage') }}</p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="lang-menu-body madal-screen-body">
            <div class="lang-select-cards">
                <div v-for="(label, key) in langs"
                    :key="key"
                    @click="switchLanguage(key)"
                    class="lang-select-card flex-row" >
                    <p class="text-16 font-400">{{ label }}</p>
                    <img src="../assets/img/Check.svg" :alt="getCurrentLanguage() === key ? 'Галочки нет' : 'Галочка'" class="img-24" :class="{ hidden: getCurrentLanguage() !== key }" />
                </div>
            </div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="user-history madal-screen" :class="{ 'madal-active': getActiveModal() == 'history' }">
        <div @click.stop class="user-history-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 madal-screen-title">{{ getTranslation('History') }}</p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="user-history-body madal-screen-body madal-screen-body-high">
            <p class="text-white-70 text-14 pl-12">{{ getTranslation('Apr') }}, 17</p>
            <div class="history-cards flex-col rounded-24">
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/StarGold.svg" alt="" class="img-20"></div>
                    <p class="text-14 flex-row">{{ getTranslation('Buy') }}<p class="font-400">&nbsp;100 {{ getTranslation('Stars') }}&nbsp;</p>{{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/StarPremium.svg" alt="" class="img-20"></div>
                    <p class="text-14 flex-row font-400">{{ getTranslation('Buy') }} {{ getTranslation('Premium3months') }} {{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></div>
                    <p class="text-14 flex-row font-400">{{ getTranslation('Withdraw') }} 24.02 TON</p>
                </div>
            </div>
            <p class="text-white-70 text-14 pl-12">{{ getTranslation('Apr') }}, 17</p>
            <div class="history-cards flex-col rounded-24">
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/StarGold.svg" alt="" class="img-20"></div>
                    <p class="text-14 flex-row">{{ getTranslation('Buy') }}<p class="font-400">&nbsp;100 {{ getTranslation('Stars') }}&nbsp;</p>{{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/StarPremium.svg" alt="" class="img-20"></div>
                    <p class="text-14 flex-row font-400">{{ getTranslation('Buy') }} {{ getTranslation('Premium3months') }} {{ getTranslation('for') }} @ahillary</p>
                </div>
                <div class="history-card flex-row items-center">
                    <div class="history-img flex-row justify-center items-center"><img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></div>
                    <p class="text-14 flex-row font-400">{{ getTranslation('Withdraw') }} 24.02 TON</p>
                </div>
            </div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="withdrawton madal-screen" :class="{ 'madal-active': getActiveModal() == 'withdrawton' }">
        <div @click.stop class="withdrawton-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 lh-120 madal-screen-title flex-row gap-14 items-center">{{ getTranslation('Yourbalance') }}: <p class="lh-115 flex-row items-center">{{ getUserBalance() }}&nbsp;<img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></p></p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="withdrawton-body madal-screen-body madal-screen-body-high jcsb">
            <div class="withdraw-inputs flex-col gap-8">
                <p class="pl-14 text-neutral-300 text-14">{{ getTranslation('Ammount') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="Min 0.3" min="0.3" max="1000000">
                <p class="pl-14 text-neutral-300 text-14">{{ getTranslation('Wallet') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@UQA63stAKU17GZ80mcHctRX3DBSbm4Ks_dBwGiX9JTrIAi2">
                <div class="withdraw-info gap-12">
                    <p style="grid-area: A;" class="text-16 font-400 text-white">{{ getTranslation('Youget') }}</p>
                    <p class="text-24 text-white">0.35 TON</p>
                    <p class="text-14 font-400 text-white-60 jse">{{ getTranslation('Fee') }}  0.3 TON</p>
                </div>
            </div>
            <div @click="toggleModal('popupwalletnc')" class="withdraw-btn font-600 letter-spacing-04 btn text-17">{{ getTranslation('WithdrawinTON') }}</div>
        </div>
    </div>
    <div @click="toggleModal(null)" class="withdrawstars madal-screen" :class="{ 'madal-active': getActiveModal() == 'withdrawstars' }">
        <div @click.stop class="withdrawstars-head madal-screen-head">
            <div class="madal-screen-swipka"></div>
            <p class="text-20 lh-120 madal-screen-title flex-row gap-14 items-center">{{ getTranslation('Yourbalance') }}: <p class="lh-115 flex-row items-center">{{ getUserBalance() }}&nbsp;<img src="../assets/img/TONMinimal.svg" alt="" class="img-20"></p></p>
            <div @click="toggleModal(null)" class="madal-screen-close">
                <img src="../assets/img/Cross.svg" alt="" class="img-24">
            </div>
        </div>
        <div @click.stop class="withdrawstars-body madal-screen-body madal-screen-body-high jcsb">
            <div class="withdraw-inputs flex-col gap-8">
                <p class="pl-14 text-neutral-300 text-14">{{ getTranslation('Ammount') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="Min 100" min="100" max="1000000">
                <p class="pl-14 text-neutral-300 text-14">{{ getTranslation('Username') }}</p>
                <input type="number" class="withdraw-inp rounded-12 bg-neutral-200 text-neutral-700 text-16" placeholder="@example">
                <div class="withdraw-info gap-12">
                    <p style="grid-area: A;" class="text-16 font-400 text-white">{{ getTranslation('Yougetfor') }} 0.3 TON ≈</p>
                    <p class="text-24 text-white">100 Stars</p>
                    <p class="text-14 font-400 text-white-60 jse">{{ getTranslation('Fee') }}  0.3 TON</p>
                </div>
            </div>
            <div @click="toggleModal('popupstars')" class="withdraw-btn font-600 letter-spacing-04 btn text-17">{{ getTranslation('WithdrawinStars') }}</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': getActiveModal() == 'popupstars' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white letter-spacing-2">{{ getTranslation('Starshavebeensent') }}</p>
            <p class="text-14 font-400 text-neutral-300 letter-spacing-2 lh-120">{{ getTranslation('Youraccountwillbeupdatedwithinafewminutes') }}</p>
            <div @click="toggleModal(null)" class="popup-btn letter-spacing-04 font-600 btn rounded-12">{{ getTranslation('Close') }}</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': getActiveModal() == 'popuppremium' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white letter-spacing-2">{{ getTranslation('Premiumhavebeensent') }}</p>
            <p class="text-14 font-400 text-neutral-300 letter-spacing-2 lh-120">{{ getTranslation('Youraccountwillbeupdatedwithinafewminutes') }}</p>
            <div @click="toggleModal(null)" class="popup-btn letter-spacing-04 font-600 btn rounded-12">{{ getTranslation('Close') }}</div>
        </div>
    </div>
    <div class="popup" :class="{ 'popup-active': getActiveModal() == 'popupwalletnc' }">
        <div class="popup-img flex-row items-center justify-center">
            <img src="../assets/img/Star.svg" alt="" class="img-32">
        </div>
        <div class="popup-block flex-col">
            <p class="text-16 text-white letter-spacing-2">{{ getTranslation('Walletnotconnected') }}</p>
            <p class="text-14 font-400 text-neutral-300 letter-spacing-2 lh-120">{{ getTranslation('PleaseconnectyourTONwalletonthemainpagetostartpurchasing') }}</p>
            <div @click="toggleModal(null)" class="popup-btn letter-spacing-04 font-600 btn rounded-12">{{ getTranslation('Close') }}</div>
        </div>
    </div>
</template>

<style scoped>
.lang-select-card {
    justify-content: space-between;
    padding: 12px 6px 12px 0;
}
.user-history-body {
    gap: 8px;
}
.history-cards {
    background: var(--Surface-white-5, #FFFFFF0D);
    padding: 16px;
    margin-bottom: 12px;
    gap: 8px;
}
.history-card {
    gap: 8px;
}
.history-img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background: var(--Surface-white-20, #FFFFFF33);
}
.withdraw-inp {
    padding: 15px 12px;
    border: 0;
    border: 2px solid #00000000;
}
.withdraw-inp:focus-visible{
    border: 2px solid var(--blue-500);
    outline: none;
}
.withdraw-info{
    display: grid;
    grid-template-areas: "A A""B C";
}
.withdraw-btn{
    background: linear-gradient(129.45deg, #4DA9EC 9.38%, #0F67BE 117.65%);
}
</style>