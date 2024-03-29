const { StringSelectMenuInteraction, RoleSelectMenuInteraction, ChannelSelectMenuInteraction, UserSelectMenuInteraction, MentionableSelectMenuInteraction, Collection } = require("discord.js");
const { Collections } = require("../../constants.js");
const { localize } = require("../LocalizationModule.js");

module.exports = {
    /**
     * Handles and runs received Selects
     * @param {StringSelectMenuInteraction|RoleSelectMenuInteraction|ChannelSelectMenuInteraction|UserSelectMenuInteraction|MentionableSelectMenuInteraction} selectInteraction 
     */
    async Main(selectInteraction)
    {
        // Grab first part of Custom ID
        const SelectCustomId = selectInteraction.customId.split("_").shift();
        const Select = Collections.Selects.get(SelectCustomId)

        if ( !Select )
        {
            // Couldn't find the file for this Select
            return await selectInteraction.reply({ ephemeral: true, content: `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_GENERIC')}` });
        }



        // Select Cooldowns
        if ( !Collections.SelectCooldowns.has(SelectCustomId) )
        {
            // No active Cooldowns found, create new one
            Collections.SelectCooldowns.set(SelectCustomId, new Collection());
        }

        // Set initial values
        const Now = Date.now();
        /** @type {Collection} */
        const Timestamps = Collections.SelectCooldowns.get(SelectCustomId);
        const CooldownAmount = ( Select.Cooldown || 3 ) * 1000;

        // Cooldown
        if ( Timestamps.has(selectInteraction.user.id) )
        {
            // Cooldown hit, tell User to cool off a little bit
            const ExpirationTime = Timestamps.get(selectInteraction.user.id) + CooldownAmount;

            if ( Now < ExpirationTime )
            {
                let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

                switch (timeLeft)
                {
                    // MINUTES
                    case timeLeft >= 60 && timeLeft < 3600:
                        timeLeft = timeLeft / 60; // For UX
                        let cooldownMinutesMessage = `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_COOLDOWN_MINUTES', timeLeft.toFixed(1))}`;
                        return await selectInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // HOURS
                    case timeLeft >= 3600 && timeLeft < 86400:
                        timeLeft = timeLeft / 3600; // For UX
                        let cooldownHoursMessage = `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_COOLDOWN_HOURS', timeLeft.toFixed(1))}`;
                        return await selectInteraction.reply({ ephemeral: true, content: cooldownHoursMessage });

                    // DAYS
                    case timeLeft >= 86400 && timeLeft < 2.628e+6:
                        timeLeft = timeLeft / 86400; // For UX
                        let cooldownDaysMessage = `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_COOLDOWN_DAYS', timeLeft.toFixed(1))}`;
                        return await selectInteraction.reply({ ephemeral: true, content: cooldownDaysMessage });

                    // MONTHS
                    case timeLeft >= 2.628e+6:
                        timeLeft = timeLeft / 2.628e+6; // For UX
                        let cooldownMonthsMessage = `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_COOLDOWN_MONTHS', timeLeft.toFixed(1))}`;
                        return await selectInteraction.reply({ ephemeral: true, content: cooldownMonthsMessage });

                    // SECONDS
                    default:
                        let cooldownSecondsMessage = `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_COOLDOWN_SECONDS', timeLeft.toFixed(1))}`;
                        return await selectInteraction.reply({ ephemeral: true, content: cooldownSecondsMessage });
                }
            }
        }
        else
        {
            // Create new cooldown
            Timestamps.set(selectInteraction.user.id, Now);
            setTimeout(() => Timestamps.delete(selectInteraction.user.id), CooldownAmount);
        }



        // Attempt to process Select
        try { await Select.execute(selectInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( selectInteraction.deferred )
            {
                await selectInteraction.editReply({ content: `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_GENERIC')}` });
            }
            else
            {
                await selectInteraction.reply({ ephemeral: true, content: `${localize(selectInteraction.locale, 'SELECT_MENU_ERROR_GENERIC')}` });
            }
        }

        return;
    }
}
