const { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Role, GuildMember, EmbedBuilder } = require("discord.js");
const { DiscordClient } = require('../constants.js');
const ActionGifs = require('../JsonFiles/Hidden/ActionGifLinks.json');
const { localize } = require("./LocalizationModule.js");

// REGEXS
const EveryoneMentionRegEx = new RegExp(/@(everyone|here)/g);
const RoleMentionRegEx = new RegExp(/<@&(\d{17,20})>/g);

/**
 * Checks for [at]Everyone and [at]Here Mentions in a string
 * 
 * @param {String} string
 * @param {Boolean} [slice] True if wanting to return the string result instead of only testing the RegEx
 * 
 * @returns {Boolean|String}
 */
function TestForEveryoneMention(string, slice)
{
    if ( !slice )
    {
        return EveryoneMentionRegEx.test(string);
    }
    else
    {
        const testString = EveryoneMentionRegEx.test(string);

        if ( !testString )
        {
            return false;
        }
        else
        {
            const matchedString = string.replace('@', '');
            return matchedString;
        }
    }
}


/**
 * Check for [at]Role Mentions
 * 
 * @param {String} string 
 * @param {Boolean} [slice] True if wanting to return the string result instead of just testing the RegEx
 * 
 * @returns {Boolean|String} 
 */
function TestForRoleMention(string, slice)
{  
   if ( !slice )
   {
       return RoleMentionRegEx.test(string);
   }
   else
   {
       const testString = RoleMentionRegEx.test(string);
       
       if ( !testString )
       {
           return false;
       }
       else
       {
           let matchedString = string.replace('<@&', '');
           matchedString = matchedString.replace('>', '');
           return matchedString;
       }
   }
}


