const { StringSelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const fs = require('fs');
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");


module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll",

    // Select's Description
    Description: `Handles processing options for creation of Polls`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        const AddChoiceModal = new ModalBuilder().setCustomId(`create-poll-add-choice`).setTitle(localize(selectInteraction.locale, 'POLL_ADD_CHOICE')).addComponents([
            new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId("label").setLabel(localize(selectInteraction.locale, 'POLL_ANSWER_CHOICE')).setMaxLength(80).setStyle(TextInputStyle.Short).setRequired(true) ])
        ]);



        // Grab value
        const SelectedOption = selectInteraction.values.shift();

        switch (SelectedOption)
        {
            // Edit Embed
            case "configure-embed":
                let embedData = Collections.PollCreation.get(selectInteraction.guildId)?.embed;

                let embedModal = new ModalBuilder().setCustomId(`create-poll-embed`).setTitle(localize(selectInteraction.locale, 'POLL_CONFIGURE_POLL_EMBED')).addComponents([
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`title`).setLabel(localize(selectInteraction.locale, 'POLL_POLL_QUESTION')).setMaxLength(256).setStyle(TextInputStyle.Short).setRequired(true).setValue(!embedData?.data.title ? "" : embedData.data.title) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`description`).setLabel(localize(selectInteraction.locale, 'POLL_POLL_DESCRIPTION')).setMaxLength(2000).setStyle(TextInputStyle.Paragraph).setRequired(false).setValue(!embedData?.data.description ? "" : embedData.data.description) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`hex-colour`).setLabel(localize(selectInteraction.locale, 'POLL_POLL_COLOR')).setMaxLength(7).setPlaceholder("#ab44ff").setStyle(TextInputStyle.Short).setRequired(false).setValue(!embedData?.data.color ? "" : `${typeof embedData.data.color === 'number' ? `#${embedData.data.color.toString(16).padStart(6, '0')}` : embedData.data.color}`) ])
                ]);

                await selectInteraction.showModal(embedModal);
                break;


            // Add a new Choice
            case "add-choice":
                // Validate Poll doesn't have more than 5 Choices (limit will be increased at a later date)
                let fetchedChoices = Collections.PollCreation.get(selectInteraction.guildId).choices;
                if ( fetchedChoices.length === 5 )
                {
                    await selectInteraction.reply({ ephemeral: true, content: localize(selectInteraction.locale, 'POLL_ERROR_EXCEEDED_BUTTON_LIMIT') });
                    break;
                }

                // Ask for Choice Label & Emoji
                await selectInteraction.showModal(AddChoiceModal);
                break;

            
            // Remove a Choice
            case "remove-choice":
                await selectInteraction.deferUpdate(); // So original is editable later

                // Construct String Select to select which Choice to delete
                let cachedChoices = Collections.PollCreation.get(selectInteraction.guildId).choices;
                let removeChoiceSelect = new StringSelectMenuBuilder().setCustomId("create-poll-remove-choice").setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'POLL_SELECT_CHOICE_REMOVE'));
                cachedChoices.forEach(choiceObj => {
                    removeChoiceSelect.addOptions(new StringSelectMenuOptionBuilder().setLabel(choiceObj.label).setValue(choiceObj.label.toLowerCase()));
                });

                // ACK to User
                await selectInteraction.followUp({ ephemeral: true, components: [new ActionRowBuilder().addComponents(removeChoiceSelect)], content: localize(selectInteraction.locale, 'POLL_REMOVE_CHOICE_INSTRUCTIONS') });

                // Temp-store interaction so we can return to it
                let pollDataRemoveChoice = Collections.PollCreation.get(selectInteraction.guildId);
                pollDataRemoveChoice.interaction = selectInteraction;
                Collections.PollCreation.set(selectInteraction.guildId, pollDataRemoveChoice);
                break;


            // Save & Display
            case "save":
                await saveAndDisplay(selectInteraction);
                break;


            // Cancel creation
            case "cancel":
                // Clear Timeout first, just in case
                let timeoutCache = Collections.PollCreation.get(selectInteraction.guildId).timeout;
                clearTimeout(timeoutCache);
                Collections.PollCreation.delete(selectInteraction.guildId);
                await selectInteraction.update({ embeds: [], components: [], content: localize(selectInteraction.locale, 'POLL_CREATION_CANCELLED') });
                break;


            default:
                await selectInteraction.reply({ ephemeral: true, content: localize(selectInteraction.locale, 'ERROR_GENERIC') });
                break;
        }

        return;
    }
}



