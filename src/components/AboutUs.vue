<script setup>
import { ref } from "vue";
import { useLanguageStore } from "../stores/language";

const { getTranslation } = useLanguageStore();

const currentAccordion = ref(0);
const switchAccordion = (type) => (currentAccordion.value = type);
const isAccordionActive = (index) => currentAccordion.value === index;
</script>

<template>
  <main class="gap-28 p-24">
    <div class="aboutus-cover flex-col gap-40">
      <div class="text-white aboutus-btn btn text-16">
        {{ getTranslation("connectWallet") }}
        <img src="../assets/img/wallet.svg" alt="" class="img-20" />
      </div>
      <p class="aboutus-cover-header text-32 lh-110 tac">
        {{
          getTranslation("theBestChoiceforPurchasingTelegramStarsandPremium")
        }}
      </p>
      <div
        class="aboutus-cover-card rounded-18 flex-col items-center justify-center gap-32"
      >
        <img
          src="../assets/img/Duck.svg"
          alt=""
          class="aboutus-cover-card-img"
        />
        <p class="text-white text-24 lh-100 tac">
          {{ getTranslation("paywithTONUSDTorcardpayments") }}
        </p>
        <p class="text-16 lh-120 tac">
          {{
            getTranslation(
              "enjoylowerpricesthantheofficialTelegrambotwithnoKYCverificationrequired"
            )
          }}
        </p>
      </div>
    </div>
    <div class="aboutus-other">
      <p class="text-16 lh-120 mb-12">{{ getTranslation("aboutus") }}</p>
      <div class="aboutus-other-cards">
        <div class="aboutus-other-card">
          <img src="../assets/img/Star.svg" alt="" class="img-16" />
          <p class="text-24 text-white">100 000</p>
          <p class="text-14 lh-120 jse">{{ getTranslation("boughttoday") }}</p>
        </div>
        <div class="aboutus-other-card">
          <img src="../assets/img/Star.svg" alt="" class="img-16" />
          <p class="text-24 text-white">100 000</p>
          <p class="text-14 lh-120 jse">
            {{ getTranslation("boughtyesterday") }}
          </p>
        </div>
        <div class="aboutus-other-card">
          <img src="../assets/img/Star.svg" alt="" class="img-16" />
          <p class="text-24 text-white">100 000</p>
          <p class="text-14 lh-120 jse">
            {{ getTranslation("boughtalltime") }}
          </p>
        </div>
        <div class="aboutus-other-card">
          <img src="../assets/img/Star.svg" alt="" class="img-16" />
          <p class="text-24 text-white">100 000</p>
          <p class="text-14 lh-120 jse">
            {{ getTranslation("boughtmonthpremium") }}
          </p>
        </div>
      </div>
    </div>
    <div class="aboutus-bottom">
      <p class="text-16 lh-120 mb-12">{{ getTranslation("FAQ") }}</p>
      <div class="aboutus-bottom-accordion flex-col">
        <div
          v-for="(accordion, index) in getTranslation('FAQData')"
          :key="index"
          @click="switchAccordion(index)"
          class="aboutus-bottom-accordion-item"
        >
          <div class="aboutus-bottom-accordion-item-top flex-row items-center">
            <p class="text-18 text-white">{{ accordion[0] }}</p>
            <div
              class="accordion-checkbox jse"
              :class="{ 'accordion-checkbox-active': isAccordionActive(index) }"
            >
              <img src="../assets/img/Arrow down.svg" alt="" class="img-24" />
            </div>
          </div>
          <div
            class="aboutus-bottom-accordion-item-bottom"
            :class="{
              'aboutus-bottom-accordion-item-bottom-active':
                isAccordionActive(index),
            }"
          >
            <p class="text-16 lh-140"><br />{{ accordion[1] }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.aboutus-cover {
  padding: 0 24px;
}
.aboutus-btn {
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
  padding: 16px;
  justify-content: space-between;
}
.aboutus-cover-header {
  display: table;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.7) 0%,
    #ffffff 49%,
    rgba(255, 255, 255, 0.5) 97%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #0b2349;
  display: table;
}
.aboutus-cover-card {
  background: linear-gradient(180deg, #3f87c7 0%, #103960 100%);
  padding: 28px 20px;
}
.aboutus-cover-card-img {
  width: 154px;
  height: 154px;
}
.aboutus-other {
}
.aboutus-other-cards {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 36px;
}
.aboutus-other-card {
  display: grid;
  grid-template-columns: auto auto 1fr;
  position: relative;
}
.aboutus-other-card:nth-child(n + 2)::after {
  content: "";
  width: 100%;
  position: absolute;
  height: 2px;
  background: var(--blue-900);
  top: -19px;
}
.aboutus-bottom {
}
.aboutus-bottom-accordion {
  gap: 36px;
}
.aboutus-bottom-accordion-item {
  position: relative;
}
.aboutus-bottom-accordion-item:nth-child(n + 2)::after {
  content: "";
  width: 100%;
  position: absolute;
  height: 2px;
  background: var(--blue-900);
  top: -19px;
}
.aboutus-bottom-accordion-item-top {
  width: 100%;
  justify-content: space-between;
}
.accordion-checkbox {
  transition: transform 0.3s ease-in-out;
}
.accordion-checkbox-active {
  transform: rotate(180deg);
}
.aboutus-bottom-accordion-item-bottom {
  max-height: 0px;
  height: auto;
  overflow: hidden;
  transition: max-height 0.2s ease-in-out;
}
.aboutus-bottom-accordion-item-bottom-active {
  max-height: 200px;
  transition: max-height 0.2s ease-in-out;
}
</style>
