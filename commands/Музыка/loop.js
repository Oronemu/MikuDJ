const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "loop",
    category: "Музыка",
    aliases: ["l", "lp", "repeat", "r", "rp"],
    cooldown: 4,
    usage: "loop <0/1/2>",
    description: "Включает/выключает повтор текущего трека или очереди",
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
            .setTitle(`❌ ОШИБКА | Сейчас я ничего не проигрываю`)
        );
      if(client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Пожалуйста, подкоючись  к каналу где нахожусь я`)
            .setDescription(`Канал: \`${message.guild.me.voice.channel.name}\``)
        );
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Вы не ввели режим повтора!`)
            .setDescription(`Использование: \`${prefix}loop <0 / 1 / 2>\``)
        );
      let loopState = args[0];
      if(loopState.toLowerCase() === "Песня") loopState = "1";
      if(loopState.toLowerCase() === "Очередь") loopState = "2";
      if(loopState.toLowerCase() === "Выключен") loopState = "0";
      loopState = Number(loopState);
      loopStates = {
        "1" : "Песня",
        "2" : "Очередь",
        "0" : "Выключен" 
      }
      if(0 <= loopState && loopState <= 2){
        client.distube.setRepeatMode(message, parseInt(loopState))
        message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`🔁 Режим повтора изменен на \`${loopStates[loopState]}\``)
        )
      } else {
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Вы не ввели режим повтора!`)
            .setDescription(`Использование: \`${prefix}loop <0/1/2>\``)
        );
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
