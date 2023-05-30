const { ModalSubmitInteraction } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "say-plain",

    // Modal's Description
    Description: `Used to make Bot say plain text messages`,



    /**
     * Executes the Modal
     * @param {ModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        // Fetch Inputs
        const InputContent = modalInteraction.fields.getTextInputValue("content");
        const InputReference = modalInteraction.fields.getTextInputValue("reference");

        // Send Message
        await modalInteraction.channel.send({ content: InputContent, allowedMentions: { parse: [], repliedUser: false }, reply: { messageReference: InputReference } })
        .then( async SentMessage => {
            await modalInteraction.reply({ ephemeral: true, content: `Successfully sent the message, [linked here](<${SentMessage.url}>).` });
            return;
        })
        .catch( async err => {
            await modalInteraction.reply({ ephemeral: true, content: `Sorry, but there was an error trying to send that message.\nError:\n\n\`\`\`${err}\`\`\`` });
            return;
        });

        return;
    }
}
