const Discord = require('discord.js'); //sorry for the shitty unreadable code, I don't know how to make it readable. blame this on Mr. Cohen
const client = new Discord.Client();
const TOKEN = process.env['TOKEN'];
const ytdl = require('ytdl-core');
const god = '524679467915018261' //add the user ID of whoever runs the club (emma rn)
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
var tempPrefix = ''

//db.set("PREFIX", ',').then(() => {console.log("Changed prefix")});



client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('!help (ナイスボット)');
});

client.on('message', async msg => {

  db.get("PREFIX").then(value => {tempPrefix = value;}); //reads the database and sets the PREFIX value to tempPrefix to prevent slowdowns of grabbing the value every time

	if (!msg.author.bot) {
    let guild = msg.guild;
    
    if (msg.content === tempPrefix + 'join'){  //dont know why this works, but it does, so don't touch it
      var voice, player;               // Adds bot to the user's voice channel and plays the music stream
      const connection = await msg.member.voice.channel.join()
      connection.voice.setSelfDeaf(true);
      const disbbatcher = connection.play("https://listen.moe/stream",  { volume: 0.5 },  { bitrate: 'auto' }); //change this to change the music stream (rn plays listen.moe radio)

    } else if(msg.content.startsWith(tempPrefix + 'setprefix')) {  //sets the prefix by writing directly to the database, with key "PREFIX"
      db.set("PREFIX", msg.content.substring(11,12)).then(() => {
        console.log("Changed prefix to " + msg.content.substring(11,12));
        tempPrefix = msg.content.substring(11,12);
      });
    } else if (msg.content.includes(tempPrefix + 'botsend')) {  //sends a message through the bot to a user (only works if the bot is in the recipient's server)
			console.log(msg.content.substring(9, 27));
			client.users.fetch(msg.content.substring(9, 27)).then(user => {
				user.send(msg.content.substring(28) + '\nfrom: ' + msg.author.tag); //sends message + the person who sent it (so no anonymous harassment)
			});
    } else if (msg.content.startsWith(tempPrefix + 'help')){ //help embed (gotten with !help)
      if (msg.author != god) {
        const embed = new Discord.MessageEmbed()
          .setTitle(msg.author.username + ' needs help')
          .addField(tempPrefix + 'help', 'Sends this message.')  //tempPrefix is the current prefix, displays it along with the command for accuracy ig
          .addField(tempPrefix + 'setprefix (prefix)', 'Changes the prefix of commands to prevent conflict with other bots.')
          .addField(tempPrefix + 'join', 'Connects the bot to your current voice channel and plays music.')
          .addField(tempPrefix + 'leave', 'Disconnects the bot from the voice channel you are connected to')
          .addField(tempPrefix + 'send (user ID) (message)', 'Sends a message to the provided user ID (enable developer mode and right click a user to copy it).')
          .setThumbnail('https://i.imgur.com/0orqEIP.png')
          msg.channel.send(embed);
      } else {
				const embed = new Discord.MessageEmbed()   //special help menu for whoever owns bot (god)
          .setTitle(msg.author.username + ' needs help')
          .addField(tempPrefix + 'help', 'Sends this message.')  //tempPrefix is the current prefix, displays it along with the command for accuracy ig
          .addField(tempPrefix + 'setprefix (prefix)', 'Changes the prefix of commands to prevent conflict with other bots.')
          .addField(tempPrefix + 'join', 'Connects the bot to your current voice channel and plays music.')
          .addField(tempPrefix + 'leave', 'Disconnects the bot from the voice channel you are connected to')
          .addField(tempPrefix + 'botsend (user ID) (message)', 'Sends a message to the provided user ID (enable developer mode and right click a user to copy it).')
					.addField(tempPrefix + 'eval', 'Does whatever you type, in javascript, on the server side (very dangerous lol, but use if you want ig)')
          .setThumbnail('https://i.imgur.com/0orqEIP.png')
          msg.channel.send(embed);
			}

		} else if (msg.author == god && msg.content.startsWith(tempPrefix + 'eval')){ //eval (only for god)
			eval(msg.content.substring(5))
			
		} else if (msg.content.includes(tempPrefix + 'send') && msg.author == god) { //sends the message anonymously, but only works if sent by god
			console.log(msg.content.substring(6, 24));
			client.users.fetch(msg.content.substring(6, 24)).then(user => {
				user.send(msg.content.substring(25));
			});

		}else if (msg.content === tempPrefix + 'leave'){ //tell bot to leave voice channel of the user that sent the command
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