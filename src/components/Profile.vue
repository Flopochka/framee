<script setup>
import { useLanguageStore } from "../stores/language";
import { useModalStore } from "../stores/modal";

const { toggleModal } = useModalStore();
const { getTranslation, langs, getCurrentLanguage} = useLanguageStore();
defineProps(["switchScreen"]);
</script>

<template>
  <main class="gap-28 p-24">
    <div class="user-stat-box rounded-12">
      <p class="text-16">{{ getTranslation("totalUsers") }}</p>
      <p class="text-16">{{ getTranslation("totalEarnings") }}</p>
      <p class="text-20 lh-120 flex-row items-center justify-center gap-4">
        3
        <img src="../assets/img/People.svg" alt="" class="img-24" />
      </p>
      <p class="text-20 lh-120 flex-row items-center justify-center">
        2.33
        <img src="../assets/img/TONMinimal.svg" alt="" class="img-20" />
      </p>
      <div @click="switchScreen(4)" class="user-stat-box-btn btn rounded-8">
        <p class="user-stat-box-btn-text text-14 lh-22">
          {{ getTranslation("Withdraw") }}
        </p>
      </div>
    </div>
    <div class="user-referal-box">
      <p class="user-referal-box-header text-12 tac lh-22">
        {{ getTranslation("Invitefriendsandearn5fromtheirpurchases") }}
      </p>
      <div
        class="user-referal-box-btn-invite flex-row gap-4 rounded-12 items-center justify-center"
      >
        <img src="../assets/img/Gift.svg" alt="" class="img-16" />
        <p class="text-17 text-white">{{ getTranslation("Inviteafriend") }}</p>
      </div>
      <div
        class="user-referal-box-btn-copy rounded-12 items-center justify-center flex-row"
      >
        <img src="../assets/img/Copy.svg" alt="" class="img-28" />
      </div>
    </div>
    <div class="user-buttons-1 flex-col gap-8">
      <div
        @click="toggleModal('history')"
        class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center"
      >
        <p class="text-16 text-neutral-200">{{ getTranslation("History") }}</p>
        <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90" />
      </div>
      <div
        class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center"
      >
        <p class="text-16 text-neutral-200">{{ getTranslation("Support") }}</p>
        <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90" />
      </div>
      <div
        class="user-buttons-1-item rounded-10 bg-blue-900 flex-row items-center"
      >
        <p class="text-16 text-neutral-200">
          {{ getTranslation("OurTelegram") }}
        </p>
        <img src="../assets/img/Arrow down.svg" alt="" class="img-24 rot-90" />
      </div>
    </div>
    <div class="user-language flex-col gap-6">
      <p class="text-14 pl-12">{{ getTranslation("Language") }}</p>
      <div
        @click="toggleModal('lang')"
        class="user-language-item rounded-10 bg-blue-900 flex-row items-center"
      >
        <p class="text-16 text-neutral-200">{{ langs[getCurrentLanguage()] }}</p>
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
  background: url("data:image/svg+xml,%3Csvg width='354' height='156' viewBox='0 0 354 156' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M260.296 67.6652L272.565 38.0326C273.98 34.614 278.102 32.8587 281.771 34.1119C283.212 34.6039 284.433 35.5188 285.25 36.7187L302.579 62.1614C303.995 64.2398 306.461 65.4977 309.135 65.5053L339.707 65.5921C343.858 65.6039 347.155 68.7291 347.073 72.5723C347.039 74.1552 346.423 75.6891 345.328 76.9209L323.775 101.15C322.905 102.128 322.571 103.419 322.872 104.639L329.984 133.457C331.002 137.583 328.201 141.748 323.727 142.76C322.032 143.143 320.258 143.027 318.656 142.426L292.062 132.458C290.138 131.737 287.938 131.947 286.181 133.019L261.367 148.165C257.874 150.296 253.224 149.432 250.98 146.234C250.14 145.037 249.726 143.623 249.794 142.185L250.441 128.543C250.758 121.871 254.559 115.704 260.632 112.012L288.199 95.2521C288.935 94.8045 289.15 93.8953 288.679 93.2212C288.314 92.699 287.627 92.4552 286.969 92.6148L251.964 101.11C246.613 102.409 240.956 101.591 236.357 98.8534L223.576 91.246C219.929 89.0751 218.922 84.5478 221.329 81.1341C222.448 79.5465 224.177 78.4083 226.157 77.9553L256.092 71.1064C258.012 70.6671 259.587 69.3778 260.296 67.6652Z' fill='white' fill-opacity='0.05'/%3E%3Cg filter='url(%23filter0_f_2187_3632)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M138.471 48.5707L145.431 23.1083C146.234 20.1708 149.409 18.3209 152.522 18.9763C153.744 19.2336 154.831 19.8588 155.618 20.7576L172.314 39.8159C173.678 41.3728 175.813 42.1531 177.989 41.8903L202.874 38.8849C206.252 38.4769 209.254 40.7002 209.579 43.8508C209.713 45.1484 209.369 46.4644 208.603 47.5819L193.538 69.5602C192.929 70.4477 192.789 71.5365 193.159 72.5044L201.886 95.3505C203.135 98.6211 201.28 102.308 197.743 103.586C196.403 104.07 194.948 104.153 193.583 103.823L170.928 98.3497C169.289 97.9537 167.52 98.3466 166.2 99.4L147.554 114.28C144.93 116.374 141.058 116.135 138.905 113.746C138.1 112.853 137.619 111.738 137.528 110.556L136.663 99.3369C136.239 93.8497 138.704 88.425 143.268 84.7955L163.989 68.3182C164.542 67.8782 164.624 67.1132 164.172 66.6094C163.822 66.2192 163.238 66.089 162.719 66.2857L135.103 76.7539C130.881 78.3542 126.196 78.2547 122.174 76.4793L110.998 71.5456C107.809 70.1376 106.529 66.5373 108.139 63.5041C108.887 62.0935 110.178 60.9889 111.743 60.4193L135.401 51.8073C136.918 51.255 138.069 50.0423 138.471 48.5707Z' fill='white' fill-opacity='0.05'/%3E%3C/g%3E%3Cg filter='url(%23filter1_f_2187_3632)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M38.8166 88.0599L40.4308 73.0949C40.617 71.3685 42.2369 70.0397 44.049 70.1269C44.7604 70.1612 45.4288 70.4148 45.9534 70.8496L57.0778 80.0683C57.9866 80.8214 59.2591 81.0675 60.4606 80.7226L74.1983 76.7787C76.0633 76.2433 77.9546 77.2233 78.4227 78.9676C78.6155 79.686 78.5407 80.4581 78.2106 81.1566L71.7181 94.8935C71.4559 95.4481 71.4756 96.0738 71.7713 96.5853L78.7518 108.658C79.7511 110.386 79.0407 112.63 77.1651 113.669C76.4543 114.063 75.6425 114.241 74.8443 114.179L61.5943 113.148C60.6357 113.073 59.6754 113.454 59.0276 114.167L49.8766 124.232C48.5887 125.648 46.3872 125.864 44.9594 124.714C44.4251 124.283 44.0533 123.7 43.895 123.042L42.3927 116.804C41.6579 113.753 42.5543 110.476 44.7955 108.02L54.9701 96.8682C55.2418 96.5705 55.2188 96.1323 54.9187 95.8896C54.6862 95.7016 54.3455 95.6812 54.0713 95.8389L39.471 104.232C37.2391 105.514 34.592 105.883 32.1673 105.247L25.429 103.481C23.5061 102.977 22.4594 101.066 23.0912 99.2122C23.385 98.3503 24.0116 97.6116 24.8411 97.1493L37.3812 90.1599C38.1855 89.7116 38.7233 88.9248 38.8166 88.0599Z' fill='white' fill-opacity='0.05'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_f_2187_3632' x='103.443' y='14.8444' width='110.164' height='104.862' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='2' result='effect1_foregroundBlur_2187_3632'/%3E%3C/filter%3E%3Cfilter id='filter1_f_2187_3632' x='12.907' y='60.1229' width='76.2976' height='75.3301' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='5' result='effect1_foregroundBlur_2187_3632'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E")
      no-repeat center,
    linear-gradient(90deg, #133e67 0%, #0f497d 100%);
  background-size: contain;
}
.user-stat-box-btn {
  grid-area: E;
  width: 100%;
  background: var(--white-100);
  box-shadow: 0px 2px 6px 0px #10141c40;
  padding: 15px 12px;
  margin-top: 30px;
}
.user-stat-box-btn-text {
  display: table;
  background: linear-gradient(129.45deg, #4da9ec 9.38%, #0f67be 117.65%);
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
}
.user-referal-box::after {
  content: "";
  position: absolute;
  width: 80%;
  height: 1px;
  background: var(--blue-900-60);
  bottom: -14px;
  left: 10%;
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
.user-buttons-1 {
}
.user-buttons-1-item {
  justify-content: space-between;
  padding: 12px;
}
.user-language {
}
.user-language-item {
  justify-content: space-between;
  padding: 12px;
}
</style>
