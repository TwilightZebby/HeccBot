const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, AutocompleteInteraction } = require("discord.js");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "temperature",

    // Command's Description
    Description: `Convert a given temperature between degrees C, F, and K`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Convert a given temperature between degrees C, F, and K`,
        'en-US': `Convert a given temperature between degrees F, C, and K`
    },

    // Command's Category
    Category: "INFORMATIONAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "ALL",

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
        Data.dmPermission = true;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "value",
                description: "The temperature value you want to convert",
                descriptionLocalizations: {
                    'en-GB': `The temperature value you want to convert`,
                    'en-US': `The temperature value you want to convert`
                },
                min_value: -460,
                max_value: 1000,
                required: true
            },
            {
                type: ApplicationCommandOptionType.String,
                name: "scale",
                description: "The temperature scale of the original value",
                descriptionLocalizations: {
                    'en-GB': `The temperature scale of the original value`,
                    'en-US': `The temperature scale of the original value`
                },
                required: true,
                choices: [
                    { 
                        name: "Celsius",
                        nameLocalizations: {
                            'en-GB': `Celsius`,
                            'en-US': `Celsius`
                        },
                        value: "c"
                    },
                    { 
                        name: "Fahernheit",
                        nameLocalizations: {
                            'en-GB': `Fahernheit`,
                            'en-US': `Fahernheit`
                        },
                        value: "f"
                    },
                    { 
                        name: "Kelvin",
                        nameLocalizations: {
                            'en-GB': `Kelvin`,
                            'en-US': `Kelvin`
                        },
                        value: "k"
                    }
                ]
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
        // Grab values
        const ValueOption = slashCommand.options.getInteger("value", true);
        const ScaleOption = slashCommand.options.getString("scale", true);


        // Convert
        switch (ScaleOption)
        {
            // C TO F/K
            case "c":
                const CToF = (ValueOption * 9/5) + 32;
                const CToK = ValueOption + 273.15;
                if ( CToK < 0 ) { return await slashCommand.reply({ ephemeral: true, content: `:warning: ${ValueOption}C is a temperature that cannot exist! (It is below Absolute Zero!)` }); }
                await slashCommand.reply({ ephemeral: true, content: `${ValueOption}C is about ${CToF.toFixed(0)}F or ${CToK.toFixed(0)}K` });
                break;

            // F TO C/K
            case "f":
                const FToC = (ValueOption - 32) * 5/9;
                const FToK = (ValueOption - 32) * 5/9 + 273.15;
                if ( FToK < 0 ) { return await slashCommand.reply({ ephemeral: true, content: `:warning: ${ValueOption}F is a temperature that cannot exist! (It is below Absolute Zero!)` }); }
                await slashCommand.reply({ ephemeral: true, content: `${ValueOption}F is about ${FToC.toFixed(0)}C or ${FToK.toFixed(0)}K` });
                break;

            // K TO C/F
            case "k":
                const KToC = ValueOption - 273.15;
                const KToF = (ValueOption - 273.15) * 9/5 + 32;
                if ( ValueOption < 0 ) { return await slashCommand.reply({ ephemeral: true, content: `:warning: ${ValueOption}K is a temperature that cannot exist! (It is below Absolute Zero!)` }); }
                await slashCommand.reply({ ephemeral: true, content: `${ValueOption}K is about ${KToC.toFixed(0)}C or ${KToF.toFixed(0)}F` });
                break;

            default:
                return await slashCommand.reply({ ephemeral: true, content: "Sorry, but there was a problem trying to run this Slash Command." });
        }

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
