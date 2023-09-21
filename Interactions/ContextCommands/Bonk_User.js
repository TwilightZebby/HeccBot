const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction } = require("discord.js");
const { DiscordClient } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");


module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Bonk User",

    // Command's Description
    Description: `Bonk a naughty User`,

    // Command's Category
    Category: "ACTION",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.User,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",



    /**
     * Returns data needed for registering Context Command onto Discord's API
     * @returns {ApplicationCommandData}
     */
    registerData()
    {
        /** @type {ApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = "";
        Data.type = this.CommandType;
        Data.dmPermission = false;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        // Grab Data
        const PersonOption = contextCommand.options.getMember("user");
        let displayMessage = "";

        // Assemble message
        // @user (self)
        if ( PersonOption.id === contextCommand.user.id )
        {
            displayMessage = localize(contextCommand.guildLocale, `ACTION_COMMAND_SELF_USER_BONK`, contextCommand.member.displayName);
        }
        // @user (this bot)
        else if ( PersonOption.id === DiscordClient.user.id )
        {
            displayMessage = localize(contextCommand.guildLocale, `ACTION_COMMAND_HECCBOT_BONK`, contextCommand.member.displayName);
        }
        // @user (MeeYuck)
        else if ( PersonOption.id === '159985870458322944' )
        {
            displayMessage = localize(contextCommand.guildLocale, `ACTION_COMMAND_MEE6_BONK`, contextCommand.member.displayName, `<@159985870458322944>`);
        }
        // @user (literally any bot that isn't this one)
        else if ( PersonOption.user.bot )
        {
            displayMessage = localize(contextCommand.guildLocale, `ACTION_COMMAND_OTHER_BOTS_BONK`, contextCommand.member.displayName, `${PersonOption.displayName}`);
        }
        // @user (literally any other User that doesn't meet the above)
        else
        {
            displayMessage = localize(contextCommand.guildLocale, `ACTION_COMMAND_OTHER_USER_BONK`, contextCommand.member.displayName, `${PersonOption.displayName}`);
        }


        // Send Message
        await contextCommand.reply({ allowedMentions: { parse: [] }, content: displayMessage });
        return;
    }
}
