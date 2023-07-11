const { Message, StageChannel } = require("discord.js");
const { Collections } = require("../constants.js");
const { BotDevID } = require("../config.js");

module.exports = {
    // Command's Name
    //     Use camelCase or full lowercase
    Name: "leave",

    // Command's Description
    Description: `Forces the Bot to disconnect from the Stage Channel`,

    // Command's Category
    Category: "KARAOKE",

    // Alias(es) of Command, if any
    Alias: [ "l" ],

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
        if ( !message.member.voice?.channel && message.author.id !== BotDevID )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, you must be connected to a Stage Channel to use this Karaoke Command!` });
            return;
        }

        if ( !(message.member.voice?.channel instanceof StageChannel) && message.author.id !== BotDevID )
        {
            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Sorry, you must be connected to a Stage Channel (__NOT__ a Voice Channel) to use this Karaoke Command!` });
            return;
        }

        if ( !Collections.KaraokeCache.get(message.guildId) )
        {
            //await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Test` });
            return;
        }
        else
        {
            await message.guild.members.me.voice.disconnect();
            let musicCache = Collections.KaraokeCache.get(message.guildId);
            musicCache.player.stop();
            musicCache.connection.destroy();
            Collections.KaraokeCache.delete(message.guildId);
            delete musicCache;

            await message.reply({ allowedMentions: { parse: [], repliedUser: false }, content: `Successfully left the Stage Channel!` });
            return;
        }
    }
}
