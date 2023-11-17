const { ModalMessageModalSubmitInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");


module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll-edit-choice",

    // Modal's Description
    Description: `Handles edits to existing Choices during Poll Creation`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        const MenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(modalInteraction.locale, 'POLL_SELECT_EDIT')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_ADD_CHOICE')).setValue("add-choice").setDescription(localize(modalInteraction.locale, 'POLL_ADD_CHOICE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE')).setValue("remove-choice").setDescription(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE_DESCRIPTION')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST')).setValue("save").setDescription(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST_DESCRIPTION')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION')).setValue("cancel").setDescription(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);
        
        
        const MaxChoicesMenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(modalInteraction.locale, 'POLL_SELECT_EDIT')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE')).setValue("remove-choice").setDescription(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE_DESCRIPTION')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST')).setValue("save").setDescription(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST_DESCRIPTION')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION')).setValue("cancel").setDescription(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);



        // Grab inputs
        const ChoiceCustomID = modalInteraction.customId.split("_").pop();
        const InputLabel = modalInteraction.fields.getTextInputValue("label");

        
        // Update cache & buttons
        let pollCache = Collections.PollCreation.get(modalInteraction.guildId);
        let choiceCache = pollCache.choices;
        let buttonCache = pollCache.buttons;
        let embedCache = pollCache.embed;

        for ( let i = 0; i <= choiceCache.length - 1; i++ )
        {
            if ( choiceCache[i].label.toLowerCase().replace(" ", "-") === ChoiceCustomID )
            {
                // Update Label
                choiceCache[i].label = InputLabel;
                buttonCache[i].setLabel(InputLabel);
                buttonCache[i].setCustomId(`new-choice-edit_${InputLabel.toLowerCase().replace(" ", "-")}`);

                break;
            }
        }


        // Save back to cache
        pollCache.buttons = buttonCache;
        pollCache.choices = choiceCache;


        // Re-Construct Embed, and add Component Arrays
        let pollEmbed = embedCache.spliceFields(0, 3);
        /** @type {Array<ActionRowBuilder>} */
        let updatedButtonsArray = [];
        let temp;
        let choicesTextFieldOne = "";

        for ( let i = 0; i <= buttonCache.length - 1; i++ )
        {
            // First button
            if ( i === 0 )
            {
                temp = new ActionRowBuilder().addComponents(buttonCache[i]);
                choicesTextFieldOne += `• ${choiceCache[i].label}\n`
                //Push early if last Button
                if ( buttonCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
            // Buttons 2 - 5
            else
            {
                temp.addComponents(buttonCache[i]);
                choicesTextFieldOne += `• ${choiceCache[i].label}\n`
                //Push early if last Button
                if ( buttonCache.length - 1 === i ) { updatedButtonsArray.push(temp); }
            }
        }


        // Add Select Menu, depending on number of choices
        if ( choiceCache.length >= 5 ) { updatedButtonsArray.push(MaxChoicesMenuSelect); }
        else { updatedButtonsArray.push(MenuSelect); }

        // Add to Embed
        pollEmbed.addFields({ name: localize(modalInteraction.guildLocale, 'POLL_BUTTON_CHOICES'), value: choicesTextFieldOne }, { name: `\u200B`, value: localize(modalInteraction.guildLocale, 'POLL_RESULTS_SHOWN_WHEN_ENDED') });
        pollCache.embed = pollEmbed;


        // Update Menu
        await modalInteraction.update({ components: updatedButtonsArray, embeds: [embedCache], content: localize(modalInteraction.locale, 'POLL_CREATE_INTRUCTIONS') });

        // Save to cache
        Collections.PollCreation.set(modalInteraction.guildId, pollCache);
        return;
    }
}
