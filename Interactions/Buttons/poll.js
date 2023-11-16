const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { localize } = require("../../BotModules/LocalizationModule");
const { PollModel } = require("../../Mongoose/Models");

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "poll",

    // Button's Description
    Description: `Handles vote submissions on Polls`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 20,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        await buttonInteraction.deferReply({ ephemeral: true });

        // Fetch data needed
        const MemberVoting = buttonInteraction.member;
        const ChoiceVoted = buttonInteraction.customId.split("_").pop();
        const SourceMessage = buttonInteraction.message;
        const FetchedPoll = await PollModel.findOne({ messageId: SourceMessage.id });

        // See how many times the Member has already voted on this Poll, if at all
        let memberVoteAmount = 0;
        FetchedPoll.choices.forEach(Choice => {
            if ( Choice.votes.includes(MemberVoting.user.id) ) { memberVoteAmount += 1; }
        });

        // Has Member reached the maximum vote amount?
        if ( memberVoteAmount >= FetchedPoll.maximumVotes )
        {
            await buttonInteraction.editReply({ ephemeral: true, content: `${localize(buttonInteraction.locale, 'POLL_ERROR_MAXIMUM_VOTES_REACHED')}` });
            return;
        }


        // Add User's Vote
        for ( let i = 0; i <= FetchedPoll.choices.length; i++ )
        {
            if ( FetchedPoll.choices[i].name === ChoiceVoted )
            {
                FetchedPoll.choices[i].votes.push(MemberVoting.user.id);
                break;
            }
        }

        // Save
        await FetchedPoll.save()
        .catch(async err => {
            await buttonInteraction.editReply({ content: localize(buttonInteraction.locale, 'POLL_BUTTON_ERROR_GENERIC') });
            return;
        })
        .then(async () => {
            // Create current results Embed
            const SourceEmbed = EmbedBuilder.from(SourceMessage.embeds[0]);
            const CurrentResultsEmbed = new EmbedBuilder().setTitle(SourceEmbed.data.title)
            .setDescription((SourceEmbed.data.description || null))
            .setColor((SourceEmbed.data.color || null));

            // TODO: Add Support for Total Votes & Percentages
            // Grab current votes
            let mappedResults = [];
            FetchedPoll.choices.forEach(Choice => {
                mappedResults.push(`- **${Choice.name}** - ${Choice.votes.length} Vote${Choice.votes.length === 1 ? "" : "s"}`);
            });
            CurrentResultsEmbed.addFields({ name: `Current Poll Results:`, value: mappedResults.join(`\n`) });

            // ACK
            await buttonInteraction.editReply({ embeds: [CurrentResultsEmbed], content: `${localize(buttonInteraction.locale, 'POLL_BUTTON_VOTE_SUCCESS', `**${ChoiceVoted.replace("-", " ")}**`)}` });
        });

        return;
    }
}
