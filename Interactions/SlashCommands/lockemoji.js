const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, DMChannel, PartialGroupDMChannel } = require("discord.js");
const { fetchDisplayName } = require("../../constants");
const { localize } = require("../../BotModules/LocalizationModule");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "lockemoji",

    // Command's Description
    Description: `Upload a Custom Emoji to this Server, that can be locked behind a Role`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Upload a Custom Emoji to this Server, that can be locked behind a Role`,
        'en-US': `Upload a Custom Emoji to this Server, that can be locked behind a Role`
    },

    // Command's Category
    Category: "MANAGEMENT",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageRoles;
        Data.dmPermission = false;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Attachment,
                name: "emoji",
                description: "PNG or GIF of your Custom Emoji",
                descriptionLocalizations: {
                    'en-GB': `PNG or GIF of your Custom Emoji`,
                    'en-US': `PNG or GIF of your Custom Emoji`
                },
                required: true
            },
            {
                type: ApplicationCommandOptionType.Role,
                name: "role",
                description: "Role to lock your Custom Emoji behind",
                descriptionLocalizations: {
                    'en-GB': `Role to lock your Custom Emoji behind`,
                    'en-US': `Role to lock your Custom Emoji behind`
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
        // Just in case
        if ( slashCommand.channel instanceof DMChannel || slashCommand.channel instanceof PartialGroupDMChannel )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'SLASH_COMMAND_ERROR_DMS_UNSUPPORTED') });
            return;
        }

        // Ensure Bot has CREATE_EXPRESSIONS Permission
        if ( !slashCommand.appPermissions.has(BigInt(1 << 43)) )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'LOCKEMOJI_COMMAND_ERROR_MISSING_CREATE_EXPRESSIONS_PERMISSION') });
            return;
        }

        // Ensure no outages
        if ( !slashCommand.guild.available )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'SLASH_COMMAND_ERROR_DISCORD_OUTAGE') });
            return;
        }

        // Grab Inputs
        const InputAttachment = slashCommand.options.getAttachment("emoji", true);
        const InputRole = slashCommand.options.getRole("role", true);

        // Ensure Attachment is PNG or GIF
        if ( InputAttachment.contentType !== "image/png" && InputAttachment.contentType !== "image/gif" )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'LOCKEMOJI_COMMAND_ERROR_INVALID_FILE_TYPE') });
            return;
        }

        // Ensure Attachment is small enough to be uploaded as a Discord Custom Emoji
        if ( InputAttachment.size >= 256000 )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'LOCKEMOJI_COMMAND_ERROR_FILE_TOO_LARGE') });
            return;
        }

        // Defer, just in case
        await slashCommand.deferReply({ ephemeral: true });

        // Upload to Server        
        await slashCommand.guild.emojis.create({ attachment: InputAttachment.url, name: "UnnamedEmoji", roles: [InputRole.id], reason: localize(slashCommand.locale, 'LOCKEMOJI_COMMAND_AUDIT_LOG_EMOJI_UPLOADED', fetchDisplayName(slashCommand.user, true)) })
        .then(async newEmoji => {
            slashCommand.editReply({ content: localize(slashCommand.locale, 'LOCKEMOJI_COMMAND_UPLOAD_SUCCESS') });
            return;
        })
        .catch(async err => {
            //console.error(err);
            await slashCommand.editReply({ content: localize(slashCommand.locale, 'LOCKEMOJI_COMMAND_ERROR_FAILED_UPLOAD', `${err}`) });
            return;
        });

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
