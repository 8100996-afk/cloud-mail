<template>
  <div class="policy-page">
    <header class="policy-header">
      <div class="policy-header-inner">
        <div class="brand" @click="goLogin">
          <BrandLogo :size="32"/>
          <span class="brand-name">{{ brand }}</span>
        </div>
        <el-button class="back-btn" text @click="goLogin">
          <Icon icon="mingcute:left-line" width="18" height="18"/>
          <span>{{ $t('backToLogin') }}</span>
        </el-button>
      </div>
    </header>

    <main class="policy-main">
      <article class="policy-card">
        <h1 class="policy-title">{{ title }}</h1>
        <p class="policy-updated">{{ $t('lastUpdated') }}：{{ updated }}</p>
        <div class="policy-content">
          <slot/>
        </div>
      </article>
    </main>

    <footer class="policy-footer">
      <div class="footer-links">
        <router-link to="/privacy">{{ $t('privacyPolicy') }}</router-link>
        <span class="dot">·</span>
        <router-link to="/terms">{{ $t('termsOfService') }}</router-link>
      </div>
      <div class="footer-copy">© {{ year }} {{ brand }}</div>
    </footer>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useRouter} from "vue-router";
import {useSettingStore} from "@/store/setting.js";
import {Icon} from "@iconify/vue";
import BrandLogo from "@/components/brand-logo/index.vue";

defineProps({
  title: {type: String, default: ''},
  updated: {type: String, default: '2026-09-12'}
})

const router = useRouter()
const settingStore = useSettingStore()

const brand = computed(() => settingStore.settings.title || '亚洲12300邮箱')
const year = new Date().getFullYear()

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.policy-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

.policy-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--light-border);
}

.policy-header-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .2px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--el-color-primary);
}

.policy-main {
  flex: 1;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 28px 20px 48px;
}

.policy-card {
  background: var(--el-bg-color);
}

.policy-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
}

.policy-updated {
  color: var(--secondary-text-color);
  font-size: 13px;
  margin-bottom: 28px;
}

.policy-content {
  font-size: 15px;
  line-height: 1.9;
  color: var(--regular-text-color);
}

.policy-content :deep(h2) {
  font-size: 19px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 30px 0 10px;
}

.policy-content :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 20px 0 8px;
}

.policy-content :deep(p) {
  margin: 10px 0;
}

.policy-content :deep(ul) {
  margin: 10px 0;
  padding-left: 4px;
}

.policy-content :deep(li) {
  position: relative;
  padding-left: 18px;
  margin: 7px 0;
}

.policy-content :deep(li)::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-primary);
}

.policy-content :deep(a) {
  color: var(--el-color-primary);
  text-decoration: none;
}

.policy-content :deep(a:hover) {
  text-decoration: underline;
}

.policy-content :deep(strong) {
  color: var(--el-text-color-primary);
}

.policy-footer {
  border-top: 1px solid var(--light-border);
  padding: 18px 20px 28px;
  text-align: center;
  color: var(--secondary-text-color);
  font-size: 13px;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.footer-links a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.dot {
  color: var(--secondary-text-color);
}

@media (max-width: 767px) {
  .policy-title {
    font-size: 24px;
  }

  .brand-name {
    font-size: 16px;
  }
}
</style>
