'use strict'

const fs = require('fs')
const path = require('path')
const getPath = function (dir) {
  return path.join(__dirname, dir)
}

let intentMap = {
  '2': [6, 7, 8],
  '3': [5, 10, 7],
  '4': [5, 10, 7]
}

// build(2)
// build(3)
build(4)

function build (version) {
  const datas = fs.readFileSync(getPath(`../v${version}/data.v${version}.txt`), 'utf-8')
  const list = datas.split('\n')
  let rs = {
    86: {}
  }
  let province = []
  let city = []
  let cities = {}

  list.forEach((one, index) => {

    let list = one.split(' ').filter(one => {
      return one
    }).map(one => {
      return one.replace(/\s+/g, '')
    })
    list[0] = list[0] * 1

    let provinceReg = new RegExp(`\\d\\s{${intentMap[version][0]}}\\S`)

    if (provinceReg.test(one)) {
      // 省
      rs['86'][list[0]] = list[1]
      province = [list[0], list[1]]
    }

    let cityReg = new RegExp(`\\d\\s{${intentMap[version][1]}}\\S`)
    if (cityReg.test(one)) {
      // 市
      if (list[1] === '市辖区') {
        list[1] = '市辖区'
      }

      // if (list[1] !== '县') {
        city = [list[0], list[1]]
        if (!rs[province[0]]) {
          rs[province[0]] = {}
        }
        rs[province[0]][list[0]] = list[1]
      // }

      if (!cities[list[0]]) {
        cities[list[0]] = {
          name: list[1],
          number: 0
        }
      } else {

      }

    }

    let districReg = new RegExp(`\\d\\s{${intentMap[version][2]}}\\S`)

    if (districReg.test(one)) {
      // 区
      if (list[1] !== '市辖区') {
        if (!rs[city[0]]) {
          rs[city[0]] = {}
        }
        if (city[1] === '省直辖县级行政区划' || city[1] === '自治区直辖县级行政区划') { // 直辖县直接转为市
          rs[province[0]][list[0]] = list[1]
          cities[list[0]] = {
            name: list[1],
            number: 0
          }
        } else {
          rs[city[0]][list[0]] = list[1]
          cities[city[0]] && cities[city[0]].number++
        }

      }

    }
  })

  // 删除省直辖县级行政区划
  for (let i in rs) {
    for (let j in rs[i]) {
      if (rs[i][j] === '省直辖县级行政区划' || rs[i][j] === '自治区直辖县级行政区划') {
        delete rs[i][j]
      }
    }
    if (!Object.keys(rs[i]).length) {
      delete rs[i]
    }
  }

  // 其他地区暂不更新
  const special = {
    "810000": {
      "810001": "中西區",
      "810002": "灣仔區",
      "810003": "東區",
      "810004": "南區",
      "810005": "油尖旺區",
      "810006": "深水埗區",
      "810007": "九龍城區",
      "810008": "黃大仙區",
      "810009": "觀塘區",
      "810010": "荃灣區",
      "810011": "屯門區",
      "810012": "元朗區",
      "810013": "北區",
      "810014": "大埔區",
      "810015": "西貢區",
      "810016": "沙田區",
      "810017": "葵青區",
      "810018": "離島區"
    },
    "820000": {
      "820001": "花地瑪堂區",
      "820002": "花王堂區",
      "820003": "望德堂區",
      "820004": "大堂區",
      "820005": "風順堂區",
      "820006": "嘉模堂區",
      "820007": "路氹填海區",
      "820008": "聖方濟各堂區"
    }
  }

  rs = Object.assign(rs, special)

  require('fs').writeFileSync(getPath('../data.json'), JSON.stringify(rs, null, 2))
  require('fs').writeFileSync(getPath(`../v${version}/data.json`), JSON.stringify(rs, null, 2))
  require('fs').writeFileSync(getPath('../data.js'), 'module.exports = ' + JSON.stringify(rs, null, 2))
  require('fs').writeFileSync(getPath(`../v${version}/data.js`), 'module.exports = ' + JSON.stringify(rs, null, 2))


  let citiesId = []
  for (let i in cities) {
    if (cities[i].number > 0) {
      delete cities[i]
    } else {
      citiesId.push(i)
    }
  }

  require('fs').writeFileSync(`./v${version}/only_2_level_city_id.json`, JSON.stringify(citiesId))
}