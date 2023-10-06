const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, ApplicationCommandOptionType, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const { localize } = require("../../BotModules/LocalizationModule.js");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "jail",

    // Command's Description
    Description: `Someone being horny on main or just plain naughty? Jail them!!`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Someone being horny on main or just plain naughty? Jail them!!`,
        'en-US': `Someone being horny on main or just plain naughty? Jail them!!`
    },

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.descriptionLocalizations = this.LocalisedDescriptions;
        Data.type = ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.AttachFiles;
        Data.options = [
            {
                type: ApplicationCommandOptionType.User,
                name: "user",
                description: "User to throw in jail",
                descriptionLocalizations: {
                    'en-GB': `User to throw in jail`,
                    'en-US': `User to throw in jail`
                },
                required: true
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Fetch User option and ensure they're a Server Member
        const MemberOption = slashCommand.options.getMember("user");
        if ( MemberOption == null ) { await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'INFO_COMMAND_USER_ERROR_NOT_IN_GUILD') }); return; }

        // Prevent usage on self
        if ( MemberOption.id === slashCommand.user.id ) { await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'JAIL_COMMAND_ERROR_CANNOT_JAIL_SELF')}); return; }

        // Defer just in case
        await slashCommand.deferReply();

        // Create Canvas
        const JailCanvas = Canvas.createCanvas(480, 360);
        const JailContext = JailCanvas.getContext('2d');

        // Grab user's profile picture using undici for better performance
        const { body } = await request(MemberOption.displayAvatarURL({ extension: 'png', size: 256 }));
        const Avatar = await Canvas.loadImage(await body.arrayBuffer());
        JailContext.drawImage(Avatar, 92, 33, 296, 296);

        // Load in the Jail Cell Bars
        const CellBarsRaw = (await request("https://i.imgur.com/Jw7OGBS.png")).body;
        const CellBarsImage = await Canvas.loadImage(await CellBarsRaw.arrayBuffer());
        JailContext.drawImage(CellBarsImage, 0, 0, JailCanvas.width, JailCanvas.height);

        // Create Attachment & send!
        const JailAttachment = new AttachmentBuilder(await JailCanvas.encode('png'), { name: 'jailed-user.png' });
        await slashCommand.editReply({ files: [JailAttachment], content: localize(slashCommand.guildLocale, 'JAIL_COMMAND_SUCCESS', `${MemberOption.displayName}`, `${slashCommand.member.displayName}`) })
        .catch(async err => {
            //console.error(err);
            await slashCommand.editReply({ content: localize(slashCommand.guildLocale, 'SLASH_COMMAND_ERROR_GENERIC') });
        });

        return;
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        //.
    }
}
