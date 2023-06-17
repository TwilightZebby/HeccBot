const { Message, StageChannel, PermissionFlagsBits } = require("discord.js");
const { DiscordClient, Collections } = require("../constants.js");
const { createAudioResource } = require("@discordjs/voice");
const play = require('play-dl');
const { PREFIX } = require("../config.js");

module.exports = {
    // Command's Name
    //     Use camelCase or full lowercase
    Name: "play",

    // Command's Description
    Description: `Load music into a queue, ready to be played in Stage Channels for Karaoke Nights!`,

    // Command's Category
    Category: "KARAOKE",

    // Alias(es) of Command, if any
    Alias: [ "p" ],

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,

    // Scope of Command's usage
    //     One of the following: DM, GUILD
    Scope: "GUILD",

    // Are arguments required?
    ArgumentsRequired: true,

    // Minimum amount of Arguments required
    //     REQUIRES "ArgumentsRequired" TO BE TRUE IF TO BE SET AS AN INTEGER
    MinimumArguments: null,

    // Maximum amount of Arguments allowed
    //     Does NOT require "ArgumentsRequired" to be true, but should be more than Minimum if set
    MaximumArguments: null,

    // Command Permission Level
    //     One of the following: DEVELOPER, SERVER_OWNER, ADMIN, MODERATOR, EVERYONE
    PermissionLevel: "MODERATOR",



    /**
     * Executes the Text Command
     * @param {Message} message Origin Message that triggered this Command
     * @param {?Array<String>} arguments Given arguments, can be empty!
     */
    async execute(message, arguments)
    {
        // Ensure Member is in a Stage Channel
        if ( !message.member.voice?.channel )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, you must be connected to a Stage Channel to use this Karaoke Command!` });
            return;
        }

        if ( !(message.member.voice?.channel instanceof StageChannel) )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, you must be connected to a Stage Channel (__NOT__ a Voice Channel) to use this Karaoke Command!` });
            return;
        }

        // Ensure the BOT ITSELF is connected to Stage in order to use this
        if ( !message.guild.members.me.voice?.channel )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, you must make me join a Stage Channel (Using \`${PREFIX}connect\` ) in order to make me play music!` });
            return;
        }

        // Ensure Bot has Perms to unsuppress itself in Stages
        if ( !message.member.voice?.channel.permissionsFor(DiscordClient.user.id).has(PermissionFlagsBits.MuteMembers) )
        {
            await message.reply({ allowedMentions: {parse: [], repliedUser: false}, content: `Sorry, but I need to have the "Mute Members" Permission in <#${message.member.voice.channelId}> in order to play music! (I need to be able to unsuppress myself in Stages).` });
            return;
        }

        let musicCache = Collections.KaraokeCache.get(message.guildId);

        if ( !(message.guild.members.me.voice?.channel instanceof StageChannel) )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, but you cannot use my Karaoke Feature in Voice Channels, only in Stage Channels.` });

            // Stop everything
            await message.guild.members.me.voice.disconnect();
            musicCache.player.stop();
            musicCache.connection.destroy();
            Collections.KaraokeCache.delete(message.guildId);
            delete musicCache;
            return;
        }



        // Check URI
        let audioUri = arguments.shift();

        if ( !audioUri.startsWith("https://www.youtube.com/watch?") && !audioUri.startsWith("https://youtu.be/") )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, but I can only play YouTube links for Karaokes at this time!` });
            return;
        }

        // PLAY THE THING
        let streamAudio = await play.stream(audioUri);
        let resource = createAudioResource(streamAudio.stream, {
            inputType: streamAudio.type
        });

        musicCache.player.play(resource);

        await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Playing that for you now!` });

        return;
    }
}