/**
 * Saves & Displays the new Poll for Members to vote in
 * @param {StringSelectMenuInteraction} selectInteraction 
 */
async function saveAndDisplay(selectInteraction)
{
    await selectInteraction.deferUpdate();

    // Bring in JSON & fetch cached data
    const PollJson = require("../../JsonFiles/Hidden/ActivePolls.json");
    const PollCache = Collections.PollCreation.get(selectInteraction.guildId);
    const ButtonCache = PollCache.buttons;
    const ChoiceCache = PollCache.choices;
    const EmbedCache = PollCache.embed;

    // Change Buttons' Custom IDs and add to Component Row(s)
    // Also, construct Choices Object for Votes to be stored in the JSON
    let temp;
    /** @type {Array<ActionRowBuilder>} */
    let buttonsArray = [];
    let choiceVoteObject = {};

    for ( let i = 0; i <= ButtonCache.length - 1; i++ )
    {
        // Grab from old Custom ID
        let tempCustomID = ButtonCache[i].data.custom_id.split("_").pop();

        if ( i === 0 )
        {
            // First Button on first row
            temp = new ActionRowBuilder().addComponents(ButtonCache[i].setCustomId(`poll_${tempCustomID}`));
            choiceVoteObject[`${ChoiceCache[i].label.toLowerCase().replace(" ", "_")}`] = 0;

            // push early if only Button
            if ( ButtonCache.length - 1 === i ) { buttonsArray.push(temp); }
        }
        else
        {
            // First row, buttons two through four
            temp.addComponents(ButtonCache[i].setCustomId(`poll_${tempCustomID}`));
            choiceVoteObject[`${ChoiceCache[i].label.toLowerCase().replace(" ", "_")}`] = 0;

            // push early if last Button
            if ( ButtonCache.length - 1 === i ) { buttonsArray.push(temp); }
        }
    }


    // Send Poll
    await selectInteraction.channel.send({ embeds: [EmbedCache], components: buttonsArray, allowedMentions: { parse: [] } })
    .then(async sentMessage => {
        // Save to JSON
        PollJson[sentMessage.id] = {
            MESSAGE_ID: sentMessage.id,
            CHANNEL_ID: sentMessage.channel.id,
            GUILD_ID: sentMessage.guild.id,
            POLL_TYPE: "MANUAL",
            CHOICE_TYPE: "BUTTON",
            EMBED: {
                TITLE: EmbedCache.data.title,
                DESCRIPTION: EmbedCache.data.description !== undefined ? EmbedCache.data.description : null,
                COLOR: EmbedCache.data.color !== undefined ? EmbedCache.data.color : null
            },
            CHOICES: choiceVoteObject,
            MEMBERS_VOTED: []
        };

        fs.writeFile('./JsonFiles/Hidden/ActivePolls.json', JSON.stringify(PollJson, null, 4), async (err) => {
            if ( err )
            {
                await selectInteraction.followUp({ ephemeral: true, content: localize(selectInteraction.locale, 'POLL_ERROR_CREATION_GENERIC') });
                return;
            }
        });


        // Clean Up
        clearTimeout(PollCache.timeout);
        Collections.PollCreation.delete(selectInteraction.guildId);
        
        // ACK with message to also state how to END Polls
        await selectInteraction.editReply({ components: [], embeds: [], content: localize(selectInteraction.locale, 'POLL_CREATION_SUCCESS', `https://i.imgur.com/53NAww8.png`) });
        return;
    });

    return;
}
