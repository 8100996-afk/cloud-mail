<template>
  <div id="login-box" :style=" background ? 'background: var(--el-bg-color)' : ''" v-loading="oauthLoading" element-loading-text="登录中...">
    <div v-if="settingStore.settings.background" class="custom-bg" :style="background"></div>
    <div class="form-wrapper">
      <div class="container">
        <div class="brand-head">
          <BrandLogo :size="40"/>
        </div>

        <!-- ===================== 登录 ===================== -->
        <template v-if="show === 'login'">
          <!-- 步骤1：邮箱 -->
          <div v-show="loginStep === 1">
            <h1 class="g-title">{{ $t('loginBtn') }}</h1>
            <p class="g-subtitle">{{ $t('loginSub', {brand: settingStore.settings.title}) }}</p>
            <el-input :class="settingStore.settings.loginDomain === 0 ? 'email-input' : ''" v-model="form.email"
                      type="text" :placeholder="$t('emailAccount')" autocomplete="off" @keyup.enter="nextLoginEmail">
              <template #append v-if="settingStore.settings.loginDomain === 0">
                <div @click.stop="openSelect">
                  <el-select ref="mySelect" v-model="suffix" :placeholder="$t('select')" class="select">
                    <el-option v-for="item in domainList" :key="item" :label="item" :value="item"/>
                  </el-select>
                  <div style="color: var(--el-text-color-primary)">
                    <span>{{ suffix }}</span>
                    <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                  </div>
                </div>
              </template>
            </el-input>
            <div class="g-actions">
              <span class="g-link" v-if="settingStore.settings.register === 0" @click="goRegister">{{ $t('regSwitch') }}</span>
              <span v-else></span>
              <el-button class="g-btn" type="primary" @click="nextLoginEmail">{{ $t('continueBtn') }}</el-button>
            </div>
          </div>
          <!-- 步骤2：密码 -->
          <div v-show="loginStep === 2">
            <h1 class="g-title">{{ $t('welcomeBack') }}</h1>
            <div class="account-chip" @click="loginStep = 1">
              <span class="chip-avatar">{{ (form.email[0] || '').toUpperCase() }}</span>
              <span class="chip-email">{{ form.email + (settingStore.settings.loginDomain === 0 ? suffix : '') }}</span>
              <Icon icon="mingcute:down-small-fill" width="18" height="18"/>
            </div>
            <el-input v-model="form.password" :placeholder="$t('password')" type="password" autocomplete="off" @keyup.enter="submit"/>
            <div class="g-actions">
              <span class="g-link" @click="loginStep = 1">{{ $t('backBtn') }}</span>
              <el-button class="g-btn" type="primary" @click="submit" :loading="loginLoading">{{ $t('loginBtn') }}</el-button>
            </div>
            <el-button class="btn linuxdo-btn" v-if="settingStore.settings.linuxdoSwitch" @click="linuxDoLogin">
              <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px" />LinuxDo
            </el-button>
          </div>
        </template>

        <!-- ===================== 注册 ===================== -->
        <template v-else>
          <!-- 步骤1：昵称 -->
          <div v-show="regStep === 1">
            <h1 class="g-title">{{ $t('regSwitch') }}</h1>
            <p class="g-subtitle">{{ $t('regNameSub') }}</p>
            <el-input v-model="registerForm.name" type="text" :placeholder="$t('nicknameOptional')" autocomplete="off" @keyup.enter="regStep = 2"/>
            <div class="g-actions">
              <span class="g-link" @click="goLogin">{{ $t('loginSwitch') }}</span>
              <el-button class="g-btn" type="primary" @click="regStep = 2">{{ $t('continueBtn') }}</el-button>
            </div>
          </div>
          <!-- 步骤2：选邮箱 -->
          <div v-show="regStep === 2">
            <h1 class="g-title">{{ $t('regEmailTitle') }}</h1>
            <p class="g-subtitle">{{ $t('regEmailSub', {brand: settingStore.settings.title}) }}</p>
            <el-input class="email-input" v-model="registerForm.email" type="text" :placeholder="$t('emailAccount')"
                      autocomplete="off" @keyup.enter="nextRegEmail">
              <template #append>
                <div @click.stop="openSelect">
                  <el-select ref="mySelect" v-model="suffix" :placeholder="$t('select')" class="select">
                    <el-option v-for="item in domainList" :key="item" :label="item" :value="item"/>
                  </el-select>
                  <div>
                    <span>{{ suffix }}</span>
                    <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                  </div>
                </div>
              </template>
            </el-input>
            <div class="g-actions">
              <span class="g-link" @click="regStep = 1">{{ $t('backBtn') }}</span>
              <el-button class="g-btn" type="primary" @click="nextRegEmail">{{ $t('continueBtn') }}</el-button>
            </div>
          </div>
          <!-- 步骤3：设密码 -->
          <div v-show="regStep === 3">
            <h1 class="g-title">{{ $t('regPwdTitle') }}</h1>
            <p class="g-subtitle">{{ $t('regPwdSub') }}</p>
            <el-input v-model="registerForm.password" :placeholder="$t('password')" type="password" autocomplete="off"/>
            <el-input v-model="registerForm.confirmPassword" :placeholder="$t('confirmPwd')" type="password" autocomplete="off"/>
            <el-input v-if="settingStore.settings.regKey === 0" v-model="registerForm.code" :placeholder="$t('regKey')"
                      type="text" autocomplete="off"/>
            <el-input v-if="settingStore.settings.regKey === 2" v-model="registerForm.code"
                      :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
            <div v-show="verifyShow"
                 class="register-turnstile"
                 :data-sitekey="settingStore.settings.siteKey"
                 data-callback="onTurnstileSuccess"
                 data-error-callback="onTurnstileError"
                 data-after-interactive-callback="loadAfter"
                 data-before-interactive-callback="loadBefore">
              <span style="font-size: 12px;color: #F56C6C" v-if="botJsError">{{ $t('verifyModuleFailed') }}</span>
            </div>
            <div class="g-actions">
              <span class="g-link" @click="regStep = 2">{{ $t('backBtn') }}</span>
              <el-button class="g-btn" type="primary" @click="submitRegister" :loading="registerLoading">{{ $t('createAccountBtn') }}</el-button>
            </div>
            <el-button v-if="settingStore.settings.linuxdoSwitch" class="btn linuxdo-btn" @click="linuxDoLogin">
              <el-avatar src="/image/linuxdo.webp" :size="18" style="margin-right: 10px" />LinuxDo
            </el-button>
          </div>
        </template>

        <div class="policy-links">
          <span>{{ $t('footerAgree') }}</span>
          <router-link class="policy-link" to="/privacy">{{ $t('privacyPolicy') }}</router-link>
          <span>{{ $t('footerAnd') }}</span>
          <router-link class="policy-link" to="/terms">{{ $t('termsOfService') }}</router-link>
        </div>
      </div>
    </div>
    <el-dialog class="bind-dialog" v-model="showBindForm"  title="注册邮箱" >
      <div class="bind-container">
        <el-input v-model="bindForm.email" type="text" :placeholder="$t('emailAccount')" autocomplete="off">
          <template #append>
            <div @click.stop="openSelect">
              <el-select
                  ref="mySelect"
                  v-model="suffix"
                  :placeholder="$t('select')"
                  class="select"
              >
                <el-option
                    v-for="item in domainList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
              <div>
                <span>{{ suffix }}</span>
                <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
              </div>
            </div>
          </template>
        </el-input>
        <el-input v-if="settingStore.settings.regKey === 0" v-model="bindForm.code" :placeholder="$t('regKey')"
                  type="text" autocomplete="off"/>
        <el-input v-if="settingStore.settings.regKey === 2" v-model="bindForm.code"
                  :placeholder="$t('regKeyOptional')" type="text" autocomplete="off"/>
        <el-button class="btn" type="primary" @click="bind" :loading="bindLoading"
        >绑定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import router from "@/router";
