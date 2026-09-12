<template>
  <!-- 原创信封图标：谷歌配色的简约风格，非谷歌官方商标 -->
  <svg
      class="brand-logo"
      :width="size"
      :height="size"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="mail logo"
  >
    <rect x="4" y="10" width="40" height="28" rx="6" fill="var(--el-bg-color, #ffffff)" stroke="#dadce0" stroke-width="2"/>
    <!-- 左侧信封折线（谷歌蓝） -->
    <path d="M6 13 L24 27 L24 31 L6 17 Z" fill="#1a73e8"/>
    <!-- 右侧信封折线（Gmail 红） -->
    <path d="M42 13 L24 27 L24 31 L42 17 Z" fill="#ea4335"/>
    <!-- 顶部折角高光（谷歌黄 / 绿点缀） -->
    <path d="M6 13 L24 27 L42 13" stroke="#fbbc04" stroke-width="2" stroke-linejoin="round" fill="none" opacity="0.9"/>
    <circle cx="24" cy="30" r="2.4" fill="#34a853"/>
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 48
  }
})
</script>

<style scoped>
.brand-logo {
  display: block;
}
</style>
