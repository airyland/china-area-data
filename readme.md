# 中国行政区域数据

## 更新

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
