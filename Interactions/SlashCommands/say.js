const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { BotDevID } = require("../../config.js");

/**
 * Modal for Plain-text /say Subcommand
 */
const PlainTextModal = new ModalBuilder().setCustomId("say-plain").setTitle("Say Plain Text").addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("reference").setLabel("Message ID to reply to").setMaxLength(24).setRequired(false).setStyle(TextInputStyle.Short) ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("content").setLabel("Message Content").setMaxLength(2000).setRequired(true).setStyle(TextInputStyle.Paragraph) ])
]);

/**
 * Modal for Embed /say Subcommand
 */
const EmbedModal = new ModalBuilder().setCustomId("say-embed").setTitle("Say Embed").addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("reference").setLabel("Message ID to reply to").setMaxLength(24).setRequired(false).setStyle(TextInputStyle.Short) ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("title").setLabel("Embed Title").setMaxLength(100).setRequired(false).setStyle(TextInputStyle.Short) ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("description").setLabel("Embed Description").setMaxLength(4000).setRequired(false).setStyle(TextInputStyle.Paragraph) ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("attachment").setLabel("Embed Attachment Link").setMaxLength(1000).setRequired(false).setStyle(TextInputStyle.Short) ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("color").setLabel("Embed Colour").setMaxLength(7).setMinLength(7).setRequired(false).setStyle(TextInputStyle.Short).setPlaceholder("#ab44ff") ])
]);

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "say",

    // Command's Description
    Description: `[BOT DEV ONLY] Used to make the Bot say stuff.`,

    // Command's Category
    Category: "SNEAKY",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,

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
        Data.type = ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageChannels;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "text",
                description: "[BOT DEV ONLY] Make Bot say plain-text messages"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "embed",
                description: "[BOT DEV ONLY] Make Bot say embed messages"
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
        // Ensure only Bot Dev can use these commands!
        if ( slashCommand.user.id !== BotDevID )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but only my Developer can use this Command!` });
            return;
        }

        // Ensure Send Messages Permission
        if ( !slashCommand.appPermissions.has(PermissionFlagsBits.ViewChannel) || !slashCommand.appPermissions.has(PermissionFlagsBits.SendMessages) )
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but I don't seem to have Permissions to View this Channel, or Send Messages here!` });
            return;
        }


        const SayType = slashCommand.options.getSubcommand(true);

        // Plain text messages
        if ( SayType === "text" )
        {
            await slashCommand.showModal(PlainTextModal);
            return;
        }
        else if ( SayType === "embed" )
        {
            await slashCommand.showModal(EmbedModal);
            return;
        }
        else
        {
            await slashCommand.reply({ ephemeral: true, content: `Sorry, but an error has occurred...` });
            return;
        }
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
