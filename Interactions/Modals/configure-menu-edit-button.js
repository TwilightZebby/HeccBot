const { ModalMessageModalSubmitInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const EmojiRegex = require("emoji-regex")();
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");

const DiscordEmojiRegex = new RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/);


module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "configure-menu-edit-button",

    // Modal's Description
    Description: `Handles edits to existing Role Buttons during Menu Configuration`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        const MenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`configure-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(modalInteraction.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE')).setValue("set-type").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE_DESCRIPTION')).setEmoji(`🔧`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_ADD_ROLE')).setValue("add-role").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_ADD_ROLE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_REMOVE_ROLE')).setValue("remove-role").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_REMOVE_ROLE_DESCRIPTION')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_SAVE_AND_UPDATE')).setValue("save").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_SAVE_AND_UPDATE_DESCRIPTION')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION')).setValue("cancel").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);

        // Grab inputs, Role ID, and Cache
        const MenuDataCache = Collections.RoleMenuConfiguration.get(modalInteraction.guildId);
        const RoleDataCache = MenuDataCache.roles;
        const ButtonDataCache = MenuDataCache.buttons;
        const EmbedDataCache = MenuDataCache.embed.spliceFields(0, 3);
        const RoleID = modalInteraction.customId.split("_").pop();
        const InputLabel = modalInteraction.fields.getTextInputValue("label").trim();
        const InputEmoji = modalInteraction.fields.getTextInputValue("emoji").trim();

        // Validate existence of Label/Emoji
        if ( (InputLabel == null && InputLabel !== "") && (InputEmoji == null && InputEmoji !== "") )
        {
            await modalInteraction.update({ content: `${localize(modalInteraction.locale, 'ROLE_MENU_BUTTON_SET_INSTRUCTIONS', `<@&${InputRole.id}>`)}\n\n${localize(modalInteraction.locale, 'ROLE_MENU_ERROR_CANNOT_HAVE_BLANK_BUTTON')}` });
            return;
        }

        // Validate Emoji (if included)
        if ( InputEmoji == null && InputEmoji !== "" )
        {
            if ( !DiscordEmojiRegex.text(InputEmoji) && !EmojiRegex.test(InputEmoji) )
            {
                await modalInteraction.update({ content: `${localize(modalInteraction.locale, 'ROLE_MENU_BUTTON_SET_INSTRUCTIONS', `<@&${InputRole.id}>`)}\n\n${localize(modalInteraction.locale, 'ROLE_MENU_ERROR_INVALID_EMOJI', '<https://emojipedia.org>')}` });
                return;
            }
        }

        // Update cache objects
        // ROLE CACHE
        for ( let i = 0; i <= RoleDataCache.length - 1; i++ )
        {
            if ( RoleDataCache[i].id === RoleID )
            {
                if ( InputLabel !== null && InputLabel !== "" ) { RoleDataCache[i].label = InputLabel; }
                else { RoleDataCache[i].label = ""; }

                if ( InputEmoji !== null && InputEmoji !== "" ) { RoleDataCache[i].emoji = InputEmoji; }
                else { RoleDataCache[i].emoji = ""; }

                break;
            }
        }

        // BUTTON CACHE
        for ( let i = 0; i <= ButtonDataCache.length - 1; i++ )
        {
            if ( ButtonDataCache[i].data.custom_id === `configure-role-edit_${RoleID}` )
            {
                if ( InputLabel !== null && InputLabel !== "" ) { ButtonDataCache[i].setLabel(InputLabel); }
                else { ButtonDataCache[i].data.label = undefined; }

                if ( InputEmoji !== null && InputEmoji !== "" ) { ButtonDataCache[i].setEmoji(InputEmoji); }
                else { ButtonDataCache[i].setEmoji({}); }

                break;
            }
        }

        // Save Buttons & Roles
        MenuDataCache.roles = RoleDataCache;
        MenuDataCache.buttons = ButtonDataCache;

        // Update Components & Embed
        /** @type {Array<ActionRowBuilder>} */
        let updatedButtonsArray = [];
        let temp;
        let roleEmbedTextFieldOne = "";
        let roleEmbedTextFieldTwo = "";

        for ( let i = 0; i <= ButtonDataCache.length - 1; i++ )
        {
            if ( i === 0 )
            {
                // First Button on first row
                temp = new ActionRowBuilder().addComponents(ButtonDataCache[i]);
                roleEmbedTextFieldOne += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`;
                // push early if only Button
                if ( ButtonDataCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, buttons two through four
                temp.addComponents(ButtonDataCache[i]);
                roleEmbedTextFieldOne += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`;
                // push early if last Button
                if ( ButtonDataCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // First row, fifth button
                temp.addComponents(ButtonDataCache[i]);
                if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`; }
                else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`; }
                // Free up TEMP ready for second row
                updatedButtonsArray.push(temp);
                temp = new ActionRowBuilder();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons one through four
                temp.addComponents(ButtonDataCache[i]);
                if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`; }
                else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`; }
                // push early if last Button
                if ( ButtonDataCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, fifth button
                temp.addComponents(ButtonDataCache[i]);
                if ( roleEmbedTextFieldOne.length <= 1000 ) { roleEmbedTextFieldOne += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`; }
                else { roleEmbedTextFieldTwo += `• <@&${RoleDataCache[i].id}> - ${RoleDataCache[i].emoji != null ? RoleDataCache[i].emoji : ""} ${RoleDataCache[i].label != null ? RoleDataCache[i].label : ""}\n`; }
                updatedButtonsArray.push(temp);
            }
            else { break; }
        }

        updatedButtonsArray.push(MenuSelect);

        // Add to Embed
        EmbedDataCache.addFields({ name: `\u200B`, value: roleEmbedTextFieldOne });
        if ( roleEmbedTextFieldTwo.length > 5 ) { EmbedDataCache.addFields({ name: `\u200B`, value: roleEmbedTextFieldTwo }); }
        MenuDataCache.embed = EmbedDataCache;

        // Update Menu
        await modalInteraction.update({ components: updatedButtonsArray, embeds: [EmbedDataCache] });

        // Save to cache
        Collections.RoleMenuConfiguration.set(modalInteraction.guildId, MenuDataCache);
        return;
    }
}
