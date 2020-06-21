const request = require('request-promise')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const md5 = require('md5')
const path = require('path')
const fs = require('fs')

const special = require('./special')

function sleep(time) {
	return new Promise(resolve => {
		console.log(`sleep: ${time}`)
		setTimeout(() => {
			resolve()
		}, time)
	})
}

async function getPage(url) {
	let content = ''
	const id = md5(url)
	const file = `./temp/${id}.html`
	if (fs.existsSync(file)) {
		content = fs.readFileSync(file, 'utf-8')
	} else {
		const rs = await request(url, {
			resolveWithFullResponse: true,
			encoding: null,
		})

		content = iconv.decode(rs.body, 'gb2312')
		fs.writeFileSync(file, content)
	}

	return content
}

;
(async() => {
	const cityIds = []
	const rs = {
		'86': {}
	}
	const level0 = await getPage(
		'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/index.html')
	const $ = cheerio.load(level0)
	const list = $('.provincetr td a')
	const provinces = []
	const urls = []
	list.each((index, el) => {
		const url =
			`http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/${$(el).attr('href')}`
		const data = {
			id: $(el).attr('href').split('.')[0] + '0000',
			name: $(el).text()
		}
		rs['86'][data.id] = data.name
		urls.push(url)
	})

	const specialProvinces = {
		"710000": "台湾省",
		"810000": "香港特别行政区",
		"820000": "澳门特别行政区"
	}

	Object.assign(rs['86'], specialProvinces)

	// 市
	for (const url of urls) {
		const level1 = await getPage(url)
		const $ = cheerio.load(level1)
		const list = $('.citytr td a')
		const countyUrls = []
		list.each(async(index, el) => {
			const url =
				`http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/${$(el).attr('href')}`
				// filter number
			const text = $(el).text()
			if (!/\d+/.test(text)) {
				const data = {
					id: $(el).attr('href').split('.')[0].slice(3) + '00',
					name: $(el).text()
				}

				const parentId = data.id.slice(0, 2) + '0000'
				if (!rs[parentId]) {
					rs[parentId] = {}
				}
				cityIds.push(data.id)
				rs[parentId][data.id] = data.name
			}
			countyUrls.push(url)
		})

		for (const url of countyUrls) {
			const level2 = await getPage(url)
			const $ = cheerio.load(level2)
			const list = $('.countytr td, .towntr td')
			list.each(async(index, el) => {
				const link = $(el).find('a')
				let data = {}
				if (link.length) {
					if (!/\d+/.test($(el).text())) {
						data = {
							id: $(link[0]).attr('href').split('.')[0].split('/')[1],
							name: $(el).text()
						}
					}
				} else {
					if (!/\d+/.test($(el).text())) {
						data = {
							id: $(list[index - 1]).text().replace(/0+$/g, ''),
							name: $(el).text()
						}
					}
				}

				if (data.id) {
					const parentId = data.id.slice(0, 4) + '00'
					if (!rs[parentId]) {
						rs[parentId] = {}
					}
					rs[parentId][data.id] = data.name
				}
			})
		}
	}

	setTimeout(() => {
		fs.writeFileSync('../data.json', JSON.stringify(Object.assign({}, rs,
			special), null, 2))
		fs.writeFileSync('./data.json', JSON.stringify(Object.assign({}, rs,
			special), null, 2))
		const _2levelCityIds = cityIds.filter(c => !Object.keys(rs[c] || {}).length)
		fs.writeFileSync('./only_2_level_city_id.json', JSON.stringify(
			_2levelCityIds, null, 2))
		console.log('done')
		process.exit(0)
	}, 6000)
})()
