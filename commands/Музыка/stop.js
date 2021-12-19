const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "stop",
    category: "Музыка",
    aliases: ["st"],
    cooldown: 4,
    usage: "stop",
    description: "Останавливает воспроизведение музыки",
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
            .setTitle(`❌ ОШИБКА | Пожалуйста, подключись к каналу где нахожусь я`)
            .setDescription(`Канал: \`${message.guild.me.voice.channel.name}\``)
        );
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`⏹️ Воспроивзедение музыки остановлено!`)
    )
    client.distube.stop(message);
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
