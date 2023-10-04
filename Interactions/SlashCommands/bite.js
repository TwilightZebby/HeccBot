const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, ApplicationCommandOptionType } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "bite",

    // Command's Description
    Description: `Unleash your inner Vampire and take a sip of someone's blood!`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Unleash your inner Vampire and take a sip of someone's blood!`,
        'en-US': `Unleash your inner Vampire and take a sip of someone's blood!`
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
                description: "Person you want to suck the blood of",
                descriptionLocalizations: {
                    'en-GB': `Person you want to suck the blood of`,
                    'en-US': `Person you want to suck the blood of`
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
        if ( !slashCommand.member.roles.cache.has('496038245629427752') )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'ACTION_ERROR_HALLOWEEN_NOT_IN_CORRECT_HOUSE', `<@&496038245629427752>`) });
            return;
        }

        // Grab Params
        const PersonArgument = slashCommand.options.getMember("person");

        // Prevent use on same house role
        if ( PersonArgument.roles.cache.has('496038245629427752') )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'ACTION_ERROR_HALLOWEEN_CANNOT_USE_ON_OWN_HOUSE', `<@&496038245629427752>`) });
            return;
        }

        // Send Message!
        await slashCommand.reply({ allowedMentions: { parse: [] }, content: localize(slashCommand.guildLocale, 'ACTION_HALLOWEEN_SUCK', `${slashCommand.member.displayName}`, `${PersonArgument.displayName}`) });
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
