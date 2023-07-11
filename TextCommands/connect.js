const { Message, StageChannel, PermissionFlagsBits } = require("discord.js");
const { DiscordClient, Collections } = require("../constants.js");
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");
const { PREFIX, BotDevID } = require("../config.js");

module.exports = {
    // Command's Name
    //     Use camelCase or full lowercase
    Name: "connect",

    // Command's Description
    Description: `Connects the Bot to a Stage Channel; ready for using the Karaoke Feature!`,

    // Command's Category
    Category: "KARAOKE",

    // Alias(es) of Command, if any
    Alias: [ "c" ],

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Scope of Command's usage
    //     One of the following: DM, GUILD
    Scope: "GUILD",

    // Are arguments required?
    ArgumentsRequired: false,

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

        if ( !(message.member.voice?.channel instanceof StageChannel) && message.author.id !== BotDevID )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, you must be connected to a Stage Channel (__NOT__ a Voice Channel) to use this Karaoke Command!` });
            return;
        }

        // Ensure Bot has Perms to unsuppress itself in Stages
        if ( (message.member.voice?.channel instanceof StageChannel) && !message.member.voice?.channel.permissionsFor(DiscordClient.user.id).has(PermissionFlagsBits.MuteMembers) )
        {
            await message.reply({ allowedMentions: {parse: [], repliedUser: false}, content: `Sorry, but I need to have the "Mute Members" Permission in <#${message.member.voice.channelId}> in order to play music! (I need to be able to unsuppress myself in Stages).` });
            return;
        }

        if ( !Collections.KaraokeCache.get(message.guildId) )
        {
            const MusicCache = {};

            MusicCache.connection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            MusicCache.player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });

            MusicCache.connection.subscribe(MusicCache.player);

            Collections.KaraokeCache.set(message.guildId, MusicCache);

            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Successfully connected to <#${message.member.voice.channelId}>!\nUse \`${PREFIX}play\` to play the music for your Karaoke Session.` })
            .then(async sentMessage => {
                if ( message.member.voice.channel instanceof StageChannel ) { await sentMessage.guild.members.me.voice.setSuppressed(false); }
                if ( message.member.voice.channel.permissionsFor(sentMessage.guild.members.me.id).has(PermissionFlagsBits.DeafenMembers) && !sentMessage.guild.members.me.voice.serverDeaf ) { await sentMessage.guild.members.me.voice.setDeaf(true); }
            });
            return;
        }
        else
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `I seem to already be connected to a Stage Channel!\nUse \`${PREFIX}play\` to play music for your Karaoke Session.` });
            return;
        }
    }
}
