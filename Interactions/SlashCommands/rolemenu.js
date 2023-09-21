const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, PermissionFlagsBits, ApplicationCommandOptionType, TextChannel, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants");
const { localize } = require("../../BotModules/LocalizationModule");

const CHANNEL_TYPE_TO_STRING = {
    0: "a Text",
    1: "a DM",
    2: "a Voice",
    3: "a Group DM",
    4: "a Category",
    5: "an Announcement",
    10: "an Announcement Thread",
    11: "a Public Thread",
    12: "a Private Thread",
    13: "a Stage",
    14: "a Directory",
    15: "a Forum"
};

const EmptyMenuEmbed = new EmbedBuilder().setDescription(`*Role Menu is currently empty. Please use the Select Menu below to configure this Role Menu.*`);

const InitialSelectMenu = new ActionRowBuilder().addComponents([
    new StringSelectMenuBuilder().setCustomId(`create-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder("Please select an action").setOptions([
        new StringSelectMenuOptionBuilder().setLabel("Set Menu Type").setValue("set-type").setDescription("Change how the Menu will behave once saved").setEmoji(`🔧`),
        new StringSelectMenuOptionBuilder().setLabel("Cancel Creation").setValue("cancel").setDescription("Cancels creation of this Role Menu").setEmoji(`❌`)
    ])
]);

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "rolemenu",

    // Command's Description
    Description: `Use to create Button Role Menus`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Use to create Button Role Menus`,
        'en-US': `Use to create Button Role Menus`
    },

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "create": 30
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "create": "GUILD"
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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageRoles;
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "create",
                description: "Create a new Button Role Menu",
                descriptionLocalizations: {
                    'en-GB': `Create a new Button Role Menu`,
                    'en-US': `Create a new Button Role Menu`
                },
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
        // Prevent usage in non-Text Channels
        if ( !(slashCommand.channel instanceof TextChannel) )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'SLASH_COMMAND_ERROR_ONLY_TEXT_CHANNELS') });
            return;
        }

        // Ensure Bot has MANAGE_ROLES Permission
        if ( !slashCommand.appPermissions.has(PermissionFlagsBits.ManageRoles) )
        {
            await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'ROLE_MENU_ERROR_MISSING_MANAGE_ROLES_PERMISSION') });
            return;
        }

        // Grab Subcommand used
        const SubCommandName = slashCommand.options.getSubcommand();

        // Menu Creation
        if ( SubCommandName === "create" )
        {
            // Ensure SEND_MESSAGES Perm for Bot
            if ( !slashCommand.appPermissions.has(PermissionFlagsBits.SendMessages) )
            {
                await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'ROLE_MENU_ERROR_MISSING_SEND_MESSAGES_PERMISSION') });
                return;
            }

            // Ensure there isn't already an active Role Menu Creation happening in that Guild
            if ( Collections.RoleMenuCreation.has(slashCommand.guildId) )
            {
                await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'ROLE_MENU_ERROR_ACTIVE_CREATION') });
                return;
            }

            // ACK to User
            await slashCommand.reply({ ephemeral: true, components: [InitialSelectMenu], embeds: [EmptyMenuEmbed], content: localize(slashCommand.locale, 'ROLE_MENU_CREATE_INTRUCTIONS') });

            // Auto-expire cache after one hour
            let timeoutExpiry = setTimeout(() => { Collections.RoleMenuCreation.delete(slashCommand.guildId); }, 3.6e+6);

            // Create empty placeholder
            let newDataObject = {
                type: "TOGGLE", // The default Menu Type
                embed: new EmbedBuilder(),
                roles: [],
                buttons: [],
                interaction: null,
                timeout: timeoutExpiry
            };

            Collections.RoleMenuCreation.set(slashCommand.guildId, newDataObject);
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
