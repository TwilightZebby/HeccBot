const { ButtonInteraction, Collection } = require("discord.js");
const { Collections } = require("../../constants.js");

module.exports = {
    /**
     * Handles and runs received Buttons
     * @param {ButtonInteraction} buttonInteraction 
     */
    async Main(buttonInteraction)
    {
        // Grab first part of Custom ID
        const ButtonCustomId = buttonInteraction.customId.split("_").shift();
        const Button = Collections.Buttons.get(ButtonCustomId)

        if ( !Button )
        {
            // Couldn't find the file for this Button
            return await buttonInteraction.reply({ ephemeral: true, content: "Sorry, but there was a problem trying to process that Button press." });
        }



        // Button Cooldowns
        if ( !Collections.ButtonCooldowns.has(ButtonCustomId) )
        {
            // No active Cooldowns found, create new one
            Collections.ButtonCooldowns.set(ButtonCustomId, new Collection());
        }

        // Set initial values
        const Now = Date.now();
        /** @type {Collection} */
        const Timestamps = Collections.ButtonCooldowns.get(ButtonCustomId);
        const CooldownAmount = ( Button.Cooldown || 3 ) * 1000;

        // Cooldown
        if ( Timestamps.has(buttonInteraction.user.id) )
        {
            // Cooldown hit, tell User to cool off a little bit
            const ExpirationTime = Timestamps.get(buttonInteraction.user.id) + CooldownAmount;

            if ( Now < ExpirationTime )
            {
                let timeLeft = ( ExpirationTime - Now ) / 1000; // How much time is left of cooldown, in seconds

                switch (timeLeft)
                {
                    // MINUTES
                    case timeLeft >= 60 && timeLeft < 3600:
                        timeLeft = timeLeft / 60; // For UX
                        let cooldownMinutesMessage = `Please wait ${timeLeft.toFixed(1)} more minutes before using that Button again.`;
                        return await buttonInteraction.reply({ ephemeral: true, content: cooldownMinutesMessage });

                    // HOURS
                    case timeLeft >= 3600 && timeLeft < 86400:
                        timeLeft = timeLeft / 3600; // For UX
                        let cooldownHoursMessage = `Please wait ${timeLeft.toFixed(1)} more hours before using that Button again.`;
                        return await buttonInteraction.reply({ ephemeral: true, content: cooldownHoursMessage });

                    // DAYS
                    case timeLeft >= 86400 && timeLeft < 2.628e+6:
                        timeLeft = timeLeft / 86400; // For UX
                        let cooldownDaysMessage = `Please wait ${timeLeft.toFixed(1)} more days before using that Button again.`;
                        return await buttonInteraction.reply({ ephemeral: true, content: cooldownDaysMessage });

                    // MONTHS
                    case timeLeft >= 2.628e+6:
                        timeLeft = timeLeft / 2.628e+6; // For UX
                        let cooldownMonthsMessage = `Please wait ${timeLeft.toFixed(1)} more months before using that Button again.`;
                        return await buttonInteraction.reply({ ephemeral: true, content: cooldownMonthsMessage });

                    // SECONDS
                    default:
                        let cooldownSecondsMessage = `Please wait ${timeLeft.toFixed(1)} more seconds before using that Button again.`;
                        return await buttonInteraction.reply({ ephemeral: true, content: cooldownSecondsMessage });
                }
            }
        }
        else
        {
            // Create new cooldown
            Timestamps.set(buttonInteraction.user.id, Now);
            setTimeout(() => Timestamps.delete(buttonInteraction.user.id), CooldownAmount);
        }



        // Attempt to process Button
        try { await Button.execute(buttonInteraction); }
        catch (err)
        {
            //console.error(err);
            if ( buttonInteraction.deferred )
            {
                await buttonInteraction.editReply({ content: "Sorry, but there was a problem trying to process that Button press." });
            }
            else
            {
                await buttonInteraction.reply({ ephemeral: true, content: "Sorry, but there was a problem trying to process that Button press." });
            }
        }

        return;
    }
}
