const Discord = require("discord.js");
const TOKEN = "NDYyODk2Mjk3MDc1Mjc3ODI0.Dhpxwg.zxx6-eACsKeTnLZzeRhG0lCm3Gk"
const PREFIX = "i!"

var client = new Discord.Client();

var servers = {};

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
function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter:"audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    })
}

//COMMANDS
client.on("message", function(message) {
    if (message.author.equals(client.user)) return;

    if (!message.content.startsWith(PREFIX)) return;


    var args = message.content.substring(PREFIX.length).split(" ");
    var author_tag = message.author.username

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
            if (!args[1]) {
                message.channel.send("But there was no link!")
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.send("You must be in a voice channel to call me there!")
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id]

            server.queue.push(args[1]);
            
            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        //MUSIC STOP
        case "stop":
            var server = servers[message.guild.id]

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
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

client.login(TOKEN);