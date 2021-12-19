const ee = require("../../botconfig/embed.json"); 
const Discord = require("discord.js");
const { escapeRegex} = require("../../handlers/functions");

module.exports = async (client, message) => {
  try {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    let prefix = process.env.PREFIX
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return message.channel.send(new Discord.MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(`❌ Неизвестная команда, попробуй: **\`${prefix}help\`**`)
      .setDescription(`Для проигрывания музыки просто введи \`${prefix}play <Название / URL>\``)
    )
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command){
        if (!client.cooldowns.has(command.name)) { 
            client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now(); 
        const timestamps = client.cooldowns.get(command.name); 
        const cooldownAmount = (command.cooldown || 1.5) * 1000; 
        if (timestamps.has(message.author.id)) { 
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount; 
          if (now < expirationTime) { 
            const timeLeft = (expirationTime - now) / 1000; 
            return message.channel.send(new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext,ee.footericon)
              .setTitle(`❌ Пожалуйста, подожди ${timeLeft.toFixed(1)} сек. прежде чем снова использовать команду \`${command.name}\``)
            ); 
          }
        }
        timestamps.set(message.author.id, now); 
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 
      try{
        if(command.memberpermissions && !message.member.hasPermission(command.memberpermissions)) {
          return message.channel.send(new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle("❌ ОШИБКА | У тебя недостаточно прав использовать эту команду!")
            .setDescription(`Тебе нужны следующие права: \`${command.memberpermissions.join("`, ``")}\``)
          )
        }
        if(!message.guild.me.hasPermission("ADMINISTRATOR")){
          return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("❌ ОШИБКА | Кажется у меня недостаточно прав, чтобы сделать такое :C")
          .setDescription("Пожалуйста, дай мне роль АДМИНИСТРАТОРА, чтобы я могла удалять сообщения, создавать каналы и использовать все админ. команды! "))
        }
        command.run(client, message, args, message.member, args.join(" "), prefix);
      }catch (e) {
        console.log(String(e.stack).red)
        return message.channel.send(new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle("❌ Что-то пошло не так во время исполнения команды: `" + command.name)
          .setDescription(`\`\`\`${e.message}\`\`\``)
        )
      }
    }
    else 
    return message.channel.send(new Discord.MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(`❌ Неизвестная команда, попробуй: **\`${prefix}help\`**`)
      .setDescription(`Для проигрывания музыки просто введи \`${prefix}play <Название / URL>\``)
    )
  }catch (e){
    return message.channel.send(
    new MessageEmbed()
    .setColor("RED")
    .setTitle(`❌ ОШИБКА | Возникла непредвиденная ошибка!`)
    .setFooter(ee.footertext, ee.footericon)
    .setDescription(`\`\`\`${e.stack}\`\`\``)
    );
  }
}