import {computed, nextTick, reactive, ref} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import {oauthBindUser, oauthLinuxDoLogin} from "@/request/ouath.js";
import BrandLogo from "@/components/brand-logo/index.vue";

const {t} = useI18n();
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const loginLoading = ref(false)
const bindLoading = ref(false)
const oauthLoading = ref(false);
const showBindForm = ref(false);
const show = ref('login')
const loginStep = ref(1)
const regStep = ref(1)

const bindForm = reactive({
  email: '',
  oauthUserId: '',
  code: ''
})

const form = reactive({
  email: '',
  password: '',

});
const mySelect = ref()
const suffix = ref('')
const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const domainList = settingStore.domainList;
const registerLoading = ref(false)
suffix.value = domainList[0]
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0

window.onTurnstileSuccess = (token) => {
  verifyToken = token;
};

window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) {
    return
  }
  verifyErrorCount++
  console.warn('人机验加载失败', e)
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};

window.loadAfter = (e) => {
  console.log('loadAfter')
}

window.loadBefore = (e) => {
  console.log('loadBefore')
}

const loginOpacity = computed(() => {
  const opacity = settingStore.settings.loginOpacity
  return uiStore.dark ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`
})

const background = computed(() => {

  return settingStore.settings.background ? {
    'background-image': `url(${cvtR2Url(settingStore.settings.background)})`,
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'background-position': 'center'
  } : ''
})

const openSelect = () => {
  mySelect.value.toggleMenu()
}

function goRegister() {
  show.value = 'register'
  regStep.value = 1
}

function goLogin() {
  show.value = 'login'
  loginStep.value = 1
}

function nextLoginEmail() {
  if (!form.email) {
    ElMessage({message: t('emptyEmailMsg'), type: 'error', plain: true})
    return
  }
  const email = form.email + (settingStore.settings.loginDomain === 0 ? suffix.value : '')
  if (!isEmail(email)) {
    ElMessage({message: t('notEmailMsg'), type: 'error', plain: true})
    return
  }
  loginStep.value = 2
}

function nextRegEmail() {
  if (!registerForm.email) {
    ElMessage({message: t('emptyEmailMsg'), type: 'error', plain: true})
    return
  }
  if (registerForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}), type: 'error', plain: true})
    return
  }
  if (!isEmail(registerForm.email + suffix.value)) {
    ElMessage({message: t('notEmailMsg'), type: 'error', plain: true})
    return
  }
  regStep.value = 3
}

function linuxDoLogin() {
  const clientId = settingStore.settings.linuxdoClientId
  const redirectUri = encodeURIComponent(settingStore.settings.linuxdoCallbackUrl)
  window.location.href =
      `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email`
}

linuxDoGetUser();

async function linuxDoGetUser() {

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (code) {

    oauthLoading.value = true
    oauthLinuxDoLogin(code).then(data => {

      bindForm.oauthUserId = data.userInfo.oauthUserId;

      if (!data.token) {
        showBindForm.value = true
        oauthLoading.value = false
        ElMessage({
          message: '请注册绑定一个邮箱',
          type: 'warning',
          duration: 4000,
          plain: true,
        })
        return;
      }

      saveToken(data.token);
    }).catch(() => {
      oauthLoading.value = false
    })
  }

  const cleanUrl = window.location.origin + window.location.pathname
  window.history.replaceState({}, '', cleanUrl)
}

function bind() {

  if (!bindForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }


  if (bindForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = bindForm.email + suffix.value;


  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!bindForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  const form = {email: bindForm.email + suffix.value, oauthUserId: bindForm.oauthUserId, code: bindForm.code}

  bindLoading.value = true
  oauthBindUser(form).then(data => {
    saveToken(data.token)
  }).catch(() => {
    bindLoading.value = false
  })
}

const submit = () => {

  if (!form.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  let email = form.email + (settingStore.settings.loginDomain === 0 ? suffix.value : '');

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  loginLoading.value = true
  login(email, form.password).then(async data => {
    await saveToken(data.token)
  }).finally(() => {
    loginLoading.value = false
  })
}

async function saveToken(token) {
  localStorage.setItem('token', token)
  const user = await loginUserInfo();
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => {
    router.addRoute('layout', routerData);
  });
  await router.replace({name: 'layout'})
  uiStore.showNotice()
  oauthLoading.value = false;
  bindLoading.value = false;
}


function submitRegister() {

  if (!registerForm.email) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  console.log(registerForm.email)

  if (registerForm.email.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!isEmail(registerForm.email + suffix.value)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!registerForm.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {

    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!registerForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile.render('.register-turnstile')
          } catch (e) {
            botJsError.value = true
            console.log('人机验证js加载失败')
          }
        } else {
          window.turnstile.reset('.register-turnstile')
        }
      })
    } else if (!botJsError.value) {
      ElMessage({
        message: t('botVerifyMsg'),
        type: "error",
        plain: true
      })
    }
    return;
  }

  registerLoading.value = true

  const form = {
    email: registerForm.email + suffix.value,
    password: registerForm.password,
    name: registerForm.name,
    token: verifyToken,
    code: registerForm.code
  }

  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    loginStep.value = 1
    regStep.value = 1
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''
    registerLoading.value = false
    verifyToken = ''
    settingStore.settings.regVerifyOpen = regVerifyOpen
    verifyShow.value = false
    ElMessage({
      message: t('regSuccessMsg'),
      type: 'success',
      plain: true,
    })
  }).catch(res => {

    registerLoading.value = false

    if (res.code === 400) {
      verifyToken = ''
      settingStore.settings.regVerifyOpen = true
      if (turnstileId) {
        window.turnstile.reset(turnstileId)
      } else {
        nextTick(() => {
          turnstileId = window.turnstile.render('.register-turnstile')
        })
      }
      verifyShow.value = true

    }
  });
}

</script>


<style>
.el-select-dropdown__item {
  padding: 0 15px;
}

.no-autofill-pwd {
  .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

<style lang="scss" scoped>

.form-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.container {
  position: relative;
  background: v-bind(loginOpacity);
  padding: 40px 40px 26px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 448px;
  border: 1px solid var(--light-border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(60, 64, 67, .12), 0 4px 18px rgba(60, 64, 67, .10);
  @media (max-width: 480px) {
    padding: 30px 22px 22px;
  }

  .brand-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
  }

  .g-title {
    margin: 8px 0 6px;
    font-weight: 400;
    font-size: 26px;
    line-height: 1.3;
    text-align: center;
    color: var(--el-text-color-primary);
  }

  .g-subtitle {
    margin: 0 0 28px;
    font-size: 15px;
    text-align: center;
    color: var(--form-desc-color);
  }

  .g-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 22px;
  }

  .g-link {
    color: var(--login-switch-color);
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
  }

  .g-btn {
    height: 38px;
    min-width: 84px;
    border-radius: 8px;
    font-weight: 500;
    padding: 0 24px;
  }

  .btn {
    height: 40px;
    width: 100%;
    border-radius: 8px;
    font-weight: 500;
  }

  .linuxdo-btn {
    margin-top: 16px;
  }

  .account-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    max-width: 100%;
    margin: 2px auto 26px;
    padding: 4px 12px 4px 6px;
    border: 1px solid var(--base-border-color);
    border-radius: 999px;
    font-size: 14px;
    color: var(--el-text-color-primary);
    cursor: pointer;

    .chip-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--el-color-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
      flex: none;
    }

    .chip-email {
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    background: var(--el-bg-color);
  }

  .email-input :deep(.el-input__wrapper) {
    border-radius: 8px 0 0 8px;
    background: var(--el-bg-color);
  }

  .el-input {
    height: 44px;
    width: 100%;
    margin-bottom: 18px;

    :deep(.el-input__inner) {
      height: 42px;
    }
  }
}

.policy-links {
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid var(--light-border);
  text-align: center;
  font-size: 12.5px;
  line-height: 1.8;
  color: var(--secondary-text-color);

  .policy-link {
    color: var(--login-switch-color);
    text-decoration: none;
    margin: 0 3px;
  }

  .policy-link:hover {
    text-decoration: underline;
  }
}

:deep(.el-select-dropdown__item) {
  padding: 0 10px;
}

:deep(.bind-dialog) {
  width: 400px !important;
  @media (max-width: 440px) {
    width: calc(100% - 40px) !important;
    margin-right: 20px !important;
    margin-left: 20px !important;
  }
}

.bind-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.setting-icon {
  position: relative;
  top: 6px;
}


:deep(.el-input-group__append) {
  padding: 0 !important;
  padding-left: 8px !important;
  padding-right: 4px !important;
  background: var(--el-bg-color);
  border-radius: 0 8px 8px 0;
}

:deep(.el-button+.el-button) {
  margin: 0;
}

.register-turnstile {
  margin-bottom: 18px;
}

.select {
  position: absolute;
  right: 30px;
  width: 100px;
  opacity: 0;
  pointer-events: none;
}

.custom-style {
  margin-bottom: 10px;
}

.custom-style .el-segmented {
  --el-border-radius-base: 6px;
  width: 180px;
}


#login-box {
  position: relative;
  background: var(--el-bg-color);
  font-family: inherit;
  min-height: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
}

.custom-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}

</style>
