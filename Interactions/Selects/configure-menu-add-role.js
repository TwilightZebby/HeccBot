const { RoleSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants");
const { localize } = require("../../BotModules/LocalizationModule");

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "configure-menu-add-role",

    // Select's Description
    Description: `Handles Role Select for adding a Role to a Menu during configuration (Role ID)`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 8,



    /**
     * Executes the Select
     * @param {RoleSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        // Grab Role
        const InputRole = selectInteraction.roles.first();

        // Validate Role hasn't already been added to this menu
        const RoleDataCache = Collections.RoleMenuConfiguration.get(selectInteraction.guildId).roles;
        let isRoleAdded = RoleDataCache.find(roleObj => roleObj.id === InputRole.id);
        if ( isRoleAdded != undefined )
        {
            await selectInteraction.update({ content: `${localize(selectInteraction.locale, 'ROLE_MENU_ROLE_ADD_INSTRUCTIONS')}\n\n:warning: ${localize(selectInteraction.locale, 'ROLE_MENU_ERROR_ROLE_ALREADY_ON_MENU', `<@&${InputRole.id}>`)}` });
            return;
        }

        // Validate Role is LOWER than Bot's own highest Role
        let botMember = selectInteraction.guild.members.me;
        let roleCompare = selectInteraction.guild.roles.comparePositions(InputRole.id, botMember.roles.highest.id);
        if ( roleCompare >= 0 )
        {
            await selectInteraction.update({ content: `${localize(selectInteraction.locale, 'ROLE_MENU_ROLE_ADD_INSTRUCTIONS')}\n\n:warning: ${localize(selectInteraction.locale, 'ROLE_MENU_ERROR_ROLE_TOO_HIGH', `<@&${InputRole.id}>`, `<@&${botMember.roles.highest.id}>`)}` });
            return;
        }

        // Select for setting the *type* of Button for the Menu
        const ButtonTypeSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`configure-menu-add-button_${InputRole.id}`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'ROLE_MENU_SELECT_BUTTON_COLOR')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_BUTTON_BLURPLE')).setValue("blurple"),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_BUTTON_GREEN')).setValue("green"),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_BUTTON_GREY')).setValue("grey"),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'ROLE_MENU_BUTTON_RED')).setValue("red")
            ])
        ]);

        // Update Message for next step - selecting Button Type to use
        await selectInteraction.update({ components: [ButtonTypeSelect], content: localize(selectInteraction.locale, 'ROLE_MENU_BUTTON_SET_INSTRUCTIONS', `<@&${InputRole.id}>`, `https://i.imgur.com/NDgzcYa.png`) });
        return;
    }
}
