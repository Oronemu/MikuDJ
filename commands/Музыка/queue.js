const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "queue",
    category: "Музыка",
    aliases: ["q", "qu"],
    cooldown: 4,
    usage: "queue",
    description: "Возвращает список песен, находящихся в очереди",
    run: async (client, message, args, user, text, prefix) => {
    try{
      const { channel } = message.member.voice;
      if(!channel)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Пожалуйста, подключись к голосовому каналу`)
        );
    if(!client.distube.getQueue(message)) 
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Сейчас ничего не проигрывается!`)
            .setDescription(`Очередь пуста`)
        );
    if(client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Пожалуйста, подкоючись  к каналу где нахожусь я`)
            .setDescription(`Канал: \`${message.guild.me.voice.channel.name}\``)
        );
    let queue = client.distube.getQueue(message);
    if(!queue) return message.channel.send(new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`❌ ОШИБКА | Сейчас ничего не проигрывается!`)
        .setDescription(`Очередь пуста`)
    );
    let embed = new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`Очередь для: ${message.guild.name}`)
        let counter = 0;
        for (let i = 0; i < queue.songs.length; i+=30) {
            let k = queue.songs;
            let songs = k.slice(i, i + 30);
            message.channel.send(embed.setDescription(songs.map((song,index) => `**${index + 1 + counter*30}** [${song.name}](${song.url}) - ${song.formattedDuration}`)))
            counter++
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Возникла непредвиденная ошибка!`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
  }
}
