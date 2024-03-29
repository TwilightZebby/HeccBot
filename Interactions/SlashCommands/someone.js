const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ThreadChannel, GuildMember, ThreadMember, DMChannel, PartialGroupDMChannel } = require("discord.js");
const { fetchDisplayName } = require("../../constants");
const { localize } = require("../../BotModules/LocalizationModule");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "someone",

    // Command's Description
    Description: `Simulates an @someone mention, just like Discord's old April Fools feature!`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Simulates an @someone mention, just like Discord's old April Fools feature!`,
        'en-US': `Simulates an @someone mention, just like Discord's old April Fools feature!`
    },

    // Command's Category
    Category: "APRIL_FOOLS",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.descriptionLocalizations = this.LocalisedDescriptions;
        Data.type = ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.MentionEveryone;

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Just in case
        if ( slashCommand.channel instanceof DMChannel || slashCommand.channel instanceof PartialGroupDMChannel )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'SLASH_COMMAND_ERROR_DMS_UNSUPPORTED') });
            return;
        }

        /** @type {GuildMember|ThreadMember} */
        let RandomMember;

        // Threads
        if ( slashCommand.channel instanceof ThreadChannel )
        {
            // Fetch and grab a random Member from this Thread
            const ThreadMembers = await slashCommand.channel.members.fetch();
            RandomMember = ThreadMembers.random();
        }
        // Other Channel Types
        else
        {
            // Fetch and grab a random Member from this Channel
            RandomMember = slashCommand.channel.members.random();
        }

        // Send in chat
        await slashCommand.reply({ allowedMentions: { parse: [] }, content: localize(slashCommand.guildLocale, 'SOMEONE_COMMAND_RESPONSE', `${fetchDisplayName(RandomMember.user, true)}`) });
        return;
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        //.
    }
}
