const { ModalMessageModalSubmitInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");


module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll-add-choice",

    // Modal's Description
    Description: `Processes addition of a new Choice during creation of Poll`,



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
        let InputName = modalInteraction.fields.getTextInputValue("name");
        let InputLabel = modalInteraction.fields.getTextInputValue("label");

        // Tidy up, just in case
        InputName = InputName.trim();
        InputLabel = InputLabel.trim();

        // Just so I can have the Label be NULL if left undefined. Just makes things a little easier :P
        if ( InputLabel == '' ) { InputLabel = null; }


        // Update Cache & create new Choice
        let pollData = Collections.PollCreation.get(modalInteraction.guildId);
        let choiceCache = pollData.choices;
        if ( !choiceCache ) { choiceCache = []; }
        let newChoiceData = { name: InputName, label: InputLabel, emoji: null };


        // Ensure no duplicates
        if ( choiceCache.find(choiceObj => choiceObj.name.toLowerCase() === InputName.toLowerCase()) )
        {
            await modalInteraction.update({ content: `${localize(modalInteraction.locale, 'POLL_CREATE_INTRUCTIONS')}\n\n:warning: ${localize(modalInteraction.locale, 'POLL_ERROR_DUPLICATE_CHOICE')}` });
            return;
        }

        // Fetch Select & add new Choice
        let pollChoiceSelect = pollData.select;

        // Label was given
        if ( InputLabel != null )
        {
            pollChoiceSelect.addOptions(
                new StringSelectMenuOptionBuilder().setValue(InputName.toLowerCase().replace(" ", "-")).setLabel(InputLabel).setDescription(`(Choice: ${InputName})`)
            );
        }
        // No Label was given. Use Name instead
        else
        {
            pollChoiceSelect.addOptions(
                new StringSelectMenuOptionBuilder().setValue(InputName.toLowerCase().replace(" ", "-")).setLabel(InputName)
            );
        }

        // Save to main cache
        pollData.select = pollChoiceSelect;
        choiceCache.push(newChoiceData);
        pollData.choices = choiceCache;


        // Reconstruct Embed, add Components
        let pollEmbed = pollData.embed.spliceFields(0, 3);
        /** @type {Array<ActionRowBuilder>} */
        let updatedComponents = [ new ActionRowBuilder().addComponents(pollChoiceSelect) ];
        let choicesTextFieldOne = "";
        let choicesTextFieldTwo = "";

        for ( let i = 0; i <= choiceCache.length - 1; i++ )
        {
            // See if Name & Label are exactly the same, as to clean up UX
            let identicalChoiceField = false;
            if ( (choiceCache[i].label != null) && (choiceCache[i].name === choiceCache[i].label) ) { identicalChoiceField = true; }

            // Ensure not hitting character limits
            if (choicesTextFieldOne.length <= 900)
            {
                if ( choiceCache[i].label != null )
                {
                    if ( !identicalChoiceField ) { choicesTextFieldOne += `- ${choiceCache[i].name} (${choiceCache[i].label})\n`; }
                    else { choicesTextFieldOne += `- ${choiceCache[i].name}\n`; }
                }
                else
                {
                    choicesTextFieldOne += `- ${choiceCache[i].name}\n`;
                }
            }
            else
            {
                if ( choiceCache[i].label != null )
                {
                    if ( !identicalChoiceField ) { choicesTextFieldTwo += `- ${choiceCache[i].name} (${choiceCache[i].label})\n`; }
                    else { choicesTextFieldTwo += `- ${choiceCache[i].name}\n`; }
                }
                else
                {
                    choicesTextFieldTwo += `- ${choiceCache[i].name}\n`;
                }
            }
        }
        

        // Add Select, depending on choice amount
        if ( choiceCache.length >= 25 ) { updatedComponents.push(MaxChoicesMenuSelect); }
        else { updatedComponents.push(MenuSelect); }

        // Add to Embed
        if ( choicesTextFieldTwo.length >= 3 )
        {
            pollEmbed.addFields(
                { name: localize(modalInteraction.guildLocale, 'POLL_BUTTON_CHOICES'), value: choicesTextFieldOne },
                { name: `\u200B`, value: choicesTextFieldTwo },
                { name: `\u200B`, value: localize(modalInteraction.guildLocale, 'POLL_RESULTS_SHOWN_WHEN_ENDED') }
            );
        }
        else
        {
            pollEmbed.addFields(
                { name: localize(modalInteraction.guildLocale, 'POLL_BUTTON_CHOICES'), value: choicesTextFieldOne },
                { name: `\u200B`, value: localize(modalInteraction.guildLocale, 'POLL_RESULTS_SHOWN_WHEN_ENDED') }
            );
        }
        pollData.embed = pollEmbed;

        // Update Menu
        await modalInteraction.update({ components: updatedComponents, embeds: [pollEmbed], content: localize(modalInteraction.locale, 'POLL_CREATE_INTRUCTIONS') });

        // Save to cache
        Collections.PollCreation.set(modalInteraction.guildId, pollData);

        return;
    }
}
