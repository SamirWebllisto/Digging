import request from './request'
import i18n from '@/locales'
import enResult from '@/locales/en'


export async function setLang(langKey?: any) {
  if (!langKey) {
    langKey = localStorage.getItem('i18nextLng') || localStorage.getItem('langKey') || navigator.languages.find((item) => item.includes('-')) || 'en_US'
  }

  langKey = langKey.replace('-', '_')
  if (langKey.startsWith('zh_') && (langKey !== 'zh_CN' && langKey !== 'zh_HK')) {
    langKey = 'zh_HK'
  }

  const langs: Record<string, string> = {}

  enResult.result.forEach((item: { configKey: string; content: string }) => {
    if (item.configKey !== 'mining.invite' && item.configKey !== 'mining.highSpeedMining') {
      langs[item.configKey] = item.content
    }
  })
  i18n.addResourceBundle(langKey, 'translation', langs)
  i18n.changeLanguage(langKey)

  const { result } = await request.get('/common/lang/getByLangKey', {
    params: {
      langKey,
    },
  })

  result.forEach((item: { configKey: string; content: string }) => {
    langs[item.configKey] = item.content
  })
  console.log(langs)
  i18n.addResourceBundle(langKey, 'translation', langs)
  i18n.changeLanguage(langKey)
  try {
    const dataService = {
      "type": "lang_type_change",
      "lang_type": localStorage.getItem('i18nextLng')
    }
    // @ts-ignore
    document.getElementById("wolive-iframe")?.contentWindow?.postMessage(dataService, "*");
  } catch (error) { /* empty */ }
}
