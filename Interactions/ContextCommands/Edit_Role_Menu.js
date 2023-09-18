const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, DMChannel, PartialGroupDMChannel } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Edit Role Menu",

    // Command's Description
    Description: `Edit an existing Role Menu`,

    // Command's Category
    Category: "MANAGEMENT",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.Message,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

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
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageRoles;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        const MenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`configure-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(contextCommand.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(contextCommand.locale, 'ROLE_MENU_SET_MENU_TYPE')).setValue("set-type").setDescription(localize(contextCommand.locale, 'ROLE_MENU_SET_MENU_TYPE_DESCRIPTION')).setEmoji(`🔧`),
                new StringSelectMenuOptionBuilder().setLabel(localize(contextCommand.locale, 'ROLE_MENU_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(contextCommand.locale, 'ROLE_MENU_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(contextCommand.locale, 'ROLE_MENU_ADD_ROLE')).setValue("add-role").setDescription(localize(contextCommand.locale, 'ROLE_MENU_ADD_ROLE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(contextCommand.locale, 'ROLE_MENU_REMOVE_ROLE')).setValue("remove-role").setDescription(localize(contextCommand.locale, 'ROLE_MENU_REMOVE_ROLE_DESCRIPTION')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(contextCommand.locale, 'ROLE_MENU_SAVE_AND_POST')).setValue("save").setDescription(localize(contextCommand.locale, 'ROLE_MENU_SAVE_AND_POST_DESCRIPTION')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(contextCommand.locale, 'ROLE_MENU_CANCEL_CONFIGURATION')).setValue("cancel").setDescription(localize(contextCommand.locale, 'ROLE_MENU_CANCEL_CONFIGURATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);

        // Just in case
        if ( contextCommand.channel instanceof DMChannel || contextCommand.channel instanceof PartialGroupDMChannel )
        {
            await contextCommand.reply({ ephemeral: true, content: localize(contextCommand.locale, 'CONTEXT_COMMAND_ERROR_DMS_UNSUPPORTED') });
            return;
        }

        await contextCommand.deferReply({ ephemeral: true });

        // Check Message *is* a Role Menu with this Bot
        const RoleMenuJson = require('../../JsonFiles/Hidden/RoleMenus.json');
        const SourceMessage = contextCommand.options.getMessage('message', true);
        if ( !RoleMenuJson[SourceMessage.id] )
        {
            await contextCommand.editReply({ content: localize(contextCommand.locale, 'EDIT_ROLE_MENU_COMMAND_ERROR_MESSAGE_INVALID') });
            return;
        }

        // Ensure Bot has MANAGE_ROLES Permission
        if ( !contextCommand.appPermissions.has(PermissionFlagsBits.ManageRoles) )
        {
            await contextCommand.editReply({ context: localize(contextCommand.locale, 'EDIT_ROLE_MENU_COMMAND_ERROR_MISSING_MANAGE_ROLE_PERMISSION') });
            return;
        }

        // Ensure Bot has READ_MESSAGE_HISTORY Permission to be able to edit the existing Role Menu
        if ( !contextCommand.appPermissions.has(PermissionFlagsBits.ReadMessageHistory) )
        {
            await contextCommand.editReply({ content: localize(contextCommand.locale, 'EDIT_ROLE_MENU_COMMAND_ERROR_MISSING_MESSAGE_HISTORY_PERMISSION') });
            return;
        }

        // Ensure there isn't already an active Role Menu Configuration happening in that Guild
        if ( Collections.RoleMenuConfiguration.has(contextCommand.guildId) )
        {
            await contextCommand.editReply({ content: localize(contextCommand.locale, 'ROLE_MENU_ERROR_ACTIVE_CONFIGURATION') });
            return;
        }




        // Setup for Menu Configuration
        const MenuData = RoleMenuJson[SourceMessage.id];
        const ConfigEmbed = new EmbedBuilder().setTitle(MenuData["EMBED"]["TITLE"]);

        // Embed
        if ( MenuData["EMBED"]["DESCRIPTION"] !== null ) { ConfigEmbed.setDescription(MenuData["EMBED"]["DESCRIPTION"]); }
        if ( MenuData["EMBED"]["COLOR"] !== null ) { ConfigEmbed.setColor(MenuData["EMBED"]["COLOR"]); }

        
        // Roles & Buttons
        /** @type {Array<{id: String, style: String, emoji: ?String, label: ?String}>} */
        const RoleCache = MenuData["ROLES"];
        /** @type {Array<ButtonBuilder>} */
        let buttonCache = [];
        /** @type {Array<ActionRowBuilder>} */
        let componentsArray = [];
        let temp;
        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";
        let iCounter = 0;

        // Construct the Buttons && add to Embed
        RoleCache.forEach(role => {
            // Button stuff first
            let tempButtonStyle = role.style;
            let newButton = new ButtonBuilder().setCustomId(`configure-role-edit_${role.id}`)
            .setStyle(tempButtonStyle === 'blurple' ? ButtonStyle.Primary : tempButtonStyle === 'green' ? ButtonStyle.Success : tempButtonStyle === 'grey' ? ButtonStyle.Secondary : ButtonStyle.Danger);

            if ( role.label != null ) { newButton.setLabel(role.label); }
            if ( role.emoji != null ) { newButton.setEmoji(role.emoji); }

            buttonCache.push(newButton);

            
            // Components Array second
            if ( iCounter === 0 )
            {
                // Create first row
                temp = new ActionRowBuilder().addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }
            else if ( iCounter > 0 && iCounter < 5 )
            {
                // First row still has space
                temp.addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }
            else if ( iCounter === 5 )
            {
                // Move to second row
                componentsArray.push(temp);
                temp = new ActionRowBuilder().addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }
            else if ( iCounter > 5 )
            {
                // Second row has space
                temp.addComponents(newButton);
                if ( RoleCache.length - 1 === iCounter ) { componentsArray.push(temp); }
            }


            // Embed Strings third
            if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${role.id}> - ${role.emoji != null ? role.emoji : ""} ${role.label != null ? role.label : ""}\n`; }
            else { roleEmbedTextFieldTwo += `• <@&${role.id}> - ${role.emoji != null ? role.emoji : ""} ${role.label != null ? role.label : ""}\n`; }

            iCounter++;
        });


        // Add Select Menu
        componentsArray.push(MenuSelect);

        // Add strings to Embed
        ConfigEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
        if ( roleEmbedTextFieldTwo.length > 5 ) { ConfigEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo }); }

        // Auto-expire cache after one hour
        let timeoutExpiry = setTimeout(() => { Collections.RoleMenuConfiguration.delete(contextCommand.guildId); }, 3.6e+6);

        // Save to cache
        let newDataObject = {
            type: MenuData["MENU_TYPE"],
            originMessageId: SourceMessage.id,
            embed: ConfigEmbed,
            roles: RoleCache,
            buttons: buttonCache,
            interaction: null,
            timeout: timeoutExpiry
        };
        Collections.RoleMenuConfiguration.set(contextCommand.guildId, newDataObject);

        // Ack to User to begin Configuration Process
        await contextCommand.editReply({ components: componentsArray, embeds: [ConfigEmbed], content: localize(contextCommand.locale, 'ROLE_MENU_CONFIGURATION_INTRUCTIONS') });

        return;
    }
}
