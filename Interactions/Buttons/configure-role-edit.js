const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "configure-role-edit",

    // Button's Description
    Description: `Used to edit a Role Button during Menu Configuration`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 5,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Grab cache & Role ID
        const RoleDataCache = Collections.RoleMenuConfiguration.get(buttonInteraction.guildId).roles;
        const RoleID = buttonInteraction.customId.split("_").pop();
        let currentLabel = null;
        let currentEmoji = null;

        // Grab current Label/Emoji
        for ( let i = 0; i <= RoleDataCache.length - 1; i++ )
        {
            if ( RoleDataCache[i].id === RoleID )
            {
                currentLabel = RoleDataCache[i].label;
                currentEmoji = RoleDataCache[i].emoji;
                break;
            }
        }

        // Construct & Display Modal for editing Button Label/Emoji
        const EditButtonModal = new ModalBuilder().setCustomId(`configure-menu-edit-button_${RoleID}`).setTitle(`${localize(buttonInteraction.locale, 'ROLE_MENU_EDIT_BUTTON_LABEL')}`).addComponents([
            new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`label`).setLabel(`${localize(buttonInteraction.locale, 'ROLE_MENU_BUTTON_LABEL')}`).setMaxLength(80).setStyle(TextInputStyle.Short).setRequired(false).setValue(currentLabel != null ? currentLabel : "") ]),
            new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`emoji`).setLabel(`${localize(buttonInteraction.locale, 'ROLE_MENU_BUTTON_EMOJI')}`).setMaxLength(200).setPlaceholder(`<:grass_block:601353406577246208>, ✨`).setStyle(TextInputStyle.Short).setRequired(false).setValue(currentEmoji != null ? currentEmoji : "") ])
        ]);

        await buttonInteraction.showModal(EditButtonModal);
        return;
    }
}
