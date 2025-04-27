<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";
import { sendToBackend } from "../modules/fetch";
import { ref, onMounted } from "vue";
import Spinner from "../assets/img/Spinner.svg";
const { toggleModal } = useModalStore();
const { getTranslation } = useLanguageStore();
</script>

<template>
  <div @click.stop class="lang-menu-head madal-screen-head">
    <div class="madal-screen-swipka cugr"></div>
    <p></p>
    <div @click="toggleModal(null)" class="madal-screen-close cupo">
      <img src="../assets/img/Cross.svg" alt="" class="img-24" />
    </div>
  </div>
  <div
    @click.stop
    class="lang-menu-body madal-screen-body flex-col gap-26 items-center"
  >
    <div class="spin">
      <img :src="Spinner" src="" alt="" class="img-44 spinner" />
      <img :src="Spinner" src="" alt="" class="img-44 spinner" />
    </div>
    <span class="tac">
      <p class="text-24 lh-120 twb">{{getTranslation('Redirectingtopayment')}}</p>
      <p class="text-16 twb">{{ getTranslation('Itwillonlytakeamoment') }}</p>
    </span>
    <a href="" class="rd-meself btn text-16">{{ getTranslation('Openpaymentpagemanually') }}</a>
  </div>
</template>

<style scoped>
.madal-screen-body {
}
.spin {
    position: relative;
    filter: invert();
}
.spinner {
    animation: rot2 2s infinite linear;
}
.spinner:nth-child(1) {
    position: absolute;
    animation: rot1 2s infinite linear;
}
@keyframes rot1 {
    0%{
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(180deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
@keyframes rot2 {
    0%{
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(290deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
.rd-meself {
    text-decoration: none;
    background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
    padding: 15px 12px;
    color: white;
}
</style>
