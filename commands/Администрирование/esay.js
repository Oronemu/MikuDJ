const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "esay",
    category: "Администрирование",
    aliases: ["embed"],
    cooldown: 2,
    usage: "esay <[ЗАГОЛОВОК] + [ОПИСАНИЕ] + [URL ИЗОБРАЖЕНИЯ]>",
    description: "Пересылает сообщение в виде Discord Embed. Недоступно обычным пользователям",
    run: async (client, message, args, user, text, prefix) => {
    try{
      if(!args[0])
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ОШИБКА | Ты не ввел заголовок или описание!`)
            .setDescription(`Использование: \`${prefix}esay <ЗАГОЛОВОК> + <ОПИСАНИЕ> + <URL Картинки>\``)
        );
      if (user.id != "200871614349312000")
        return undefined
      let userargs = args.join(" ").split("+");
      let title = userargs[0];
      let desc = userargs[1]
      let imageurl = userargs[2]
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(title ? title : "")
        .setDescription(desc ? desc : "")
        .setImage(imageurl ? imageurl : "")
      )
      try{  message.delete();   }catch{}
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
