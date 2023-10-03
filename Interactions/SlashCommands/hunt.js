const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, ApplicationCommandOptionType } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "hunt",

    // Command's Description
    Description: `Hunt down someone!`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Hunt down someone!`,
        'en-US': `Hunt down someone!`
    },

    // Command's Category
    Category: "HALLOWEEN",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,

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
        Data.options = [
            {
                type: ApplicationCommandOptionType.Mentionable,
                name: "person",
                description: "Person you want to hunt down",
                descriptionLocalizations: {
                    'en-GB': `Person you want to hunt down`,
                    'en-US': `Person you want to hunt down`
                },
                required: true
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Ensure only those with the correct Role can use this Command
        if ( !slashCommand.member.roles.cache.has('496060609771733003') )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'ACTION_ERROR_HALLOWEEN_NOT_IN_CORRECT_HOUSE', `<@&496060609771733003>`) });
            return;
        }

        // Grab Params
        const PersonArgument = slashCommand.options.getMember("person");

        // Prevent use on same house role
        if ( PersonArgument.roles.cache.has('496060609771733003') )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'ACTION_ERROR_HALLOWEEN_CANNOT_USE_ON_OWN_HOUSE', `<@&496060609771733003>`) });
            return;
        }

        // Send Message!
        await slashCommand.reply({ allowedMentions: { parse: [] }, content: localize(slashCommand.guildLocale, 'ACTION_HALLOWEEN_HUNT', `${slashCommand.member.displayName}`, `${PersonArgument.displayName}`) });
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