module.exports = {
    /**
     * Handles the Action Slash Commands
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async main(slashCommand)
    {
        // Grab data from options
        const PersonOption = slashCommand.options.getMentionable("person", true);
        const GifOptionRaw = slashCommand.options.get("gif");
        const GifOption = GifOptionRaw == null ? undefined : GifOptionRaw.value;
        const ButtonOptionRaw = slashCommand.options.get("button");
        const ButtonOption = ButtonOptionRaw == null ? undefined : ButtonOptionRaw.value;
        const ReasonOptionRaw = slashCommand.options.get("reason");
        const ReasonOption = ReasonOptionRaw == null ? undefined : ReasonOptionRaw.value;


        // Create Button for returning Action
        const ReturnActionActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`return-action_${slashCommand.commandName}_${slashCommand.user.id}_${PersonOption.id}`).setStyle(ButtonStyle.Primary).setLabel(`${localize(slashCommand.guildLocale, 'ACTION_RETURN_BUTTON_LABEL', slashCommand.commandName)}`)
        );
        // Button Boolean, for knowing if the Button should be included or not (do not appear when told not too, when a GIF is wanted, and when the Mention is *not* of a User/Member)
        let displayButton = false;
        // Override for GIF-less responses, if a Role mention is used as to prevent accidental Role Pings!
        let forceDisplayEmbed = false;
        // For assembling the returned message
        let displayMessage = "";

        
        // Assemble the message!
        // @everyone and @here
        if ( (PersonOption instanceof Role) && (PersonOption.id === PersonOption.guild.id) )
        {
            displayMessage = localize(slashCommand.guildLocale, `ACTION_COMMAND_EVERYONE_${slashCommand.commandName.toUpperCase()}`, slashCommand.member.displayName);
        }
        // @role
        else if ( (PersonOption instanceof Role) && (PersonOption.id !== PersonOption.guild.id) )
        {
            forceDisplayEmbed = true;
            displayMessage = localize(slashCommand.guildLocale, `ACTION_COMMAND_ROLE_${slashCommand.commandName.toUpperCase()}`, slashCommand.member.displayName, `<@&${PersonOption.id}>`);
        }
        // @user (self)
        else if ( (PersonOption instanceof GuildMember) && (PersonOption.id === slashCommand.user.id) )
        {
            displayMessage = localize(slashCommand.guildLocale, `ACTION_COMMAND_SELF_USER_${slashCommand.commandName.toUpperCase()}`, slashCommand.member.displayName);
        }
        // @user (this bot)
        else if ( (PersonOption instanceof GuildMember) && (PersonOption.id === DiscordClient.user.id) )
        {
            displayMessage = localize(slashCommand.guildLocale, `ACTION_COMMAND_HECCBOT_${slashCommand.commandName.toUpperCase()}`, slashCommand.member.displayName);
        }
        // @user (MeeYuck)
        else if ( (PersonOption instanceof GuildMember) && (PersonOption.id === '159985870458322944') )
        {
            displayMessage = localize(slashCommand.guildLocale, `ACTION_COMMAND_MEE6_${slashCommand.commandName.toUpperCase()}`, slashCommand.member.displayName, `<@159985870458322944>`);
        }
        // @user (literally any bot that isn't HeccBot or MeeYuck)
        else if ( (PersonOption instanceof GuildMember) && PersonOption.user.bot )
        {
            displayMessage = localize(slashCommand.guildLocale, `ACTION_COMMAND_OTHER_BOTS_${slashCommand.commandName.toUpperCase()}`, slashCommand.member.displayName, `${PersonOption.displayName}`);
        }
        // @user (literally any other User that doesn't meet the above)
        else
        {
            displayButton = true;
            displayMessage = localize(slashCommand.guildLocale, `ACTION_COMMAND_OTHER_USER_${slashCommand.commandName.toUpperCase()}`, slashCommand.member.displayName, `${PersonOption.displayName}`);
        }


        // If custom message is given, check for stray @mentions!
        if ( ReasonOption )
        {
            if ( TestForEveryoneMention(ReasonOption) ) { forceDisplayEmbed = true; }
            if ( TestForRoleMention(ReasonOption) ) { forceDisplayEmbed = true; }
            displayMessage += ` ${ReasonOption}`;
        }

        // Hide Return Action Button if requested
        if ( ButtonOption === false ) { displayButton = false; }


        // GIF was requested
        if ( GifOption )
        {
            const ActionEmbed = new EmbedBuilder().setDescription(displayMessage)
            .setImage(ActionGifs[`${slashCommand.commandName}`][Math.floor(( Math.random() * ActionGifs[`${slashCommand.commandName}`].length ) + 0)])
            .setColor(PersonOption instanceof Role ? PersonOption.hexColor : PersonOption instanceof GuildMember ? PersonOption.displayHexColor : 'Random');

            await slashCommand.reply({ allowedMentions: { parse: ['users'], users: ['159985870458322944'] }, embeds: [ActionEmbed] });
            delete ActionEmbed;
            return;
        }
        // GIF was NOT requested
        else
        {
            if ( forceDisplayEmbed )
            {
                const ActionEmbed = new EmbedBuilder().setDescription(displayMessage)
                .setColor(PersonOption instanceof Role ? PersonOption.hexColor : PersonOption instanceof GuildMember ? PersonOption.displayHexColor : 'Random');
                await slashCommand.reply({ allowedMentions: { parse: ['users'], users: ['159985870458322944'] }, embeds: [ActionEmbed] });
                delete ActionEmbed;
                return;
            }
            else
            {
                if ( displayButton )
                {
                    await slashCommand.reply({ allowedMentions: { parse: ['users'], users: ['159985870458322944'] }, components: [ReturnActionActionRow], content: displayMessage });
                
                    // Auto remove button after around 5 minutes, to keep chats clean
                    setTimeout(async () => {
                        return await slashCommand.editReply({ components: [] });
                    }, 60000);
                }
                else
                {
                    await slashCommand.reply({ allowedMentions: { parse: ['users'], users: ['159985870458322944'] }, content: displayMessage });
                }
            }
        }

        return;
    }
}
