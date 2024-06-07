
var fs = require('fs');
const path = require('path')
const translate = require('google-translate-api');
const { config } = require('./config')

const defaultPath = path.resolve(__dirname, '../src/locales')


const getData = async (obj, target, lang) => {
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      if (!target.hasOwnProperty(key)) {
        target[key] = {};
      }
      await getData(value, target[key], lang);
    } else {
      if (!target.hasOwnProperty(key)) {
        let res = await translate(obj[key], { to: lang })
        console.log(lang, key, res.text);
        target[key] = res.text;
      }
    }
  }
}

const translated = (lang) => {
  return new Promise((resolve) => {
    fs.readFile(`${defaultPath}/${config.from}.json`, 'utf8', async (err, dataOne) => {
      let datas_one = JSON.parse(dataOne)
      let url = `${defaultPath}/${lang}.json`
      let dataTwo = {}
      if (fs.existsSync(url)) {
        const data = fs.readFileSync(url, 'utf8')
        dataTwo = data ? JSON.parse(data) : {}
      }
      await getData(datas_one, dataTwo, lang);
      fs.writeFileSync(url, JSON.stringify(dataTwo))
      resolve()
    })
  })

}

  ; (async function () {
    for (item of config.to) {
      await translated(item.googleLoca)
    }
  })()


