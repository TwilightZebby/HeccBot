const { ModalSubmitInteraction, ModalMessageModalSubmitInteraction } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "modal_custom_id",

    // Modal's Description
    Description: `Description`,



    /**
     * Executes the Modal
     * @param {ModalSubmitInteraction|ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        //.
    }
}
