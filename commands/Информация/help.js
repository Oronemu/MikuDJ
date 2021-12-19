const { MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "help",
    category: "Информация",
    aliases: ["h", "commandinfo", "cmds", "cmd"],
    cooldown: 4,
    usage: "help [команда]",
    description: "Возвращает список команд или описание одной команды",
    run: async (client, message, args, user, text, prefix) => {
      try{
        if (args[0]) {
          const embed = new MessageEmbed();
          const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
          if (!cmd) {
              return message.channel.send(embed.setColor(ee.wrongcolor).setDescription(`Нет информации о команде **${args[0].toLowerCase()}**`));
          }
          if (cmd.name) embed.addField("**Имя команды**", `\`${cmd.name}\``);
          if (cmd.name) embed.setTitle(`Информация о команде:\`${cmd.name}\``);
          if (cmd.description) embed.addField("**Описание**", `\`${cmd.description}\``);
          if (cmd.aliases) embed.addField("**Псевдонимы**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
          if (cmd.cooldown) embed.addField("**Кулдаун**", `\`${cmd.cooldown} сек.\``);
          else embed.addField("**Кулдаун**", `\`1 секунда\``);
          if (cmd.usage) {
              embed.addField("**Использование**", `\`${process.env.PREFIX}${cmd.usage}\``);
              embed.setFooter("Синтаксис: <> = обязательный параметр, [] = опциональный параметр");
          }
          if (cmd.useage) {
            embed.addField("**Использование**", `\`${process.env.PREFIX}${cmd.usage}\``);
            embed.setFooter("Синтаксис: <> = обязательный параметр, [] = опциональный параметр");
          }
          return message.channel.send(embed.setColor(ee.color));
        } else {
          const embed = new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(client.user.displayAvatarURL())
              .setTitle("МЕНЮ ПОМОЩИ")
              .setFooter(`Чтобы увидеть описание и информацию по команде, введите: ${process.env.PREFIX}help [ИМЯ КОМАНДЫ] \n Для заказа музыки введите ${process.env.PREFIX}play <URL / Название>`, client.user.displayAvatarURL());
          const commands = (category) => {
              return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          };
          try {
            for (let i = 0; i < client.categories.length; i += 1) {
              const current = client.categories[i];
              const items = commands(current);
              const n = 3;
              const result = [[], [], []];
              const wordsPerLine = Math.ceil(items.length / 3);
              for (let line = 0; line < n; line++) {
                  for (let i = 0; i < wordsPerLine; i++) {
                      const value = items[i + line * wordsPerLine];
                      if (!value) continue;
                      result[line].push(value);
                  }
              }
              embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${result[0].join("\n> ")}`, true);
              embed.addField(`\u200b`, `${result[1].join("\n") ? result[1].join("\n") : "\u200b"}`, true);
              embed.addField(`\u200b`, `${result[2].join("\n") ? result[2].join("\n") : "\u200b"}`, true);
            }
          } catch (e) {
              console.log(String(e.stack).red);
          }
          message.channel.send(embed);
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