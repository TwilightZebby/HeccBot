const { ButtonInteraction } = require("discord.js");
const fs = require("fs");
const { localize } = require("../../BotModules/LocalizationModule");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "menu-delete-confirm",

    // Button's Description
    Description: `Deletes a Role Menu`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        await buttonInteraction.deferUpdate();

        // Grab Menu's Message ID & Message object
        const MenuMessageId = buttonInteraction.customId.split("_").pop();
        const MenuMessageObject = await buttonInteraction.channel.messages.fetch({ message: MenuMessageId, limit: 1 });
        const RoleMenuJson = require('../../JsonFiles/Hidden/RoleMenus.json');


        // Attempt deletion
        await MenuMessageObject.delete()
        .then(async deletedMessage => {
            delete RoleMenuJson[MenuMessageId];
            fs.writeFile('./JsonFiles/Hidden/RoleMenus.json', JSON.stringify(RoleMenuJson, null, 4), async err => {
                if ( err )
                {
                    console.error(err);
                }
            });

            await buttonInteraction.editReply({ components: [], content: `${localize(buttonInteraction.locale, 'DELETE_ROLE_MENU_COMMAND_SUCCESS')}` });
        })
        .catch(async err => {
            console.error(err);
            await buttonInteraction.editReply({ components: [], content: `${localize(buttonInteraction.locale, 'DELETE_ROLE_MENU_COMMAND_ERROR_GENERIC')}` });
        });

        return;
    }
}
