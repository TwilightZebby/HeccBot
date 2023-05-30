const { ModalSubmitInteraction, EmbedBuilder } = require("discord.js");
const { DiscordClient, Collections } = require("../../constants.js");

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "say-embed",

    // Modal's Description
    Description: `Used to make Bot say embed messages`,



    /**
     * Executes the Modal
     * @param {ModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        // Fetch Inputs
        const InputTitle = modalInteraction.fields.getTextInputValue("title");
        const InputDescription = modalInteraction.fields.getTextInputValue("description");
        const InputAttachment = modalInteraction.fields.getTextInputValue("attachment");
        const InputColor = modalInteraction.fields.getTextInputValue("color");
        const InputReference = modalInteraction.fields.getTextInputValue("reference");

        // Ensure at least one field is given
        if ( !InputAttachment && !InputDescription && !InputTitle )
        {
            await modalInteraction.reply({ ephemeral: true, content: `Sorry, but you need to provide at least ONE field in order to send an Embed!` });
            return;
        }

        // Construct Embed
        const SayEmbed = new EmbedBuilder();
        if ( InputTitle ) { SayEmbed.setTitle(InputTitle); }
        if ( InputDescription ) { SayEmbed.setDescription(InputDescription); }
        if ( InputAttachment ) { SayEmbed.setImage(InputAttachment); }
        if ( InputColor ) { SayEmbed.setColor(InputColor); }


        // Send Message
        await modalInteraction.channel.send({ embeds: [SayEmbed], allowedMentions: { parse: [], repliedUser: false }, reply: { messageReference: InputReference } })
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
