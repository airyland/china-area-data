# 中国行政区域数据

## 安装

```
npm install china-area-data
```

## 版本说明

目录下的 `data.json` 默认为最新版本。务必先查看变更再升级大版本。

### v5

[国家统计局统计数据（2019年10月31日）](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/index.html)

* 更新最新数据。
* 东莞和中山没有区，填充了下一级的县信息。
* 补充了台湾省数据。
* 增加 data-array.json 数组格式。

### v4

同 v3，但是把原来应该在县下的从直辖市分离出来。

### v3

[最新县及县以上行政区划代码（截止2016年7月31日）](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html)

### v2

[最新县及县以上行政区划代码（截止2015年9月30日）](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201608/t20160809_1386477.html)


## 更新

### v4.0.0

数据源同 v3，但是重庆下的县作为列表放出来。

<p align="center">
  <img src="./v4.0.0.changes.png" alt="">
</p>

### v3.0.0

根据 2017.03.10 统计局数据进行更新

<p align="center">
  <img src="./v3.0.0.changes.png" alt="">
</p>


### v2.1.0

简化市辖区，不加市前缀。比如 北京市 - 北京市市辖区 - 东城区 => 北京市 - 市辖区 - 东城区

<p align="center">
  <img src="./v2.1.0.changes.png" alt="">
</p>

### v2.0.0

- 按照[最新统计局数据](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201608/t20160809_1386477.html)进行更新，部分区域已经不存在，部分id做了更新。因此请*谨慎*更新，评估后端数据存储设计和前端交互再进行更新，避免错误更新用户数据或者导致数据丢失。

完整更新如图
<p align="center">
  <img src="./v2.0.0.changes.png" alt="">
</p>
