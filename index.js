const Discord = require("discord.js");
const Util = require("discord.js")
const TOKEN = "NDYyODk2Mjk3MDc1Mjc3ODI0.Dhpxwg.zxx6-eACsKeTnLZzeRhG0lCm3Gk"
const PREFIX = "i!"
const ytdl = require("ytdl-core")
const YouTube = require("simple-youtube-api")
const GOOGLE_API_KEY = "AIzaSyByFo4M5ANPPqjjjXjlZVPdcqyrOvDM_9M"
const queue = new Map();

var client = new Discord.Client({disableEveryone: true});

const youtube = new YouTube(GOOGLE_API_KEY);

client.on("ready", function(){
    client.user.setActivity("with candy!", {
        type: "PLAYING"
      });
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
            message.channel.send("PONG!");
            break;
        //INFO
        case "info":
            message.channel.send("This is INORI BOT V0.2 on Node.Js")
            break;
        //NOTICE ME SENPAI
        case "noticeme":
            var r_hibye = Math.floor(Math.random() * 2)

            switch(r_hibye) {
                case 0:
                    const hiembed = new Discord.RichEmbed()
                        .setColor(0xff7ff0)
                        .setTitle("Hi " + author_tag + "! Hehe.")
                        .setImage("https://tenor.com/Mbkm.gif")
                    message.channel.send(hiembed);
                break;
                case 1:
                    const byeembed = new Discord.RichEmbed()
                        .setColor(0x000)
                        .setTitle("Go away!")
                        .setImage("https://media1.tenor.com/images/07496aed1b01a8af6ec13a21dc39648d/tenor.gif?itemid=5288504")
                    message.channel.send(byeembed);
                break;
            }
            break;
        //FLIP TABLE
        case "flip":
        var r_hibye = Math.floor(Math.random() * 9)

        switch(r_hibye) {
            case 0:
                message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://www.memecenter.com/fun/352052/table-flip-9000-acchi-kocchi"]});
            break;
            case 1:
                message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://i.gifer.com/IZ9.gif"]});
            break;
            case 2:
                message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://tenor.com/view/cat-angry-tableflip-gif-3465051"]});
            break;
            case 3:
                message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://tenor.com/view/table-flip-tableflip-flip-table-anime-flip-gif-5738472"]});
            break;
            case 4:
                message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://tenor.com/view/tableflip-anime-gif-3639689"]});
            break;
            case 5:
            message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://imgur.com/r/TablesWillBeFlipped/4lCNxmh"]});
            break;
            case 6:
            message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://gfycat.com/gifs/detail/PracticalCandidDassierat"]});
            break;
            case 7:
            message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://imgur.com/gallery/GsyZydl"]});
            break;
            case 8:
            message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://imgur.com/r/TablesWillBeFlipped/AWLwqZ6"]});
            break;
            case 9:
            message.channel.send("😡 HNNNHHNHNNHNHNHHH!!!" + author_tag + " baka!", {file: ["https://imgur.com/r/TablesWillBeFlipped/HO73rPU"]});
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
				const video2 = await youtube.getVideoByID(video.id); 
				await handleVideo(video2, message, voiceChannel, true); 
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
                    \n
                    From 1 out of 10! Which would you like?! 
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 20000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send("You didn't answer me, cancelling video selection for now.");
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
            if (!message.member.voiceChannel) return message.channel.send("Hey! You're not in a voice channel! >.<");
		    if (!serverQueue) return message.channel.send("Huh? Stop what?");
		    serverQueue.songs = [];
		    serverQueue.connection.dispatcher.end('You shall stop! (ㆁᴗㆁ✿)');
            return undefined;
            break;
        //MUSIC SKIP
        case "skip":
            if (!message.member.voiceChannel) return message.channel.send("Hey! You're not in a voice channel! >.<");
		    if (!serverQueue) return message.channel.send("Huh? Skip what?");
		    serverQueue.connection.dispatcher.end("SKIP!");
            return undefined;
            break;
        //MUSIC NOW PLAYING
        case "np":
            if (!serverQueue) return message.channel.send('There is nothing playing.');
            return message.channel.send(`🎶 I am now singing: **${serverQueue.songs[0].title}**`);
            break;
        //MUSIC QUEUE
        case "queue":
            if (!serverQueue) return message.channel.send('There is nothing playing.');
            return message.channel.send(`
                __**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
            **Now playing:** ${serverQueue.songs[0].title}
            `);
            break;
        //MUSIC PAUSE
        case "pause":
            if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('There you go! Paused! ⏸');       
            break;
            }
        //MUSIC RESUME
        case "resume":
            if (serverQueue && !serverQueue.playing) {
			    serverQueue.playing = true;
			    serverQueue.connection.dispatcher.resume();
			    return message.channel.send("aaaaaaand resumed! ▶");
		    }
		    return message.channel.send("There's nothing playing >.<");
        
            return undefined;
            break;
        //MUSIC VOLUME
        case "volume":
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
return message.channel.send(`I set the volume to: **${args[1]}**`);
        //BOT RESTART
        case "restart":
            restartBot(message.channel)
            
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

    //MUSIC FUNCTIONS
    var inactivetimer


    async function handleVideo(video, message, voiceChannel, playlist = false) {
        const serverQueue = queue.get(message.guild.id);
        console.log(video);
        const song = {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(message.guild.id, queueConstruct);
    
            queueConstruct.songs.push(song);
    
            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                queue.delete(message.guild.id);
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return undefined;
            else return message.channel.send(`I have added the song **${song.title}** to the queue!`);
        }
        return undefined;
    }
    
    function play(guild, song) {
        const serverQueue = queue.get(guild.id);
     
    
        if (!song) {
            console.log("Bot disconecting in 1 minute");

            setTimeout( function() {client.user.voiceChannel.leave()}, 60000);

            queue.delete(guild.id);
         
            return;
        }
        else {
                clearTimeout(inactivetimer);
                console.log("A timeout timer has been reset!")
        }
        console.log(serverQueue.songs);
    
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log(reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`🎶 I'll start singing: **${song.title}**`);
    }
});


function restartBot(channel) {
    channel.send('Bot Restarting')
    .then(msg => client.destroy())
    .then(() => client.login(process.env.TOKEN));
}

client.login(process.env.TOKEN);