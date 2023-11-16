const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { localize } = require("../../BotModules/LocalizationModule");
const { PollModel } = require("../../Mongoose/Models.js");

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "End Poll",

    // Command's Description
    Description: `Use to end an active Poll`,

    // Command's Category
    Category: "MANAGEMENT",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.Message,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",



    /**
     * Returns data needed for registering Context Command onto Discord's API
     * @returns {ApplicationCommandData}
     */
    registerData()
    {
        /** @type {ApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = "";
        Data.type = this.CommandType;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageChannels;

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} contextCommand 
     */
    async execute(contextCommand)
    {
        await contextCommand.deferReply({ ephemeral: true });

        // Fetch Message and ensure this Message contains a HeccBot Poll
        const SourceMessage = contextCommand.options.getMessage("message", true);

        if ( await PollModel.exists({ messageId: SourceMessage.id }) == null )
        {
            await contextCommand.editReply({ ephemeral: true, content: localize(contextCommand.locale, 'END_POLL_COMMAND_ERROR_MESSAGE_INVALID') });
            return;
        }

        // Grab Poll Data
        const FetchedPoll = await PollModel.findOne({ messageId: SourceMessage.id });

        // Calculate and map votes to their Choices
        let mappedResults = [];
        FetchedPoll.choices.forEach(Choice => {
            mappedResults.push(`- **${Choice.name}** - ${Choice.votes.length} Vote${Choice.votes.length === 1 ? "" : "s"}`);
        });


        // Edit into Embed
        // TODO: Add support for Total Votes & Percentages
        let updateEmbed = EmbedBuilder.from(SourceMessage.embeds[0]);
        updateEmbed = updateEmbed.spliceFields(0, 25);
        updateEmbed.addFields({ name: `Final Poll Results:`, value: mappedResults.join(`\n`) })
        .setFooter({ text: `Max Votes per User: ${FetchedPoll.maximumVotes}\nPoll ended at` })
        .setTimestamp(Date.now());


        // Update into Source Message
        await SourceMessage.edit({ components: [], embeds: [updateEmbed] })
        .then(async updatedMessage => {
            // Purge from DB
            await PollModel.deleteOne({ messageId: SourceMessage.id })
            .catch(async err => {
                await contextCommand.editReply({ content: localize(contextCommand.locale, 'END_POLL_COMMAND_ERROR_FAILED_TO_REMOVE') });
                return;
            })
            .then(async () => {
                await contextCommand.editReply({ ephemeral: true, content: localize(contextCommand.locale, 'END_POLL_COMMAND_SUCCESS') });
            });
        })
        .catch(async err => {
            await contextCommand.editReply({ content: localize(contextCommand.locale, 'END_POLL_COMMAND_ERROR_GENERIC') });
            return;
        })

        return;
    }
}
