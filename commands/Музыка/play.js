const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "play",
    category: "Музыка",
    aliases: ["p","pl"],
    cooldown: 4,
    usage: "play <URL / Название>",
    description: "Начинает проигрывание музыкальной композиции",
    run: async (client, message, args, user, text, prefix) => {
    try{
      const { channel } = message.member.voice;
      if(!channel)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Пожалуйста, подключись к голосовому каналу`)
        );
      if(client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Пожалуйста, подключись  к каналу где нахожусь я`)
            .setDescription(`Канал: \`${message.guild.me.voice.channel.name}\``)
        );
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Вы не ввели название или URL!`)
            .setDescription(`Использование: \`${prefix}play <URL / Название>\``)
        );
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle("Веду поиск песни...")
        .setDescription(`\`\`\`fix\n${text}\n\`\`\``)
    ).then(msg=>msg.delete({timeout: 3000}).catch(e=> console.log(e.message)))
    client.distube.play(message, text);
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
