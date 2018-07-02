const Discord = require("discord.js");
const TOKEN = "NDYyODk2Mjk3MDc1Mjc3ODI0.Dhpxwg.zxx6-eACsKeTnLZzeRhG0lCm3Gk"
const PREFIX = "i!"
const ytdl = require("ytdl-core")

var client = new Discord.Client({disableEveryone: true});

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
client.on("message", message => {
    //Input Validation
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    //Prefix Translation Engine
    var args = message.content.substring(PREFIX.length).split(" ");
    var author_tag = message.author.username

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
                return message.channel.send("Help! I can't speak! It seems I do not have the permission to do so! :'(");
            }

            
             var connection = voiceChannel.join();
            

            const dispatcher = connection.playStream(ytdl(args[1], {filter: "audioonly"}))
                .on("end", () => {
                    console.log('the song ended!');
                    voiceChannel.leave();
            })
                .on("error", error => {
                    console.error(error);
            })
            dispatcher.setVolume(1);
            break;
        //MUSIC STOP
        case "stop":
            if (!msg.member.voiceChannel) return message.channel.send('There is no one here with me, so I left.');
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