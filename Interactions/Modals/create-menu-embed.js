const { ModalMessageModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");

const HexColourRegex = new RegExp(/#[0-9a-fA-F]{6}/);


module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-menu-embed",

    // Modal's Description
    Description: `Handles input for Role Menu Embed data during creation`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        const MenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(modalInteraction.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE')).setValue("set-type").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE_DESCRIPTION')).setEmoji(`🔧`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_ADD_ROLE')).setValue("add-role").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_ADD_ROLE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'ROLE_MENU_CANCEL_CREATION')).setValue("cancel").setDescription(localize(modalInteraction.locale, 'ROLE_MENU_CANCEL_CREATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);

        // Grab Inputs
        const InputTitle = modalInteraction.fields.getTextInputValue("title");
        const InputDescription = modalInteraction.fields.getTextInputValue("description");
        const InputColour = modalInteraction.fields.getTextInputValue("hex-colour");

        let originalComponents = modalInteraction.message.components;

        let menuEmbed = Collections.RoleMenuCreation.get(modalInteraction.guildId)?.embed;
        if ( !menuEmbed ) { menuEmbed = new EmbedBuilder(); }

        // Set data, if given, and also do validation checks if need be
        if ( InputTitle != "" && InputTitle != " " && InputTitle != null && InputTitle != undefined ) { menuEmbed.setTitle(InputTitle); }
        else { menuEmbed.setTitle(null); }

        if ( InputDescription != "" && InputDescription != " " && InputDescription != null && InputDescription != undefined ) { menuEmbed.setDescription(InputDescription); }
        else { menuEmbed.setDescription(null); }

        if ( InputColour != "" && InputColour != " " && InputColour != null && InputColour != undefined )
        {
            // Validate
            if ( !HexColourRegex.test(InputColour) )
            {
                await modalInteraction.update({ components: originalComponents });
                await modalInteraction.followUp({ ephemeral: true, content: localize(modalInteraction.locale, 'ERROR_INVALID_COLOR_HEX') });
                return;
            }
            else { menuEmbed.setColor(InputColour); }
        }
        else { menuEmbed.setColor(null); }

        // Update stored Embed
        let fetchedData = Collections.RoleMenuCreation.get(modalInteraction.guildId);
        fetchedData.embed = menuEmbed;
        Collections.RoleMenuCreation.set(modalInteraction.guildId, fetchedData);

        // Update Component to "no roles" one, if it was the first Embed edit
        if ( originalComponents[originalComponents.length - 1].components[originalComponents[originalComponents.length - 1].components.length - 1].options.length === 3 )
        {
            await modalInteraction.update({ embeds: [menuEmbed], components: [MenuSelectNoRoles] });
            return;
        }
        else
        {
            await modalInteraction.update({ embeds: [menuEmbed] });
            return;
        }
    }
}
