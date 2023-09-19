const { ModalMessageModalSubmitInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
//const EmojiRegex = require("emoji-regex")();
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");

//const DiscordEmojiRegex = new RegExp(/<a?:(?<name>[a-zA-Z0-9\_]+):(?<id>\d{15,21})>/);


module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-poll-add-choice",

    // Modal's Description
    Description: `Processes addition of a new Choice Button during creation of Poll`,



    /**
     * Executes the Modal
     * @param {ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        const MenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(modalInteraction.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_ADD_CHOICE')).setValue("add-choice").setDescription(localize(modalInteraction.locale, 'POLL_ADD_CHOICE_DESCRIPTION')).setEmoji(`<:plusGrey:997752068439818280>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE')).setValue("remove-choice").setDescription(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE_DESCRIPTION')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST')).setValue("save").setDescription(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST_DESCRIPTION')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION')).setValue("cancel").setDescription(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);
        
        
        const MaxChoicesMenuSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-poll`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(modalInteraction.locale, 'PLEASE_SELECT_AN_ACTION')).setOptions([
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED')).setValue("configure-embed").setDescription(localize(modalInteraction.locale, 'POLL_CONFIGURE_EMBED_DESCRIPTION')).setEmoji(`<:StatusRichPresence:842328614883295232>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE')).setValue("remove-choice").setDescription(localize(modalInteraction.locale, 'POLL_REMOVE_CHOICE_DESCRIPTION')).setEmoji(`<:IconDeleteTrashcan:750152850310561853>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST')).setValue("save").setDescription(localize(modalInteraction.locale, 'POLL_SAVE_AND_POST_DESCRIPTION')).setEmoji(`<:IconActivity:815246970457161738>`),
                new StringSelectMenuOptionBuilder().setLabel(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION')).setValue("cancel").setDescription(localize(modalInteraction.locale, 'POLL_CANCEL_CREATION_DESCRIPTION')).setEmoji(`❌`)
            ])
        ]);



        // Grab inputs
        const InputLabel = modalInteraction.fields.getTextInputValue("label");


        // Update Cache & create new Button
        let pollData = Collections.PollCreation.get(modalInteraction.guildId);
        let choiceCache = pollData.choices;
        if ( !choiceCache ) { choiceCache = []; }
        let newChoiceData = { label: InputLabel, emoji: null };


        // Ensure no duplicates
        if ( choiceCache.find(choiceObj => choiceObj.label.toLowerCase() === InputLabel.toLowerCase()) )
        {
            await modalInteraction.update({ content: `${localize(modalInteraction.locale, 'POLL_CREATE_INTRUCTIONS')}\n\n:warning: ${localize(modalInteraction.locale, 'POLL_ERROR_DUPLICATE_CHOICE')}` });
            return;
        }

        // Construct Button
        let newChoiceButton = new ButtonBuilder().setCustomId(`new-choice-edit_${InputLabel.toLowerCase().replace(" ", "-")}`)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(InputLabel);


        // Fetch & add to Button Cache
        let buttonCache = pollData.buttons;
        if ( !buttonCache || buttonCache.length < 1 ) { buttonCache = [newChoiceButton]; }
        else { buttonCache.push(newChoiceButton); }

        // Save to main cache
        pollData.buttons = buttonCache;
        choiceCache.push(newChoiceData);
        pollData.choices = choiceCache;

        
        // Re-Construct Embed, and add Component Arrays
        let pollEmbed = pollData.embed.spliceFields(0, 3);
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
        pollData.embed = pollEmbed;

        // Update Menu
        await modalInteraction.update({ components: updatedButtonsArray, embeds: [pollEmbed], content: localize(modalInteraction.locale, 'POLL_CREATE_INTRUCTIONS') });

        // Save to cache
        Collections.PollCreation.set(modalInteraction.guildId, pollData);

        return;
    }
}
