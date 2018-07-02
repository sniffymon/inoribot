const Discord = require("discord.js");
const TOKEN = "NDYyODk2Mjk3MDc1Mjc3ODI0.Dhpxwg.zxx6-eACsKeTnLZzeRhG0lCm3Gk"
const PREFIX = "i!"
const ytdl = require("ytdl-core")
const YouTube = require("simple-youtube-api")
const GOOGLE_API_KEY = "AIzaSyByFo4M5ANPPqjjjXjlZVPdcqyrOvDM_9M"

var client = new Discord.Client({disableEveryone: true});

const youtube = new YouTube(GOOGLE_API_KEY);

client.on("ready", function(){
    client.user.setActivity({game: {name: "with candy!", type: 0}});
    console.log("Inori is now Ready!");
})

//WELCOME MESSAGE
client.on("guildMemberAdd", (member) => {
    const guild = member.guild; 
    let memberTag = member.user.tag; 
    if(guild.systemChannel){
        guild.systemChannel.send(new Discord.RichEmbed()
        .setTitle("A new user has joined the server!")
        .setDescription(memberTag + " has joined the guild") // Setting embed description
        .setColor(0xff5219)
        .setThumbnail(member.user.displayAvatarURL) // The image on the top right; method requires an url, not a path to file!
        .addField("Members on the server now", member.guild.memberCount) // Adds a field; First parameter is the title and the second is the value.
        .setTimestamp() // Sets a timestamp at the end of the embed
        );

    }
    });
    
//MUSIC FUNCTION


//COMMANDS
client.on("message", async message => {
    //Input Validation
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;


  

    //Prefix Translation Engine
    var args = message.content.substring(PREFIX.length).split(" ");
    var author_tag = message.author.username
    //Music Search Engine
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    switch (args[0]) {
        //PING TEST
        case "ping":
            message.channel.send("PONG!" + new Date().getTime() - message.createdTimestamp + " ms");
            break;
        //INFO
        case "info":
            message.channel.send("This is INORI BOT V0.2 on Node.Js")
            break;
        //NOTICE ME SENPAI
        case "nm":
            var r_hibye = Math.floor(Math.random() * 2)

            switch(r_hibye) {
                case 0:
                    const hiembed = new Discord.RichEmbed()
                        .setColor(0xff7ff0)
                        .setTitle("Hi " + author_tag)
                    message.channel.send(hiembed);
                break;
                case 1:
                    const byeembed = new Discord.RichEmbed()
                        .setColor(0x000)
                        .setTitle("Go away!")
                    message.channel.send(byeembed);
                break;
            }
            break;
        //MUSIC PLAY
        case "play":

        const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send("Hey! You're not in a voice channel! >.<");
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send("I can't seem to connect! Do I have the permissions? :(");
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send("Help! I can't sing! It seems I do not have the permission to do so! :'(");
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`🎵 Playlist: **${playlist.title}** has been added to the current queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
From 1 out of 10! Which would you like?! 
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send("😭 I couldn't find anything..");
				}
			}
			return handleVideo(video, message, voiceChannel);
}
            break;
        //MUSIC STOP
        case "stop":
            if (!message.member.voiceChannel) return message.channel.send('There is no one here with me, so I left.');
            message.member.voiceChannel.leave();
            return undefined;
            break;
        //MULTI COMM TEST
        case "mult":
            switch (args[1]) {
                case "one":
                var embed = new Discord.RichEmbed()
                    .setColor(0xfc3a43)
                    .setTitle("Welcome!")
                    .setDescription("welcome to duh server");
                    
                message.channel.send(embed)
                break;
                case "2":
                message.channel.send("test line two")
                break;
            }
        break;
        //NULL COMMAND
        default:
            message.channel.send("No such command exists.");

    }
});

client.login(process.env.TOKEN);