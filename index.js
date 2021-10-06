const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = process.env['TOKEN'];
const ytdl = require('ytdl-core');
const god = '524679467915018261' //add the user ID of whoever runs the club (emma rn)
const { MessageEmbed } = require('discord.js');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('!help (ナイスボット)');
});

client.on('message', async msg => {
	if (!msg.author.bot) {
    let guild = msg.guild;
    if (msg.content === '!join'){      //dont know why this works, but it does, so don't touch it
      var voice, player;               // Adds bot to the user's voice channel and plays the music stream
      const connection = await msg.member.voice.channel.join()
      connection.voice.setSelfDeaf(true);
      const disbbatcher = connection.play("https://listen.moe/stream",  { volume: 0.5 },  { bitrate: 'auto' }); //change this to change the music stream (rn plays listen.moe radio)

    } else if (msg.content.includes('!botsend')) {  //sends a message through the bot to a user (only works if the bot is in the recipient's server)
			console.log(msg.content.substring(9, 27));
			client.users.fetch(msg.content.substring(9, 27)).then(user => {
				user.send(msg.content.substring(28) + '\nfrom: ' + msg.author.tag); //sends message + the person who sent it (so no anonymous harassment)
			});
    } else if (msg.content.includes('!help')){ //help embed (gotten with !help)
      if (msg.author != god) {
        const embed = new Discord.MessageEmbed()
          .setTitle(msg.author.username + ' needs help')
          .addField('!help', 'Sends this message.')
          .addField('!join', 'Connects the bot to your current voice channel and plays music.')
          .addField('!leave', 'Disconnects the bot from the voice channel you are connected to')
          .addField('!send (user ID) (message)', 'Sends a message to the provided user ID (enable developer mode and right click a user to copy it).')
          .setThumbnail('https://i.imgur.com/0orqEIP.png')
          msg.channel.send(embed);
      }

		} else if (msg.content.includes('!send') && msg.author == god) { //sends the message anonymously, but only works if sent by god
			console.log(msg.content.substring(6, 24));
			client.users.fetch(msg.content.substring(6, 24)).then(user => {
				user.send(msg.content.substring(25));
			});

		}else if (msg.content === '!leave'){ //tell bot to leave voice channel of the user that sent the command
      console.log('bruh');
      guild.voice.channel.leave()
    } else if (msg.channel.type === 'dm') {
			client.users.fetch('451854618847215637').then(user => {
				user.send(
					msg.author.tag + ' id: ' + msg.author.id + ' -- ' + msg.content
				);
			});
      
		}
    
		console.log(msg.content + ' -- from ' + msg.author.tag); //logs messages in console along with the message type if it can't figure it out
    if(msg.content === ''){
      console.log('^ message type is ' + msg.url)
    }
	}
});

client.login(TOKEN);