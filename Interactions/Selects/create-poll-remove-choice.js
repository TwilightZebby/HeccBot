const { StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");



module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll-remove-choice",

    // Select's Description
    Description: `Handles removing the specified Choice from a Poll in construction`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        const MenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'POLL_SELECT_EDIT')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(selectInteraction.locale, 'POLL_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_ADD_CHOICE')).setValue("add-choice").setDescription(localize(selectInteraction.locale, 'POLL_ADD_CHOICE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_REMOVE_CHOICE')).setValue("remove-choice").setDescription(localize(selectInteraction.locale, 'POLL_REMOVE_CHOICE_DESCRIPTION')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_SAVE_AND_POST')).setValue("save").setDescription(localize(selectInteraction.locale, 'POLL_SAVE_AND_POST_DESCRIPTION')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_CANCEL_CREATION')).setValue("cancel").setDescription(localize(selectInteraction.locale, 'POLL_CANCEL_CREATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);
        
        const NoChoicesMenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'POLL_SELECT_EDIT')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(selectInteraction.locale, 'POLL_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_ADD_CHOICE')).setValue("add-choice").setDescription(localize(selectInteraction.locale, 'POLL_ADD_CHOICE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(selectInteraction.locale, 'POLL_CANCEL_CREATION')).setValue("cancel").setDescription(localize(selectInteraction.locale, 'POLL_CANCEL_CREATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);



        await selectInteraction.deferUpdate();


        // Grab Choice and cached data
        const InputChoice = selectInteraction.values.shift();
        let cachedPollData = Collections.PollCreation.get(selectInteraction.guildId);
        let cachedChoices = cachedPollData.choices;
        let cachedButtons = cachedPollData.buttons;
        let cachedEmbed = cachedPollData.embed;

        // Remove Choice
        for ( let i = 0; i <= cachedChoices.length - 1; i++ )
        {
            if ( cachedChoices[i].label.toLowerCase() === InputChoice )
            {
                cachedButtons.splice(i, 1);
                cachedChoices.splice(i, 1);
                break;
            }
        }


        // Update Embed
        cachedEmbed = cachedEmbed.spliceFields(0, 3);
        /** @type {Array<ActionRowBuilder>} */
        let updatedButtonsArray = [];
        let temp;
        let choicesTextFieldOne = "";

        for ( let i = 0; i <= cachedButtons.length - 1; i++ )
        {
            // First button
            if ( i === 0 )
            {
                temp = new ActionRowBuilder().addComponents(cachedButtons[i]);
                choicesTextFieldOne += `• ${cachedChoices[i].label}\n`
                //Push early if last Button
                if ( cachedButtons.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            // Buttons 2 - 5
            else
            {
                temp.addComponents(cachedButtons[i]);
                choicesTextFieldOne += `• ${cachedChoices[i].label}\n`
                //Push early if last Button
                if ( cachedButtons.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
        }

        cachedEmbed.addFields({ name: `Poll Choices:`, value: choicesTextFieldOne }, { name: `\u200B`, value: localize(selectInteraction.guildLocale, 'POLL_RESULTS_SHOWN_WHEN_ENDED') });

        // Add Select Menu, depending on number of choices left
        if ( cachedChoices.length < 1 ) { updatedButtonsArray.push(NoChoicesMenuSelect); }
        else { updatedButtonsArray.push(MenuSelect); }

        // Add back to cache
        cachedPollData.buttons = cachedButtons;
        cachedPollData.choices = cachedChoices;
        cachedPollData.embed = cachedEmbed;

        
        // ACK to User
        await cachedPollData.interaction.editReply({ components: updatedButtonsArray, embeds: [cachedEmbed] });
        await selectInteraction.deleteReply();

        // Purge cached Interaction
        cachedPollData.interaction = null;
        Collections.PollCreation.set(selectInteraction.guildId, cachedPollData);

        return;
    }
}
