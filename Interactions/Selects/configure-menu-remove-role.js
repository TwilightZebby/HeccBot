const { RoleSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants");
const { localize } = require("../../BotModules/LocalizationModule");


module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "configure-menu-remove-role",

    // Select's Description
    Description: `Handles Role Select for removing a Role from a Menu during configuration (Role ID)`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 8,



    /**
     * Executes the Select
     * @param {RoleSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        const NoRolesMenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`configure-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE')).setValue("set-type").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE_DESCRIPTION')).setEmoji(`🔧`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_ADD_ROLE')).setValue("add-role").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_ADD_ROLE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION')).setValue("cancel").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);
        
        const FullMenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`configure-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE')).setValue("set-type").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE_DESCRIPTION')).setEmoji(`🔧`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_ADD_ROLE')).setValue("add-role").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_ADD_ROLE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_REMOVE_ROLE')).setValue("remove-role").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_REMOVE_ROLE')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_SAVE_AND_UPDATE')).setValue("save").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_SAVE_AND_UPDATE')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION')).setValue("cancel").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);



        // Grab Role
        const InputRole = selectInteraction.roles.first();

        // Validate Role *IS* on this Menu
        const MenuDataCache = Collections.RoleMenuConfiguration.get(selectInteraction.guildId);
        const RoleDataCache = MenuDataCache.roles;
        const ButtonDataCache = MenuDataCache.buttons;
        let doesRoleExistOnMenu = false;

        for ( let i = 0; i <= RoleDataCache.length - 1; i++ )
        {
            if ( RoleDataCache[i].id === InputRole.id )
            {
                doesRoleExistOnMenu = true; // Mark existence
                RoleDataCache.splice(i, 1); // Removes from cache
                break;
            }
        }

        // Role doesn't exist on Menu, return with ACK message
        if ( !doesRoleExistOnMenu )
        {
            await selectInteraction.update({ content: `${localize(selectInteraction.locale, 'ROLE_MENU_ROLE_REMOVE_INSTRUCTIONS')}\n\n:warning:${localize(selectInteraction.locale, 'ROLE_MENU_ERROR_ROLE_NOT_ON_MENU', `<@&${InputRole.id}>`)}` });
            return;
        }

        // Role DOES exist on Menu, now to remove the Button
        for ( let j = 0; j <= ButtonDataCache.length - 1; j++ )
        {
            if ( ButtonDataCache[j].data.custom_id === `configure-role-edit_${InputRole.id}` )
            {
                ButtonDataCache.splice(j, 1); // Remove from cache
                break;
            }
        }

        // Save back to Collection
        MenuDataCache.roles = RoleDataCache;
        MenuDataCache.buttons = ButtonDataCache;

        // Update Menu Message
        /** @type {Array<ActionRowBuilder>} */
        let updatedComponentsArray = [];
        let updatedMenuEmbed = MenuDataCache.embed.spliceFields(0, 3);
        let temp;
        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";

        if ( ButtonDataCache.length >= 1 )
        {
            for ( let k = 0; k <= ButtonDataCache.length - 1; k++ )
            {
                if ( k === 0 )
                {
                    // First Button on first row
                    temp = new ActionRowBuilder().addComponents(ButtonDataCache[k]);
                    roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`;
                    // push early if only Button
                    if ( ButtonDataCache.length - 1 === k ) { updatedComponentsArray.push(temp); }
                }
                else if ( k > 0 && k < 4 )
                {
                    // First row, buttons two through four
                    temp.addComponents(ButtonDataCache[k]);
                    roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`;
                    // push early if last Button
                    if ( ButtonDataCache.length - 1 === k ) { updatedComponentsArray.push(temp); }
                }
                else if ( k === 4 )
                {
                    // First row, fifth button
                    temp.addComponents(ButtonDataCache[k]);
                    if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    // Free up TEMP ready for second row
                    updatedComponentsArray.push(temp);
                    temp = new ActionRowBuilder();
                }
                else if ( k > 4 && k < 9 )
                {
                    // Second row, buttons one through four
                    temp.addComponents(ButtonDataCache[k]);
                    if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    // push early if last Button
                    if ( ButtonDataCache.length - 1 === k ) { updatedComponentsArray.push(temp); }
                }
                else if ( k === 9 )
                {
                    // Second row, fifth button
                    temp.addComponents(ButtonDataCache[k]);
                    if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[k].id}> - ${RoleDataCache[k].emoji != null ? RoleDataCache[k].emoji : ""} ${RoleDataCache[k].label != null ? RoleDataCache[k].label : ""}\n`; }
                    updatedComponentsArray.push(temp);
                }
                else { break; }
            }

            // Update Embed
            updatedMenuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
            if ( roleEmbedTextFieldTwo.length > 5 ) { updatedMenuEmbed.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo }); }

            // Use full Select Menu
            updatedComponentsArray.push(FullMenuSelect);
        }
        else
        {
            // No more buttons left, use smaller Select Menu
            updatedComponentsArray.push(NoRolesMenuSelect);
        }

        MenuDataCache.embed = updatedMenuEmbed;

        // Update Menu
        await MenuDataCache.interaction.editReply({ components: updatedComponentsArray, embeds: [updatedMenuEmbed] });
        await selectInteraction.deferUpdate();
        await selectInteraction.deleteReply();

        // Purge interaction from cache
        MenuDataCache.interaction = null;
        // Save to cache
        Collections.RoleMenuConfiguration.set(selectInteraction.guildId, MenuDataCache);

        return;
    }
}
