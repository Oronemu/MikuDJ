const Distube = require('distube');
const ee = require('../botconfig/embed.json');
const { MessageEmbed } = require('discord.js')
module.exports = (client) => {

client.distube = new Distube(client, {
	searchSongs: false,
    emitNewSongOnly: false,
    highWaterMark: 1024*1024*64,
    leaveOnEmpty: true,
    leaveOnStop: true,
    leaveOnFinish: true,
    //youtubeCookie: 
    youtubeDL: true,
    updateYouTubeDL: true,
    //customFilters: {}
})

const status = queue => `Повтор: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'Очередь' : 'Песня' : 'Выключен'}\``
//const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || 'Off'}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube
	.on('playSong', (message, queue, song) => message.channel.send(new MessageEmbed()
		.setTitle(`\`${song.name}\``)
		.setURL(song.url)
		.setColor(ee.color)
		.setThumbnail(song.thumbnail)
		.addField(`Продолжительность`, `\`${song.formattedDuration}\``)
		.addField("Статус", status(queue))
		.setFooter(ee.footertext, ee.footericon)
		.setFooter(`Запрошено пользователем: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
	))
	.on('addSong', (message, queue, song) => message.channel.send(new MessageEmbed()
		.setTitle(`\`${song.name}\``)
		.setURL(song.url)
		.setColor(ee.color)
		.setThumbnail(song.thumbnail)
		.addField(`Продолжительность`, `\`${song.formattedDuration}\``)
		.addField(`Песен в очереди: ${queue.songs.length}`, `Продолжительность очереди: ${queue.formattedDuration}`)
		.setFooter(ee.footertext, ee.footericon)
		.setFooter(`Добавлено в очередь пользователем: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
	))
	.on('playList', (message, queue, playlist, song) => message.channel.send(new MessageEmbed()
		.setTitle(`Плейлист: \`${playlist.name}\``)
		.setURL(playlist.url)
		.setColor(ee.color)
		.setThumbnail(song.thumbnail)
		.addField(`Кол-во песен`, `\`${playlist.songs.length}\``)
		.addField(`Текущая песня`, `\`${song.name}\``)
		.addField("Статус", status(queue))
		.setFooter(ee.footertext, ee.footericon)
		.setFooter(`Запрошено пользователем: ${song.user.tag}`, song.user.displayAvatarURL({dynamic: true}))
	))
	.on('addList', (message, queue, playlist, song) => message.channel.send(new MessageEmbed()
		.setTitle(`Плейлист \`${playlist.name}\` добавлен в очередь`)
		.setURL(playlist.url)
		.setColor(ee.color)
		.addField(`Кол-во песен`, `\`${playlist.songs.length}\``)
		.addField("Статус", status(queue))
		.setFooter(ee.footertext, ee.footericon)
	))
// DisTubeOptions.searchSongs = true
	.on('searchResult', (message, result) => {
		let i = 0
		message.channel.send(`**Выбери вариант из списка ниже**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join('\n')}\n*Введи что-нибудь еще или подожди 60 секунд для отмены*`)
	})
// DisTubeOptions.searchSongs = true
	.on('searchCancel', message => message.channel.send(`Поиск отменен`))
	.on('error', (message, e) => {
		console.error(e)
		message.channel.send(new MessageEmbed()
		.setTitle(`Произошла ошибка`)
		.setDescription(`\`\`\`${e}\`\`\``)
		.setFooter(ee.footertext, ee.footericon)
		.setColor(ee.wrongcolor)
		)
	})
	.on('initQueue', queue => {
		queue.repeatMode = 0;
		queue.volume = 50;
		queue.autoplay = false;
	})
}