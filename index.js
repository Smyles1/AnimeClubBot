const Discord = require('discord.js'); //sorry for the shitty unreadable code, I don't know how to make it readable :)
const client = new Discord.Client();
const TOKEN = process.env['TOKEN'];
const ytdl = require('ytdl-core');
const god = '451854618847215637' //add the user ID of whoever runs the club (emma rn)
const { MessageEmbed } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
var videoTitle;
var songQueue = []
songPlaying = false;
var gmsg;
var smsg;
var os = require('os-utils');



var tempPrefix = ''
var status = ''

/*	const songInfo = await ytdl.getInfo(args[1]);
const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
};*/

client.on('ready', () => {
	songQueue = []
	console.log(`Logged in as ${client.user.tag}!`);
	db.get("STATMESS").then(value => {status = value; console.log("Current status is: " + value)});
	db.get("PREFIX").then(value => {client.user.setActivity(value + 'help (' + status + ')');});
	os.cpuUsage(function(v){
    console.log( 'CPU Usage (%): ' + v*100 );
	});
});



client.on('message', async msg => {
	gmsg = msg
  db.get("PREFIX").then(value => {tempPrefix = value;}); //reads the database and sets the PREFIX value to tempPrefix to prevent slowdowns of grabbing the value every time

	if (!msg.author.bot) {
    let guild = msg.guild;
		function sendmsg(message){
			msg.channel.send(message);
		}
		db.get("STATMESS").then(value => {status = value});
		var url = ''

    if (msg.content.startsWith(tempPrefix + 'join')){  //dont know why this works, ut it does, so don't touch it
		smsg = msg
    var voice, player;               // Adds bot to the user's voice channel and plays the music queue
			songPlaying = true;
			songQueue.push(String(msg.content.substring(6))) //adds first song
			console.log(songQueue.length)
			
			playSong(msg).then(value => {
				if(value != undefined){
					msg.channel.send("There was an error in playing the song");
					console.log(value);
				} else {
					sendmsg("Playing song...");
				}
			})
      
			


    } else if(msg.content.startsWith(tempPrefix + 'addsong')) {
			if (songPlaying==false){
				msg.channel.send("No songs are currently playing. Use " + tempPrefix + "join (song) to start the music!")
			} else {
				msg.channel.send("added song");
				songQueue.push(String(msg.content.substring(9)));
			}


		} else if(msg.content.startsWith(tempPrefix + 'cpu')){
			os.cpuUsage(function(v){
   	 	 msg.channel.send( 'CPU Usage (%): ' + v*100 );
			});
		
		} else if(msg.content.startsWith(tempPrefix + 'setprefix')) {  //sets the prefix by writing directly to the database, with key "PREFIX"
      db.set("PREFIX", msg.content.substring(11,12)).then(() => {
        console.log("Changed prefix to " + msg.content.substring(11,12));
        tempPrefix = msg.content.substring(11,12);
				msg.channel.send("Prefix set to: ``" + tempPrefix + "``")
      });

			//setstatus
    } else if (msg.content.startsWith(tempPrefix + 'setstatus')) {  //sets the status by writing directly to the database, with key "STATMESS"
      db.set("STATMESS", msg.content.substring(11)).then(() => {
        console.log("Changed status to " + msg.content.substring(11));
				status = msg.content.substring(11)
				msg.channel.send("Status set to: ``" + status + "``")
				db.get("PREFIX").then(value => {client.user.setActivity(value + 'help (' + status + ')');});
      });

			//botsend
    } else if (msg.content.includes(tempPrefix + 'botsend')) {  //sends a message through the bot to a user (only works if the bot is in the recipient's server)
			console.log(msg.content.substring(9, 27));
			client.users.fetch(msg.content.substring(9, 27)).then(user => {
				user.send(msg.content.substring(28) + '\nfrom: ' + msg.author.tag); //sends message + the person who sent it (so no anonymous harassment)
			msg.channel.send("Message sent")
			});

				//help
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

			//info
		} else if (msg.content.startsWith(tempPrefix + 'info')) {
			//TODO add things to read off of and print as embed
			
			//setinfo
		} else if (msg.author == god && msg.content.startsWith(tempPrefix + 'setinfo')) {
			var infoArgs = msg.content.substring(8).split(' ');
			var clubRoom;
			var clubTime;
			var clubDay;
			db.set("ROOM", infoArgs[0]).then(() => {clubRoom = infoArgs[0]});
			db.set("TIME", infoArgs[1]).then(() => {clubTime = infoArgs[1]});
			db.set("DAY", infoArgs[2]).then(() => {clubThayer = infoArgs[2]});

			//eval
		} else if (msg.author == god && msg.content.startsWith(tempPrefix + 'eval')){ //eval (only for god)
			msg.channel.send(eval(msg.content.substring(5)));

			//send
		} else if (msg.content.includes(tempPrefix + 'send') && msg.author == god) { //sends the message anonymously, but only works if sent by god
			console.log(msg.content.substring(6, 24));
			client.users.fetch(msg.content.substring(6, 24)).then(user => {
				user.send(msg.content.substring(25));
			});
			msg.channel.send("Message sent :D")

			//leave
		} else if (msg.content === tempPrefix + 'leave'){ //tell bot to leave voice channel of the user that sent the command
      msg.channel.send("Left channel")
      guild.voice.channel.leave()
    } else if (msg.channel.type === 'dm') {
			client.users.fetch(god).then(user => {
				user.send(
					msg.author.tag + ' id: ' + msg.author.id + ' -- ' + msg.content
				);
			});
      
		}
    





		console.log(msg.content + ' -- from ' + msg.author.tag); //logs messages in console along with the message type if it can't figure it out
    if(msg.content === ''){
      console.log('^ message type is ' + msg.type)
    }
	}
});


function getTitleVideo (videoUrl){
 		  return new Promise ((resolve, reject) => {
  		    ytdl.getBasicInfo (videoUrl, (err, info) => {
            resolve (info.title)
    		  })
		   })
} 

async function playSong(msg){
try{
	if(songQueue.length < 1){
		return;
	}
	const connection = await msg.member.voice.channel.join()
  connection.voice.setSelfDeaf(true);
  var stream = ytdl(String(songQueue[0]))
	const disbbatcher = connection.play(stream,  { volume: 0.5 },  { bitrate: 'auto' });
	songQueue = songQueue.shift();
	
	stream.on("finish", async value =>{
		smsg.channel.send("test");
		setTimeout(function(){
    smsg.channel.send("Finished song.")
				playSong().then(value => {
					
				})
		}, 10000);
	});
	
} catch(err){
	return err;
}}


client.login(TOKEN);