// 生成 VUX x-address 组件需要的地址数据，不包含港澳台地区

"use strict"
const fs = require('fs')
const path = require('path')
const getPath = function (dir) {
  return path.join(__dirname, dir)
}

// build(2)
// build(3)
// build(4)
build(5)

function build (version) {
  const list = require(getPath(`../v${version}/data.json`))
  let rs = []

  for (var i in list) {
    for (var j in list[i]) {
      var item = {
        name: 　list[i][j],
        value: j + '',
      }
      if (i !== '86') {
        item.parent = i
      }
      rs.push(item)
      // if (!/台湾|行政/.test(item.name)) {
      //   rs.push(item)
      // }
    }
  }

  var _list = require(getPath(`../v${version}/only_2_level_city_id.json`))
  _list.forEach(function (one) {
    rs.push({
      name: '--',
      value: '--',
      parent: one + ''
    })
  })

  fs.writeFileSync(getPath(`../data-array.json`), JSON.stringify(rs, null, 4))
}
