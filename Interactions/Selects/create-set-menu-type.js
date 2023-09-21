const { StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");


module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-set-menu-type",

    // Select's Description
    Description: `Sets the Type of Role Menu during Menu Creation`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        const EmbedSelectMenu = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-role-menu`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE')).setValue("set-type").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE_DESCRIPTION')).setEmoji(`🔧`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION')).setValue("cancel").setDescription(localize(selectInteraction.locale, 'ROLE_MENU_CANCEL_CONFIGURATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);



        // Grab stuff
        const MenuDataCache = Collections.RoleMenuCreation.get(selectInteraction.guildId);
        const EmbedCache = MenuDataCache.embed;
        const SelectedTypeChoice = selectInteraction.values.shift();
        let originalComponents = MenuDataCache.interaction.message.components;

        // Set the Type
        EmbedCache.setFooter({ text: localize(selectInteraction.guildLocale, 'ROLE_MENU_TYPE_FOOTER', `${SelectedTypeChoice}`) });
        MenuDataCache.type = SelectedTypeChoice;
        MenuDataCache.embed = EmbedCache;

        // If this was the first time setting the Menu Type, update Select to allow editing of Embed
        if ( originalComponents[originalComponents.length - 1].components[originalComponents[originalComponents.length - 1].components.length - 1].options.length === 2 )
        {
            await MenuDataCache.interaction.editReply({ embeds: [EmbedCache], components: [EmbedSelectMenu] });
        }
        else
        {
            await MenuDataCache.interaction.editReply({ embeds: [EmbedCache] });
        }
        
        // Clean up        
        await selectInteraction.deferUpdate();
        await selectInteraction.deleteReply();

        // Clear Interaction from Cache, then save Type to it
        MenuDataCache.interaction = null;
        Collections.RoleMenuCreation.set(selectInteraction.guildId, MenuDataCache);

        return;
    }
}
