const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { localize } = require("../../BotModules/LocalizationModule");

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
        // Fetch data needed
        const MemberVoting = buttonInteraction.member;
        const ChoiceVoted = buttonInteraction.customId.split("_").pop();
        const SourceMessage = buttonInteraction.message;
        let pollJson = require("../../JsonFiles/Hidden/ActivePolls.json");

        // Check if Member has already voted on this poll
        if ( pollJson[SourceMessage.id]["MEMBERS_VOTED"].includes(MemberVoting.id) )
        {
            await buttonInteraction.reply({ ephemeral: true, content: `${localize(buttonInteraction.locale, 'POLL_BUTTON_ERROR_ALREADY_VOTED')}` });
            return;
        }


        // Add Vote
        pollJson[SourceMessage.id]["CHOICES"][ChoiceVoted] += 1;
        pollJson[SourceMessage.id]["MEMBERS_VOTED"].push(MemberVoting.id);
        
        // Save to JSON
        fs.writeFile('./JsonFiles/Hidden/ActivePolls.json', JSON.stringify(pollJson, null, 4), async (err) => {
            if ( err )
            {
                await buttonInteraction.reply({ ephemeral: true, content: `${localize(buttonInteraction.locale, 'POLL_BUTTON_ERROR_GENERIC')}` });
                return;
            }
        });


        // Edit total votes into Embed
        const UpdatePollEmbed = EmbedBuilder.from(SourceMessage.embeds.pop());
        UpdatePollEmbed.setFooter({ text: `${localize(buttonInteraction.locale, 'POLL_BUTTON_CURRENT_TOTAL_VOTES', pollJson[SourceMessage.id]["MEMBERS_VOTED"].length)}` });


        // Calculate current results
        const OriginalChoices = UpdatePollEmbed.data.fields.shift().value.split(`• `);
        const FinalChoiceVotes = pollJson[SourceMessage.id]["CHOICES"];
        /** @type {Number} */
        const TotalVotes = pollJson[SourceMessage.id]["MEMBERS_VOTED"].length;

        
        // Calculate & map votes & percentages to their Choices
        let mappedResults = [];
        OriginalChoices.forEach(ChoiceString => {
            if ( ChoiceString != "" && ChoiceString != " " )
            {
                ChoiceString = ChoiceString.trim();
                let temp = "";
                let choiceValue = ChoiceString.toLowerCase().replace(" ", "-");
                
                // Choice Name (For UX)
                temp += `• **${ChoiceString}** `;
                // Number of Votes for Choice
                temp += `- ${FinalChoiceVotes[choiceValue]} ${FinalChoiceVotes[choiceValue] === 1 ? `${localize(buttonInteraction.locale, 'POLL_SINGLE_VOTE')}` : `${localize(buttonInteraction.locale, 'POLL_MULTIPLE_VOTES')}`} `;
                // Percentage of Total Votes
                temp += `(${FinalChoiceVotes[choiceValue] < 1 ? "0" : `~${((FinalChoiceVotes[choiceValue] / TotalVotes) * 100).toFixed(1)}`}%)`

                mappedResults.push(temp);
            }
        });

        let currentResultsEmbed = new EmbedBuilder().setTitle(`${localize(buttonInteraction.locale, 'POLL_CURRENT_RESULTS')}`)
        .setColor(UpdatePollEmbed.data.color)
        .addFields({ name: `${localize(buttonInteraction.locale, 'POLL_BUTTON_CHOICES')}`, value: mappedResults })
        .setFooter({ text: `${localize(buttonInteraction.locale, 'POLL_BUTTON_CURRENT_TOTAL_VOTES', TotalVotes)}` });

        
        // ACK        
        await buttonInteraction.update({ embeds: [UpdatePollEmbed] }).then(async updatedMessage => {
            // ACK to Member that their vote has been submitted
            await buttonInteraction.followUp({ ephemeral: true, embeds: [currentResultsEmbed], content: `${localize(buttonInteraction.locale, 'POLL_BUTTON_VOTE_SUCCESS', `**${ChoiceVoted.replace("-", " ")}**`)}` });
            return;
        });

        return;
    }
}
