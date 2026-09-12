<template>
  <el-scrollbar class="scroll">
    <div class="nav">
      <div class="brand">
        <BrandLogo :size="26"/>
        <div class="brand-name">{{ settingStore.settings.title }}</div>
      </div>

      <div class="compose-wrap" v-perm="'email:send'">
        <button class="compose-btn" @click="openWrite">
          <Icon icon="material-symbols:edit-outline" width="20" height="20"/>
          <span>{{ $t('compose') }}</span>
        </button>
      </div>

      <el-menu :collapse="false" class="nav-menu">
        <el-menu-item @click="router.push({name: 'email'})" index="email"
                      :class="route.meta.name === 'email' ? 'choose-item' : ''">
          <Icon icon="hugeicons:mailbox-01" width="20" height="20" />
          <span class="menu-name">{{$t('inbox')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'send'})" index="send" v-perm="'email:send'"
                      :class="route.meta.name === 'send' ? 'choose-item' : ''">
          <Icon icon="cil:send" width="20" height="20" />
          <span class="menu-name">{{$t('sent')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'draft'})" index="draft" v-perm="'email:send'"
                      :class="route.meta.name === 'draft' ? 'choose-item' : ''">
          <Icon icon="ep:document" width="19" height="19" />
          <span class="menu-name">{{$t('drafts')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'star'})" index="star"
                      :class="route.meta.name === 'star' ? 'choose-item' : ''">
          <Icon icon="solar:star-line-duotone" width="20" height="20" />
          <span class="menu-name">{{$t('starred')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'setting'})" index="setting"
                      :class="route.meta.name === 'setting' ? 'choose-item' : ''">
          <Icon icon="fluent:settings-48-regular" width="20" height="20" />
          <span class="menu-name">{{$t('settings')}}</span>
        </el-menu-item>
        <div class="manage-title" v-perm="['all-email:query','user:query','role:query','setting:query','analysis:query','reg-key:query']">
          <div>{{$t('manage')}}</div>
        </div>
        <el-menu-item @click="router.push({name: 'analysis'})" index="analysis" v-perm="'analysis:query'"
                      :class="route.meta.name === 'analysis' ? 'choose-item' : ''">
          <Icon icon="fluent:data-pie-20-regular" width="24" height="24" />
          <span class="menu-name">{{$t('analytics')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'user'})" index="user" v-perm="'user:query'"
                      :class="route.meta.name === 'user' ? 'choose-item' : ''">
          <Icon icon="si:user-alt-2-line" width="20" height="20" />
          <span class="menu-name">{{$t('allUsers')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'all-email'})" index="all-email" v-perm="'all-email:query'"
                      :class="route.meta.name === 'all-email' ? 'choose-item' : ''">
          <Icon icon="fluent:mail-list-28-regular" width="22" height="22" />
          <span class="menu-name">{{$t('allMail')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'role'})" index="role" v-perm="'role:query'"
                      :class="route.meta.name === 'role' ? 'choose-item' : ''">
          <Icon icon="fluent:lock-closed-16-regular" width="22" height="22" />
          <span class="menu-name">{{$t('permissions')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'reg-key'})" index="reg-key" v-perm="'reg-key:query'"
                      :class="route.meta.name === 'reg-key' ? 'choose-item' : ''">
          <Icon icon="fluent:fingerprint-20-filled" width="22" height="22" />
          <span class="menu-name">{{$t('inviteCode')}}</span>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'sys-setting'})" index="sys-setting" v-perm="'setting:query'"
                      :class="route.meta.name === 'sys-setting' ? 'choose-item' : ''">
          <Icon icon="eos-icons:system-ok-outlined" width="18" height="18" />
          <span class="menu-name">{{$t('SystemSettings')}}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script setup>
import router from "@/router/index.js";
import { useRoute } from "vue-router";
import {Icon} from "@iconify/vue";
import {useSettingStore} from "@/store/setting.js";
import {useUiStore} from "@/store/ui.js";
import BrandLogo from "@/components/brand-logo/index.vue";

const settingStore = useSettingStore();
const uiStore = useUiStore();
const route = useRoute();

function openWrite() {
  uiStore.writerRef.open()
  if (window.innerWidth < 1025) {
    uiStore.asideShow = false
  }
}
</script>

<style lang="scss" scoped>

.scroll {
  height: 100%;
  background: var(--aside-backgound);
}

.nav {
  padding: 8px 0 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px 8px;
  height: 44px;

  .brand-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 190px;
  }
}

.compose-wrap {
  padding: 8px 16px 12px;
}

.compose-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 24px 0 18px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  background: var(--compose-bg);
  box-shadow: 0 1px 3px rgba(60, 64, 67, .16), 0 1px 2px rgba(60, 64, 67, .10);
  transition: box-shadow .2s ease, background .2s ease;

  :deep(svg) {
    color: var(--el-color-primary);
  }
}

.compose-btn:hover {
  box-shadow: 0 1px 3px rgba(60, 64, 67, .2), 0 4px 8px rgba(60, 64, 67, .18);
  background: var(--compose-bg-hover);
}

.nav-menu {
  border-right: 0;
  width: 256px;
  background: transparent;
}

.manage-title {
  margin: 12px 0 4px;
  padding-left: 26px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .3px;
  color: var(--secondary-text-color);
  text-transform: uppercase;
}

:deep(.el-menu),
:deep(.el-menu-item) {
  background: transparent;
}

.el-menu-item {
  margin: 1px 12px 1px 0 !important;
  padding: 0 16px 0 26px !important;
  height: 40px;
  line-height: 40px;
  border-radius: 0 20px 20px 0;
  color: var(--el-text-color-primary);
  gap: 18px;
}

.menu-name {
  user-select: none;
  font-size: 14px;
}

.choose-item {
  font-weight: 600;
  color: var(--el-color-primary) !important;
  background: var(--el-color-primary-light-9) !important;

  :deep(svg) {
    color: var(--el-color-primary);
  }
}

@media (hover: hover) {
  .el-menu-item:hover {
    background: var(--nav-hover) !important;
  }

  .choose-item:hover {
    background: var(--el-color-primary-light-9) !important;
  }
}
</style>
