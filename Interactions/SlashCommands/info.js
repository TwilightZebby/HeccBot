const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, AutocompleteInteraction, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel, VoiceChannel, StageChannel, NewsChannel, CategoryChannel, GuildVerificationLevel, GuildExplicitContentFilter, GuildDefaultMessageNotifications, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, Routes, Invite, ChannelType, InviteTargetType, GuildMember, ForumChannel, Role, DMChannel, PartialGroupDMChannel, ThreadChannel, DirectoryChannel, ThreadAutoArchiveDuration, SortOrderType, ChannelFlags, VideoQualityMode, GuildMemberFlags, RoleFlags } = require("discord.js");
const { DiscordClient, fetchDisplayName } = require("../../constants.js");
const Package = require('../../package.json');
const fetch = require('node-fetch');
const { localize } = require("../../BotModules/LocalizationModule.js");

if (!globalThis.fetch) { globalThis.fetch = fetch; }




// EMOJIS
const EMOJI_OWNER_CROWN = "<:ServerOwner:997752070436298804>";
const EMOJI_PARTNER = "<:Partnered:997752065789014067>";
const EMOJI_VERIFIED = "<:Verified:997752050920202270>";
const EMOJI_TIER_ONE = "<:BoostTier1:997752054305013800>";
const EMOJI_TIER_TWO = "<:BoostTier2:997752055395524698>";
const EMOJI_TIER_THREE = "<:BoostTier3:997752056788029460>";
const EMOJI_BOOST = "<:Boost:997752053155766343>";
const EMOJI_CHANNEL_TEXT = "<:ChannelText:997752062500671590>";
const EMOJI_CHANNEL_VOICE = "<:ChannelVoice:997752063612162138>";
const EMOJI_CHANNEL_STAGE = "<:ChannelStage:997752061330464818>";
const EMOJI_CHANNEL_NEWS = "<:ChannelAnnouncements:997752058092466236>";
const EMOJI_CHANNEL_CATEGORY = "<:ChannelCategory:997752059807928431>";
const EMOJI_CHANNEL_FORUM = "<:ChannelForum:1029012363048914967>";
const EMOJI_CHANNEL_RULES = "<:ChannelRules:1009372446362714174>";
const EMOJI_SCHEDULED_EVENT = "<:ScheduledEvent:1009372447503552514>";
const EMOJI_ROLE = "<:Role:997752069605822507>";
const EMOJI_EMOJI = "<:Emoji:997752064778174515>";
const EMOJI_STICKER = "<:Sticker:997752072848019527>";
const EMOJI_TIMEOUT = "<:timeout:997752074366369814>";
const EMOJI_MEMBERSHIP_GATING = "<:MembershipGating:1009751578070224946>";
const EMOJI_STATUS_IDLE = "<:StatusIdle:1009372448979947550>";
// Badges
const EMOJI_VERIFIED_BOT = "<:BadgeBotVerified:1026417284799021087>";
const EMOJI_SUPPORTS_APP_COMMANDS = "<:BadgeBotSupportsAppCommands:1026426199347560468>";
const EMOJI_USES_AUTOMOD = "<:BadgeBotAutoMod:1101078379681300560>";
const EMOJI_BUG_HUNTER_TIER_1 = "<:BadgeUserBugHunterTier1:1026417286111838228>";
const EMOJI_BUG_HUNTER_TIER_2 = "<:BadgeUserBugHunterTier2:1026417287252672562>";
const EMOJI_CERTIFIED_MOD = "<:BadgeUserCertifiedMod:1026417288406110208>";
const EMOJI_MOD_PROGRAM = "<:BadgeUserModPrograms:1051857830866591826>";
const EMOJI_EARLY_SUPPORTER = "<:BadgeUserEarlySupporter:1026417290268389426>";
const EMOJI_EARLY_VERIFIED_BOT_DEV = "<:BadgeUserEarlyVerifiedBotDev:1026417291522490449>";
const EMOJI_ACTIVE_DEVELOPER = "<:BadgeUserActiveDeveloper:1040340667869691954>";
const EMOJI_HYPESQUAD_BALANCE = "<:BadgeUserHypeSquadBalance:1026417292680105984>";
const EMOJI_HYPESQUAD_BRAVERY = "<:BadgeUserHypeSquadBravery:1026417293967773696>";
const EMOJI_HYPESQUAD_BRILLIANCE = "<:BadgeUserHypeSquadBrilliance:1026417295221862411>";
const EMOJI_HYPESQUAD_EVENTS = "<:BadgeUserHypeSquadEvents:1026417296421437480>";
const EMOJI_PARTNERED_SERVER_OWNER = "<:BadgeUserPartneredServerOwner:1026417297625202709>";
const EMOJI_STAFF = "<:BadgeUserStaff:1026417298808000512>";



// For making things readable to the User, improving UX
/**
 * Readable Guild Verification Level
 * @param {GuildVerificationLevel} guildVerificationLevel 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableVerificationLevel(guildVerificationLevel, locale) {
    let readableString = "";
    switch (guildVerificationLevel)
    {
        case GuildVerificationLevel.None:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_VERIFICATION_NONE');
            break;

        case GuildVerificationLevel.Low:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_VERIFICATION_LOW');
            break;

        case GuildVerificationLevel.Medium:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_VERIFICATION_MEDIUM');
            break;

        case GuildVerificationLevel.High:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_VERIFICATION_HIGH');
            break;

        case GuildVerificationLevel.VeryHigh:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_VERIFICATION_VERY_HIGH');
            break;
    }
    return readableString;
}

/**
 * Readable Guild Explicit Content Filter
 * @param {GuildExplicitContentFilter} guildExplicitContentLevel 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableExplicitFilter(guildExplicitContentLevel, locale)
{
    let readableString = "";
    switch (guildExplicitContentLevel)
    {
        case GuildExplicitContentFilter.Disabled:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_EXPLICIT_FILTER_DISABLED');
            break;

        case GuildExplicitContentFilter.MembersWithoutRoles:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_EXPLICIT_FILTER_ROLELESS');
            break;

        case GuildExplicitContentFilter.AllMembers:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_EXPLICIT_FILTER_EVERYONE');
            break;
    }
    return readableString;
}

/**
 * Readable Default Message Notification
 * @param {GuildDefaultMessageNotifications} defaultMessageNotification 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableDefaultNotification(defaultMessageNotification, locale)
{
    let readableString = "";
    switch(defaultMessageNotification)
    {
        case GuildDefaultMessageNotifications.AllMessages:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_DEFAULT_NOTIFICATION_ALL_MESSAGES');
            break;

        case GuildDefaultMessageNotifications.OnlyMentions:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_DEFAULT_NOTIFICATION_ONLY_MENTIONS');
            break;
    }
    return readableString;
}

/**
 * Readable MFA Level
 * @param {GuildMFALevel} mfaLevel 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableMFALevel(mfaLevel, locale)
{
    let readableString = "";
    switch(mfaLevel)
    {
        case GuildMFALevel.None:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_MFA_NONE');
            break;

        case GuildMFALevel.Elevated:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_MFA_ELEVATED');
            break;
    }
    return readableString;
}

/**
 * Readable NSFW Level
 * @param {GuildNSFWLevel} nsfwLevel 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableNSFWLevel(nsfwLevel, locale)
{
    let readableString = "";
    switch(nsfwLevel)
    {
        case GuildNSFWLevel.Default:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_NSFW_DEFAULT');
            break;

        case GuildNSFWLevel.Safe:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_NSFW_SAFE');
            break;

        case GuildNSFWLevel.AgeRestricted:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_NSFW_AGE_RESTRICTED');
            break;

        case GuildNSFWLevel.Explicit:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_NSFW_EXPLICIT');
            break;
    }
    return readableString;
}

/**
 * Convert raw Guild Feature Flag into Title Case
 * @param {String} featureString 
 */
function titleCaseGuildFeature(featureString)
{
    return featureString.toLowerCase()
        .replace(/guild/, "server")
        .split("_")
        .map(subString => subString.charAt(0).toUpperCase() + subString.slice(1))
        .join(" ");
}

/**
 * Readable Boosting Tiers
 * @param {GuildPremiumTier} premiumTier 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableGuildPremiumTier(premiumTier, locale)
{
    let readableString = "";
    switch(premiumTier)
    {
        case GuildPremiumTier.None:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_BOOST_TIER_NONE');
            break;

        case GuildPremiumTier.Tier1:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_BOOST_TIER_ONE');
            break;

        case GuildPremiumTier.Tier2:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_BOOST_TIER_TWO');
            break;

        case GuildPremiumTier.Tier3:
            readableString = localize(locale, 'INFO_COMMAND_GUILD_BOOST_TIER_THREE');
            break;
    }
    return readableString;
}

/**
 * Readable Boosting Tiers, returns Emoji Strings
 * @param {GuildPremiumTier} premiumTier 
 * @returns {String}
 */
function readableGuildPremiumTierEmoji(premiumTier)
{
    let readableString = "";
    switch(premiumTier)
    {
        case GuildPremiumTier.None:
            readableString = "";
            break;

        case GuildPremiumTier.Tier1:
            readableString = EMOJI_TIER_ONE;
            break;

        case GuildPremiumTier.Tier2:
            readableString = EMOJI_TIER_TWO;
            break;

        case GuildPremiumTier.Tier3:
            readableString = EMOJI_TIER_THREE;
            break;
    }
    return readableString;
}


/**
 * Readable User Flags
 * @param {String} userFlag 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableUserFlags(userFlag, locale)
{
    let readableString = "";
    switch(userFlag)
    {
        case "ActiveDeveloper":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_ACTIVE_DEVELOPER');
            break;

        case "BotHTTPInteractions":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_BOT_HTTP_INTERACTIONS');
            break;

        case "BugHunterLevel1":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_BUG_HUNTER_TIER_ONE');
            break;

        case "BugHunterLevel2":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_BUG_HUNTER_TIER_TWO');
            break;

        case "CertifiedModerator":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_CERTIFIED_MODERATOR');
            break;

        case "Collaborator":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_COLLABORATOR');
            break;

        case "HypeSquadOnlineHouse1":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_HYPESQUAD_HOUSE_BRAVERY');
            break;

        case "HypeSquadOnlineHouse2":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_HYPESQUAD_HOUSE_BRILLIANCE');
            break;

        case "HypeSquadOnlineHouse3":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_HYPESQUAD_HOUSE_BALANCE');
            break;

        case "Hypesquad":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_HYPESQUAD_EVENTS');
            break;

        case "Partner":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_PARTNER');
            break;

        case "PremiumEarlySupporter":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_EARLY_SUPPORTER');
            break;

        case "Quarantined":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_QUARANTINED');
            break;

        case "RestrictedCollaborator":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_RESTRICTED_COLLABORATOR');
            break;

        case "Spammer":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_SPAMMER');
            break;

        case "Staff":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_STAFF');
            break;

        case "TeamPseudoUser":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_TEAM_USER');
            break;

        case "VerifiedBot":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_VERIFIED_BOT');
            break;

        case "VerifiedDeveloper":
            readableString = localize(locale, 'INFO_COMMAND_USER_FLAG_VERIFIED_BOT_DEVELOPER');
            break;

        default:
            readableString = userFlag;
            break;
    }
    return readableString;
}

/**
 * Readable User Flags, returns Emoji strings
 * @param {String} userFlag 
 * @returns {String}
 */
function readableUserFlagsEmoji(userFlag)
{
    let readableString = "";
    switch(userFlag)
    {
        case "BugHunterLevel1":
            readableString = EMOJI_BUG_HUNTER_TIER_1;
            break;

        case "BugHunterLevel2":
            readableString = EMOJI_BUG_HUNTER_TIER_2;
            break;

        case "CertifiedModerator":
            readableString = EMOJI_MOD_PROGRAM;
            break;

        case "HypeSquadOnlineHouse1":
            readableString = EMOJI_HYPESQUAD_BRAVERY;
            break;

        case "HypeSquadOnlineHouse2":
            readableString = EMOJI_HYPESQUAD_BRILLIANCE;
            break;

        case "HypeSquadOnlineHouse3":
            readableString = EMOJI_HYPESQUAD_BALANCE;
            break;

        case "Hypesquad":
            readableString = EMOJI_HYPESQUAD_EVENTS;
            break;

        case "Partner":
            readableString = EMOJI_PARTNERED_SERVER_OWNER;
            break;

        case "PremiumEarlySupporter":
            readableString = EMOJI_EARLY_SUPPORTER;
            break;

        case "Staff":
            readableString = EMOJI_STAFF;
            break;

        case "VerifiedBot":
            readableString = EMOJI_VERIFIED_BOT;
            break;

        case "VerifiedDeveloper":
            readableString = EMOJI_EARLY_VERIFIED_BOT_DEV;
            break;

        case "ActiveDeveloper":
            readableString = EMOJI_ACTIVE_DEVELOPER;
            break;

        default:
            // To catch the Flags that DON'T have Badges connected with them
            readableString = "NULL";
            break;
    }
    return readableString;
}


/**
 * Readable Channel Types
 * @param {ChannelType} channelType 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableChannelType(channelType, locale)
{
    let readableString = "";
    switch(channelType)
    {
        case ChannelType.DM:
            readableString = localize(locale, 'CHANNEL_TYPE_DM');
            break;

        case ChannelType.GroupDM:
            readableString = localize(locale, 'CHANNEL_TYPE_GROUP_DM');
            break;

        case ChannelType.GuildCategory:
            readableString = localize(locale, 'CHANNEL_TYPE_CATEGORY');
            break;

        case ChannelType.GuildDirectory:
            readableString = localize(locale, 'CHANNEL_TYPE_DIRECTORY');
            break;

        case ChannelType.GuildForum:
            readableString = localize(locale, 'CHANNEL_TYPE_FORUM');
            break;

        case ChannelType.GuildAnnouncement:
            readableString = localize(locale, 'CHANNEL_TYPE_ANNOUNCEMENT');
            break;
            
        case ChannelType.AnnouncementThread:
            readableString = localize(locale, 'CHANNEL_TYPE_THREAD_ANNOUNCEMENT');
            break;

        case ChannelType.PrivateThread:
            readableString = localize(locale, 'CHANNEL_TYPE_THREAD_PRIVATE');
            break;

        case ChannelType.PublicThread:
            readableString = localize(locale, 'CHANNEL_TYPE_THREAD_PUBLIC');
            break;

        case ChannelType.GuildStageVoice:
            readableString = localize(locale, 'CHANNEL_TYPE_STAGE');
            break;

        case ChannelType.GuildText:
            readableString = localize(locale, 'CHANNEL_TYPE_TEXT');
            break;

        case ChannelType.GuildVoice:
            readableString = localize(locale, 'CHANNEL_TYPE_VOICE');
            break;

        default:
            readableString = localize(locale, 'CHANNEL_TYPE_UNKNOWN');
            break;
    }
    return readableString;
}


/**
 * Readable Bot Application Flags
 * @param {String} applicationFlag 
 * @param {String} locale Locale from Command
 * @returns {String}
 */
function readableApplicationFlags(applicationFlag, locale)
{
    let readableString = "";
    switch(applicationFlag)
    {
        case "ApplicationAutoModerationRuleCreateBadge":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_AUTOMOD_BADGE');
            break;

        case "ApplicationCommandBadge":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_APPLICATION_COMMANDS_BADGE');
            break;

        case "Embedded":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_EMBEDDED');
            break;

        case "EmbeddedFirstParty":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_EMBEDDED_FIRST_PARTY');
            break;

        case "EmbeddedIAP":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_EMBEDDED_IAP');
            break;

        case "EmbeddedReleased":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_EMBEDDED_RELEASED');
            break;

        case "GatewayGuildMembers":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_INTENT_GUILD_MEMBERS');
            break;

        case "GatewayGuildMembersLimited":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_INTENT_GUILD_MEMBERS_LIMITED');
            break;

        case "GatewayMessageContent":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_INTENT_MESSAGE_CONTENT');
            break;

        case "GatewayMessageContentLimited":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_INTENT_MESSAGE_CONTENT_LIMITED');
            break;

        case "GatewayPresence":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_INTENT_PRESENCE');
            break;

        case "GatewayPresenceLimited":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_INTENT_PRESENCE_LIMITED');
            break;

        case "GroupDMCreate":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_GROUP_DM_CREATE');
            break;

        case "ManagedEmoji":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_MANAGED_EMOJI');
            break;

        case "RPCHasConnected":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_RPC_CONNECTED');
            break;

        case "VerificationPendingGuildLimit":
            readableString = localize(locale, 'INFO_COMMAND_APPLICATION_FLAG_VERIFICATION_BLOCKED_BY_GROWTH');
            break;
    }
    return readableString;
}


/** Bot Flags to be included in seperate Embed Field to the others */
const BotIntentFlags = [ "GatewayPresence", "GatewayPresenceLimited", "GatewayMessageContent", "GatewayMessageContentLimited", "GatewayGuildMembers", "GatewayGuildMembersLimited" ];



/**
 * Checks if the Bot has the ability to use External Emojis in Interaction Responses
 * @param {ChatInputCommandInteraction} slashCommand 
 * @returns {Boolean}
 */
function checkEmojiPermission(slashCommand)
{
    //return slashCommand.appPermissions.has(PermissionFlagsBits.UseExternalEmojis);
    // TEMP - Use atEveryone Permissions since Discord broke External Emoji checks for deferred Interaction responses :c
    return slashCommand.guild.roles.everyone.permissionsIn(slashCommand.channelId).has(PermissionFlagsBits.UseExternalEmojis);
}

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "info",

    // Command's Description
    Description: `Shows information about this Bot, this Server, a User, Role, Channel, or Invite.`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Shows information about this Bot, this Server, a User, Role, Channel, or Invite.`,
        'en-US': `Shows information about this Bot, this Server, a User, Role, Channel, or Invite.`
    },

    // Command's Category
    Category: "INFORMATION",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "server": 30,
        "invite": 60,
        "user": 30,
        "bot": 10,
        "role": 20,
        "channel": 20
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "ALL",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "server": "GUILD",
        "invite": "ALL",
        "user": "ALL",
        "bot": "ALL",
        "role": "GUILD",
        "channel": "GUILD"
    },

    // TODO: Add support for use in DMs and GDMs once Discord releases their upcoming update allowing Bots with Application Commands to be usable in GDMs

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
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "bot",
                description: "Display information about this Bot",
                descriptionLocalizations: {
                    'en-GB': `Display information about this Bot`,
                    'en-US': `Display information about this Bot`
                },
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "server",
                description: "Display information about this Server",
                descriptionLocalizations: {
                    'en-GB': `Display information about this Server`,
                    'en-US': `Display information about this Server`
                },
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "user",
                description: "Display information about either yourself, or another User",
                descriptionLocalizations: {
                    'en-GB': `Display information about either yourself, or another User`,
                    'en-US': `Display information about either yourself, or another User`
                },
                options: [
                    {
                        type: ApplicationCommandOptionType.User,
                        name: "user",
                        description: "User to display information about",
                        descriptionLocalizations: {
                            'en-GB': `User to display information about`,
                            'en-US': `User to display information about`
                        },
                        required: false
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "invite",
                description: "Display information about a given Discord Server Invite",
                descriptionLocalizations: {
                    'en-GB': `Display information about a given Discord Server Invite`,
                    'en-US': `Display information about a given Discord Server Invite`
                },
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "code",
                        description: "The Discord Invite Code or Link",
                        descriptionLocalizations: {
                            'en-GB': `The Discord Invite Code or Link`,
                            'en-US': `The Discord Invite Code or Link`
                        },
                        max_length: 150,
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "role",
                description: "Display information about a Role from this Server",
                descriptionLocalizations: {
                    'en-GB': `Display information about a Role from this Server`,
                    'en-US': `Display information about a Role from this Server`
                },
                options: [
                    {
                        type: ApplicationCommandOptionType.Role,
                        name: "role",
                        description: "Role to display information about",
                        descriptionLocalizations: {
                            'en-GB': `Role to display information about`,
                            'en-US': `Role to display information about`
                        },
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "channel",
                description: "Display information about either this Channel, or a specified Channel",
                descriptionLocalizations: {
                    'en-GB': `Display information about either this Channel, or a specified Channel`,
                    'en-US': `Display information about either this Channel, or a specified Channel`
                },
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: "Channel to display information about",
                        descriptionLocalizations: {
                            'en-GB': `Channel to display information about`,
                            'en-US': `Channel to display information about`
                        },
                        required: false
                    }
                ]
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
        // Grab Subcommand used
        const SubcommandName = slashCommand.options.getSubcommand(true);

        // Fetch information based on Subcommand used
        switch(SubcommandName)
        {
            case "server":
                await this.fetchServerInfo(slashCommand);
                break;

            case "user":
                await this.fetchUserInfo(slashCommand);
                break;

            case "invite":
                await this.fetchInviteInfo(slashCommand);
                break;

            case "bot":
                await this.fetchBotInfo(slashCommand);
                break;

            case "role":
                await this.fetchRoleInfo(slashCommand);
                break;

            case "channel":
                await this.fetchChannelInfo(slashCommand);
                break;

            default:
                await slashCommand.reply({ ephemeral: true, content: localize(slashCommand.locale, 'SLASH_COMMAND_ERROR_GENERIC') /* "Sorry, but there was a problem trying to run this Slash Command." */ });
                break;
        }

        return;
    },
    


    /**
     * Fetches and Displays the Information about either the current, or specified Channel
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchChannelInfo(slashCommand)
    {
        await slashCommand.deferReply({ ephemeral: true });
        //const ExternalEmojiPermission = checkEmojiPermission(slashCommand);

        /** @type {TextChannel|CategoryChannel|ForumChannel|NewsChannel|StageChannel|ThreadChannel|VoiceChannel} */
        let fetchedChannel;
        const OptionChannel = slashCommand.options.getChannel("channel");

        // Catch for KNOWN unsupported Channel Types
        if ( OptionChannel.type === 14 ) { await slashCommand.editReply({ content: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_DIRECTORY_UNSUPPORTED') }); return; }
        if ( OptionChannel.type === 16 ) { await slashCommand.editReply({ content: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_MEDIA_UNSUPPORTED') }); return; }

        try
        {
            if ( !OptionChannel || OptionChannel == null ) { fetchedChannel = await slashCommand.channel.fetch(); }
            else { fetchedChannel = await OptionChannel.fetch(); }
        }
        catch (err)
        {
            await slashCommand.editReply({ content: localize(slashCommand.locale, 'INFO_COMMAND_ERROR_CHANNEL_FETCH_FAILED') });
            return;
        }


        // Reject DMs and GDMs
        if ( fetchedChannel instanceof DMChannel || fetchedChannel instanceof PartialGroupDMChannel )
        {
            await slashCommand.editReply({ content: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_DM_UNSUPPORTED') });
            return;
        }
        

        // Embed & Basic Info
        const EmbedChannel = new EmbedBuilder().setTitle(`#${fetchedChannel.name}`)
        .setFooter({ text: localize(slashCommand.locale, 'CREATED') })
        .setTimestamp(fetchedChannel.createdAt);

        if ( fetchedChannel.topic != null ) { EmbedChannel.setDescription(fetchedChannel.topic); }

        EmbedChannel.addFields({
            name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_GENERAL'),
            value: `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_TYPE')} ${readableChannelType(fetchedChannel.type, slashCommand.locale)}
${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_MENTION')} <#${fetchedChannel.id}>
${fetchedChannel.parentId != null ? `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_PARENT')} <#${fetchedChannel.parentId}>` : ""}`
        });


        // Channel Type specific information
        // Category Channel
        if ( fetchedChannel instanceof CategoryChannel )
        {
            EmbedChannel.addFields({
                name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_CATEGORY_INFO'),
                value: `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_CACHED_CHILDREN')} ${fetchedChannel.children.cache.size}`
            });
        }

        // Forum Channel
        if ( fetchedChannel instanceof ForumChannel )
        {
            let forumString = `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_NSFW')} ${fetchedChannel.nsfw ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;

            forumString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_DEFAULT_REACTION')} ${fetchedChannel.defaultReactionEmoji != null ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;
            if ( fetchedChannel.defaultSortOrder != null ) { forumString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_DEFAULT_SORT_ORDER')} ${fetchedChannel.defaultSortOrder === SortOrderType.CreationDate ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_SORT_CREATION') : localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_SORT_ACTIVITY')}`; }
            if ( fetchedChannel.defaultAutoArchiveDuration != null ) { forumString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_DEFAULT_AUTO_HIDE')} ${fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.OneHour ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_HOUR') : fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.OneDay ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_DAY') : fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.ThreeDays ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_THREE_DAYS') : localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_WEEK')}`; }
            if ( fetchedChannel.defaultThreadRateLimitPerUser != null ) { forumString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_DEFAULT_MESSAGE_SLOWMODE')} ${fetchedChannel.defaultThreadRateLimitPerUser} ${localize(slashCommand.locale, 'SECONDS')}`; }
            if ( fetchedChannel.rateLimitPerUser != null ) { forumString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_POST_SLOWMODE')} ${fetchedChannel.rateLimitPerUser} ${localize(slashCommand.locale, 'SECONDS')}`; }
            forumString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_REQUIRES_TAGS')} ${fetchedChannel.flags.has(ChannelFlags.RequireTag) ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;
            forumString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_TAG_AMOUNT')} ${fetchedChannel.availableTags.length}`;

            EmbedChannel.addFields({
                name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_INFO'),
                value: forumString
            });

            if ( fetchedChannel.availableTags.length > 0 )
            {
                let tagString = "";
                fetchedChannel.availableTags.forEach(tag => { tagString += `${tag.name}, `; });
                EmbedChannel.addFields({ name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_TAG_INFO'), value: tagString });
            }
        }

        // Announcement/News Channel
        if ( fetchedChannel instanceof NewsChannel )
        {
            let announcementString = `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_NSFW')} ${fetchedChannel.nsfw ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;

            if ( fetchedChannel.defaultAutoArchiveDuration != null ) { announcementString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_DEFAULT_THREAD_AUTO_HIDE')} ${fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.OneHour ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_HOUR') : fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.OneDay ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_DAY') : fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.ThreeDays ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_THREE_DAYS') : localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_WEEK')}` }
            if ( fetchedChannel.rateLimitPerUser != null) { announcementString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_MESSAGE_SLOWMODE')} ${fetchedChannel.rateLimitPerUser} ${localize(slashCommand.locale, 'SECONDS')}`; }

            EmbedChannel.addFields({
                name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_ANNOUNCEMENT_INFO'),
                value: announcementString
            });
        }

        // Stage Channel
        if ( fetchedChannel instanceof StageChannel )
        {
            let stageString = `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_AUDIO_BITRATE')} ${Math.floor(fetchedChannel.bitrate / 1000)}${localize(slashCommand.locale, 'KBPS')}`;

            stageString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_STAGE_FULL')} ${fetchedChannel.full ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;
            stageString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_CONNECTED_MEMBERS')} ${fetchedChannel.members.size}`;
            stageString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_STAGE_LIMIT')} ${fetchedChannel.userLimit === 0 ? localize(slashCommand.locale, 'NO_LIMIT') : `${fetchedChannel.userLimit}`}`;

            EmbedChannel.addFields({
                name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_STAGE_INFO'),
                value: stageString
            });

            if ( fetchedChannel.stageInstance !== null )
            {
                let stageInstanceString = ``;

                stageInstanceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_STAGE_LIVE_STARTED')} <t:${Math.floor(fetchedChannel.stageInstance.createdAt.getTime() / 1000)}:R>`;
                stageInstanceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_STAGE_EVENT_CONNECTION')} ${fetchedChannel.stageInstance.guildScheduledEventId != null ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;
                if ( fetchedChannel.topic != null ) { stageInstanceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_STAGE_TOPIC')} ${fetchedChannel.topic}`; }

                EmbedChannel.addFields({
                    name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_LIVE_STAGE_INFO'),
                    value: stageInstanceString
                });
            }
        }

        // Text Channel
        if ( fetchedChannel instanceof TextChannel )
        {
            let textString = `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_NSFW')} ${fetchedChannel.nsfw ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;

            if ( fetchedChannel.defaultAutoArchiveDuration != null ) { textString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_DEFAULT_THREAD_AUTO_HIDE')} ${fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.OneHour ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_HOUR') : fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.OneDay ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_DAY') : fetchedChannel.defaultAutoArchiveDuration === ThreadAutoArchiveDuration.ThreeDays ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_THREE_DAYS') : localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_WEEK')}` }
            if ( fetchedChannel.rateLimitPerUser != null ) { textString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_MESSAGE_SLOWMODE')} ${fetchedChannel.rateLimitPerUser} ${localize(slashCommand.locale, 'SECONDS')}`; }

            EmbedChannel.addFields({
                name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_TEXT_INFO'),
                value: textString
            });
        }

        // Thread Channel (Any type of Thread)
        if ( fetchedChannel instanceof ThreadChannel )
        {
            let threadString = `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_CREATOR')} <@${fetchedChannel.ownerId}>`;
            let forumPostString = `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_APPLIED_TAGS')} ${fetchedChannel.appliedTags.length}`;

            if ( fetchedChannel.archived != null ) { threadString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_CLOSED')} ${fetchedChannel.archived ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`; }
            if ( fetchedChannel.locked != null ) { threadString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_LOCKED')} ${fetchedChannel.locked ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`; }
            if ( fetchedChannel.autoArchiveDuration != null ) { threadString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_AUTO_HIDE_DURATION')} ${fetchedChannel.autoArchiveDuration === ThreadAutoArchiveDuration.OneHour ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_HOUR') : fetchedChannel.autoArchiveDuration === ThreadAutoArchiveDuration.OneDay ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_DAY') : fetchedChannel.autoArchiveDuration === ThreadAutoArchiveDuration.ThreeDays ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_THREE_DAYS') : localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_WEEK')}`; }
            if ( fetchedChannel.invitable != null && fetchedChannel.parent.type !== ChannelType.GuildForum ) { threadString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_INVITABLE')} ${fetchedChannel.invitable ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`; }
            if ( fetchedChannel.rateLimitPerUser != null ) { threadString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_MESSAGE_SLOWMODE')} ${fetchedChannel.rateLimitPerUser} ${localize(slashCommand.locale, 'SECONDS')}`; }

            forumPostString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_PINNED')} ${fetchedChannel.flags.has(ChannelFlags.Pinned) ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;

            EmbedChannel.addFields({
                name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_THREAD_INFO'),
                value: threadString
            });

            if ( fetchedChannel.parent.type === ChannelType.GuildForum ) { EmbedChannel.addFields({ name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_POST_INFO'), value: forumPostString }); }
        }

        // Voice Channel
        if ( fetchedChannel instanceof VoiceChannel )
        {
            let voiceString = `${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_AUDIO_BITRATE')} ${Math.floor(fetchedChannel.bitrate / 1000)}${localize(slashCommand.locale, 'KBPS')}`;

            if ( fetchedChannel.videoQualityMode != null ) { voiceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_VIDEO_QUALITY_MODE')} ${fetchedChannel.videoQualityMode === VideoQualityMode.Auto ? localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_VIDEO_QUALITY_AUTOMATIC') : localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_VIDEO_QUALITY_720')}`; }
            if ( fetchedChannel.rateLimitPerUser != null ) { voiceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_MESSAGE_SLOWMODE')} ${fetchedChannel.rateLimitPerUser} ${localize(slashCommand.locale, 'SECONDS')}`; }
            voiceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_VOICE_FULL')} ${fetchedChannel.full ? localize(slashCommand.locale, 'TRUE_LOWERCASE') : localize(slashCommand.locale, 'FALSE_LOWERCASE')}`;
            voiceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_CONNECTED_MEMBERS')} ${fetchedChannel.members.size}`;
            voiceString += `\n${localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_VOICE_LIMIT')} ${fetchedChannel.userLimit === 0 ? localize(slashCommand.locale, 'NO_LIMIT') : `${fetchedChannel.userLimit}`}`;

            EmbedChannel.addFields({
                name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_VOICE_INFO'),
                value: voiceString
            });
        }



        // General Channel Flags, excluding ones already included above
        let channelFlagArray = [];
        if ( fetchedChannel.flags.has(ChannelFlags.ClydeAI) ) { channelFlagArray.push(localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FLAG_CLYDE')); }
        if ( fetchedChannel.flags.has(ChannelFlags.IsGuildResourceChannel) ) { channelFlagArray.push(localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FLAG_RESOURCE')); }
        if ( fetchedChannel.flags.has(ChannelFlags.IsScheduledForDeletion) ) { channelFlagArray.push(localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FLAG_SCHEDULED_DELETION')); }
        if ( fetchedChannel.flags.has(ChannelFlags.IsSpam) ) { channelFlagArray.push(localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FLAG_SPAM')); }

        if ( channelFlagArray.length > 0 ) { EmbedChannel.addFields({ name: localize(slashCommand.locale, 'INFO_COMMAND_CHANNEL_FLAG_INFO'), value: channelFlagArray.join(", ") }); }


        await slashCommand.editReply({ embeds: [EmbedChannel] });
        return;
    },



    /**
     * Fetches and Displays the current Server Information
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchServerInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });
        
        // Fetch Guild
        const CurrentGuild = await slashCommand.guild.fetch();

        // If outage happening, return early
        if ( !CurrentGuild.available ) { return await slashCommand.editReply({ content: localize(slashCommand, 'INFO_COMMAND_SERVER_ERROR_OUTAGE') }); }

        // Check for External Emoji Permission
        const ExternalEmojiPermission = checkEmojiPermission(slashCommand);

        // Guild Information
        const GuildId = CurrentGuild.id;
        const GuildName = CurrentGuild.name;
        const GuildDescription = ( CurrentGuild.description || " " );
        const GuildOwner = await CurrentGuild.fetchOwner();
        const GuildPartnered = CurrentGuild.partnered;
        const GuildVerified = CurrentGuild.verified;
        const GuildBoostTier = CurrentGuild.premiumTier;
        const GuildBoostCount = CurrentGuild.premiumSubscriptionCount;
        const GuildVanityCode = ( CurrentGuild.vanityURLCode || null );

        // Member Counts
        const GuildApproxTotalMembers = ( CurrentGuild.approximateMemberCount || null );
        const GuildApproxOnlineMembers = ( CurrentGuild.approximatePresenceCount || null );

        // Security & Moderation
        const GuildVerificationLevel = CurrentGuild.verificationLevel;
        const GuildContentFilter = CurrentGuild.explicitContentFilter;
        const GuildDefaultNotifications = CurrentGuild.defaultMessageNotifications;
        const GuildMFALevel = CurrentGuild.mfaLevel;
        const GuildNSFWLevel = CurrentGuild.nsfwLevel;

        // Server Features
        let rawData = await DiscordClient.rest.get(Routes.guild(GuildId));
        /** @type {Array<String>} */
        const RawFeatures = rawData["features"];
        let guildFeatures = [];
        RawFeatures.forEach(feature => guildFeatures.push(titleCaseGuildFeature(feature)));

        // Channel Information
        const GuildChannels = await CurrentGuild.channels.fetch();
        const TotalChannelCount = GuildChannels.size;
        let textChannelCount = 0;
        let voiceChannelCount = 0;
        let stageChannelCount = 0;
        let announcementChannelCount = 0;
        let categoryChannelCount = 0;
        let forumChannelCount = 0;
        let unknownChannelCount = 0;
        GuildChannels.forEach(channel => {
            if ( channel instanceof TextChannel ) { textChannelCount += 1; }
            else if ( channel instanceof VoiceChannel ) { voiceChannelCount += 1; }
            else if ( channel instanceof StageChannel ) { stageChannelCount += 1; }
            else if ( channel instanceof NewsChannel ) { announcementChannelCount += 1; }
            else if ( channel instanceof CategoryChannel ) { categoryChannelCount += 1; }
            else if ( channel instanceof ForumChannel ) { forumChannelCount += 1; }
            else { unknownChannelCount += 1; }
        });
        // Special Channels
        const AfkChannelId = ( CurrentGuild.afkChannelId || null );
        const RulesChannelId = ( CurrentGuild.rulesChannelId || null );
        const SystemChannelId = ( CurrentGuild.systemChannelId || null );

        // Role Information
        const GuildRoles = await CurrentGuild.roles.fetch();
        const TotalRoleCount = GuildRoles.size - 1; // Subtract one because atEveryone doesn't technically count? At least not towards the 250 limit anyways

        // Emojis & Sticker Information
        const GuildEmojis = await CurrentGuild.emojis.fetch();
        const GuildStickers = await CurrentGuild.stickers.fetch();
        const TotalEmojiCount = GuildEmojis.size;
        const TotalStickerCount = GuildStickers.size;

        // Scheduled Events
        const GuildScheduledEvents = await CurrentGuild.scheduledEvents.fetch();
        const TotalScheduledEvents = GuildScheduledEvents.size;

        // Assets
        const HasBanner = CurrentGuild.banner === null ? false : true;
        const HasIcon = CurrentGuild.icon === null ? false : true;
        const HasDiscoverySplash = CurrentGuild.discoverySplash === null ? false : true;
        const HasInviteSplash = CurrentGuild.splash === null ? false : true;

        // Construct Embed
        const ServerInfoEmbed = new EmbedBuilder().setAuthor({ name: GuildName }).setFooter({ text: localize(slashCommand, 'CREATED') }).setTimestamp(CurrentGuild.createdAt);

        ServerInfoEmbed.setDescription(`${GuildPartnered ? `${ExternalEmojiPermission ? `${EMOJI_PARTNER} ` : `${localize(slashCommand, 'INFO_COMMAND_SERVER_PARTNERED')}. `}` : ""} ${GuildVerified ? `${ExternalEmojiPermission ? `${EMOJI_VERIFIED}` : `${localize(slashCommand, 'INFO_COMMAND_SERVER_VERIFIED')}`}` : ""}\n${GuildDescription}`)
        .addFields(
            {
                name: localize(slashCommand, 'INFO_COMMAND_SERVER_GENERAL_INFO'),
                value: `${ExternalEmojiPermission ? `${EMOJI_OWNER_CROWN} ` : ""}${localize(slashCommand, 'INFO_COMMAND_SERVER_OWNER')} ${fetchDisplayName(GuildOwner.user, true)}
${ExternalEmojiPermission ? `${readableGuildPremiumTierEmoji(GuildBoostTier)} ` : ""}${INFO_COMMAND_SERVER_BOOST_TIER} ${readableGuildPremiumTier(GuildBoostTier, slashCommand.locale)}
${ExternalEmojiPermission ? `${EMOJI_BOOST} ` : ""}${localize(slashCommand, 'INFO_COMMAND_SERVER_BOOST_COUNT')} ${GuildBoostCount}
${ExternalEmojiPermission ? `${EMOJI_EMOJI} ` : ""}${localize(slashCommand, 'INFO_COMMAND_SERVER_EMOJIS')} ${TotalEmojiCount}
${ExternalEmojiPermission ? `${EMOJI_STICKER} ` : ""}${localize(slashCommand, 'INFO_COMMAND_SERVER_STICKERS')} ${TotalStickerCount}
${ExternalEmojiPermission ? `${EMOJI_ROLE} ` : ""}${localize(slashCommand, 'INFO_COMMAND_SERVER_ROLES')} ${TotalRoleCount} / 250${TotalScheduledEvents > 0 ? `\n${ExternalEmojiPermission ? `${EMOJI_SCHEDULED_EVENT} ` : ""}${localize(slashCommand, 'INFO_COMMAND_SERVER_SCHEDULED_EVENTS')} ${TotalScheduledEvents}` : ""}${GuildVanityCode != null ? `\n${localize(slashCommand, 'INFO_COMMAND_SERVER_VANITY')} https://discord.gg/${GuildVanityCode}` : ""}${GuildApproxTotalMembers != null ? `\n${localize(slashCommand, 'INFO_COMMAND_SERVER_APPROX_TOTAL_MEMBERS')} ${GuildApproxTotalMembers}` : ""}${GuildApproxOnlineMembers != null ? `\n${localize(slashCommand, 'INFO_COMMAND_SERVER_APPROX_ONLINE_MEMBERS')} ${GuildApproxOnlineMembers}` : ""}`,
                inline: true
            },
            {
                 name: `${localize(slashCommand, 'INFO_COMMAND_SERVER_CHANNEL_INFO')} (${TotalChannelCount} / 500)`,
                value: `${ExternalEmojiPermission ? `${EMOJI_CHANNEL_TEXT} ` : ""}**${localize(slashCommand, 'CHANNEL_TYPE_TEXT')}:** ${textChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_NEWS} ` : ""}**${localize(slashCommand, 'CHANNEL_TYPE_ANNOUNCEMENT')}:** ${announcementChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_VOICE} ` : ""}**${localize(slashCommand, 'CHANNEL_TYPE_VOICE')}:** ${voiceChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_STAGE} ` : ""}**${localize(slashCommand, 'CHANNEL_TYPE_STAGE')}:** ${stageChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_CATEGORY} ` : ""}**${localize(slashCommand, 'CHANNEL_TYPE_CATEGORY')}:** ${categoryChannelCount}
${ExternalEmojiPermission ? `${EMOJI_CHANNEL_FORUM} ` : ""}**${localize(slashCommand, 'CHANNEL_TYPE_FORUM')}:** ${forumChannelCount}${unknownChannelCount > 0 ? `\n${ExternalEmojiPermission ? `❓ ` : ""}**${localize(slashCommand, 'CHANNEL_TYPE_UNKNOWN')}:** ${unknownChannelCount}` : ""}${AfkChannelId != null ? `\n${ExternalEmojiPermission ? `${EMOJI_STATUS_IDLE} ` : ""}**${localize(slashCommand, 'CHANNEL_AFK')}:** <#${AfkChannelId}>` : ""}${SystemChannelId != null ? `\n${ExternalEmojiPermission ? `:gear: ` : ""}**${localize(slashCommand, 'CHANNEL_SYSTEM')}:** <#${SystemChannelId}>` : ""}${RulesChannelId != null ? `\n${ExternalEmojiPermission ? `${EMOJI_CHANNEL_RULES} ` : ""}**${localize(slashCommand, 'CHANNEL_RULES')}:** <#${RulesChannelId}>` : ""}`,
                inline: true
            },
            {
                name: localize(slashCommand, 'INFO_COMMAND_SERVER_SECURITY_INFO'),
                value: `${localize(slashCommand, 'INFO_COMMAND_SERVER_VERIFICATION_LEVEL')} ${readableVerificationLevel(GuildVerificationLevel, slashCommand.locale)}
${localize(slashCommand, 'INFO_COMMAND_SERVER_EXPLICIT_FILTER')} ${readableExplicitFilter(GuildContentFilter, slashCommand.locale)}
${localize(slashCommand, 'INFO_COMMAND_SERVER_MFA_MODERATION')} ${readableMFALevel(GuildMFALevel, slashCommand.locale)}
${localize(slashCommand, 'INFO_COMMAND_SERVER_NSFW_LEVEL')} ${readableNSFWLevel(GuildNSFWLevel, slashCommand.locale)}
${localize(slashCommand, 'INFO_COMMAND_SERVER_DEFAULT_NOTIFICATIONS')} ${readableDefaultNotification(GuildDefaultNotifications, slashCommand.locale)}`
            }
        );
        if ( guildFeatures.length > 0 ) { ServerInfoEmbed.addFields({name: localize(slashCommand, 'INFO_COMMAND_SERVER_FEATURE_FLAG_INFO'), value: `${guildFeatures.sort().join(', ').slice(0, 1023)}`}); }

        // Add Asset Buttons
        const ServerInfoActionRow = new ActionRowBuilder();
        if ( HasIcon )
        {
            ServerInfoEmbed.setAuthor({ name: GuildName, iconURL: CurrentGuild.iconURL({ extension: 'png' }) });
            ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_SERVER_BUTTON_ICON')).setURL(CurrentGuild.iconURL()));
        }
        if ( HasBanner ) { ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_SERVER_BUTTON_BANNER')).setURL(CurrentGuild.bannerURL())); }
        if ( HasInviteSplash ) { ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_SERVER_BUTTON_INVITE_SPLASH')).setURL(CurrentGuild.splashURL())); }
        if ( HasDiscoverySplash ) { ServerInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_SERVER_BUTTON_DISCOVERY_SPLASH')).setURL(CurrentGuild.discoverySplashURL())); }

        if ( ServerInfoActionRow.components.length > 0 ) { return await slashCommand.editReply({ embeds: [ServerInfoEmbed], components: [ServerInfoActionRow] }); }
        else { return await slashCommand.editReply({ embeds: [ServerInfoEmbed] }); }
    },
    


    /**
     * Fetches and Displays information about the selected Role
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchRoleInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Grab Information
        /** @type {Role} */
        const RoleOption = slashCommand.options.getRole("role");
        //const ExternalEmojiPermission = checkEmojiPermission(slashCommand);

        // If atEveryone is selected, reject!
        if ( RoleOption.id === slashCommand.guildId )
        {
            await slashCommand.editReply({ content: localize(slashCommand, 'INFO_COMMAND_ROLE_ERROR_ATEVERYONE_UNSUPPORTED'), allowedMentions: { parse: [] } });
            return;
        }

        // Embed
        const RoleInfoEmbed = new EmbedBuilder().setAuthor({ name: RoleOption.name }).setColor(RoleOption.hexColor)
        .addFields(
            {
                name: localize(slashCommand, 'INFO_COMMAND_ROLE_GENERAL_INFO'),
                value: `${localize(slashCommand, 'INFO_COMMAND_ROLE_CREATED')} <t:${Math.floor(RoleOption.createdAt.getTime() / 1000)}:R>
${localize(slashCommand, 'INFO_COMMAND_ROLE_COLOR')} ${RoleOption.hexColor}
${localize(slashCommand, 'INFO_COMMAND_ROLE_HOISTED')} ${RoleOption.hoist ? localize(slashCommand, 'TRUE_LOWERCASE') : localize(slashCommand, 'FALSE_LOWERCASE')}
${localize(slashCommand, 'INFO_COMMAND_ROLE_MANAGED')} ${RoleOption.managed ? localize(slashCommand, 'TRUE_LOWERCASE') : localize(slashCommand, 'FALSE_LOWERCASE')}
${localize(slashCommand, 'INFO_COMMAND_ROLE_MEMBERS')} ${RoleOption.members.size}${RoleOption.unicodeEmoji != null ? `\n${localize(slashCommand, 'INFO_COMMAND_ROLE_ICON')} ${RoleOption.unicodeEmoji}` : ""}`
            }
        );

        // Check for Role Icon (Custom image version)
        if ( RoleOption.icon instanceof String )
        {
            RoleInfoEmbed.setAuthor({ iconURL: RoleOption.iconURL({ extension: 'png' }), name: RoleOption.name });
        }

        // Role Tags (if any)
        if ( RoleOption.tags != null )
        {
            let roleTagString = ``;
            if ( RoleOption.tags.botId != undefined ) { roleTagString += `${localize(slashCommand, 'INFO_COMMAND_ROLE_BOT')} <@${RoleOption.tags.botId}>`; }
            if ( RoleOption.tags.integrationId != undefined )
            {
                // Fetch Integrations so we can name it since they aren't mentionable
                await slashCommand.guild.fetchIntegrations()
                .then(async Integrations => {
                    roleTagString += `${roleTagString.length > 4 ? `\n` : ""}${localize(slashCommand, 'INFO_COMMAND_ROLE_INTEGRATION')} ${Integrations.get(RoleOption.tags.integrationId).name}`;
                });
            }
            if ( RoleOption.tags.premiumSubscriberRole != undefined ) { roleTagString += `${roleTagString.length > 4 ? `\n` : ""}${localize(slashCommand, 'INFO_COMMAND_ROLE_SERVER_BOOST')} ${RoleOption.tags.premiumSubscriberRole === true ? localize(slashCommand, 'TRUE_LOWERCASE') : localize(slashCommand, 'FALSE_LOWERCASE')}`; }
            if ( RoleOption.tags.subscriptionListingId != undefined ) { roleTagString += `${roleTagString.length > 4 ? `\n` : ""}${localize(slashCommand, 'INFO_COMMAND_ROLE_MONETIZATION')} ${localize(slashCommand, 'TRUE_LOWERCASE')}`; }
            if ( RoleOption.tags.availableForPurchase != undefined ) { roleTagString += `${roleTagString.length > 4 ? `\n` : ""}${localize(slashCommand, 'INFO_COMMAND_ROLE_PURCHASABLE')} ${localize(slashCommand, 'TRUE_LOWERCASE')}`; }
            if ( RoleOption.tags.guildConnections != undefined ) { roleTagString += `${roleTagString.length > 4 ? `\n` : ""}${localize(slashCommand, 'INFO_COMMAND_ROLE_LINKED_CONNECTION')} ${localize(slashCommand, 'TRUE_LOWERCASE')}`; }

            if ( roleTagString.length > 4 ) { RoleInfoEmbed.addFields({ name: `${localize(slashCommand, 'INFO_COMMAND_ROLE_TAG_INFO')}`, value: roleTagString }); }
        }


        // Role Flags (if any)
        let roleFlagString = "";
        if ( RoleOption.flags.has(RoleFlags.InPrompt) ) { roleFlagString += `${localize(slashCommand, 'INFO_COMMAND_ROLE_FLAG_PROMPT')}`; }

        if ( roleFlagString.length > 4 ) { RoleInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_ROLE_FLAG_INFO'), value: roleFlagString }); }


        // ACK to User
        await slashCommand.editReply({ embeds: [RoleInfoEmbed] });
        return;
    },



    /**
     * Fetches and Displays information about the triggering or targeted User
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchUserInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Fetch Member, be it User of Command or Target from input
        /** @type {GuildMember} */
        let fetchedMember;
        const MemberOption = slashCommand.options.getMember("user");
        if ( !MemberOption || MemberOption == null ) { fetchedMember = await slashCommand.guild.members.fetch(slashCommand.user.id); }
        else { fetchedMember = await slashCommand.guild.members.fetch(MemberOption.id).catch(async err => { return await slashCommand.editReply({ content: localize(slashCommand, 'INFO_COMMAND_USER_ERROR_NOT_IN_GUILD') }); }); }

        // Check for External Emoji Permission
        const ExternalEmojiPermission = checkEmojiPermission(slashCommand);

        // Grab Data
        // Member Information
        const MemberUser = fetchedMember.user;
        // Force-fetch User, to ensure up-to-date fields
        await MemberUser.fetch(true);
        // Check if standard User or Bot User
        const IsBot = fetchedMember.user.bot;
        const MemberDisplayName = ( fetchedMember.displayName || null );
        const MemberDisplayColorHex = fetchedMember.displayHexColor;
        const MemberJoinedTime = ( fetchedMember.joinedAt || null );
        const MemberHighestRole = fetchedMember.roles.highest.id === slashCommand.guildId ? "@everyone" : fetchedMember.roles.highest;
        const MemberRoleCount = fetchedMember.roles.cache.filter(role => role.id !== fetchedMember.guild.id).size;
        const MemberTimedOut = ( fetchedMember.communicationDisabledUntil || null );

        // Assets
        const HasMemberAvatar = fetchedMember.avatar == null ? false : true;
        const HasGlobalAvatar = MemberUser?.avatar == null ? false : true;
        const HasGlobalBanner = MemberUser?.banner == null ? false : true;
        const HasAvatarDecoration = MemberUser?.avatarDecoration == null ? false : true;

        // User Flags
        const RawUserFlags = await MemberUser.fetchFlags(true);
        const UserFlagStrings = [];
        let userFlagEmojis = [];
        RawUserFlags.toArray().forEach(flag => UserFlagStrings.push(readableUserFlags(flag, slashCommand.locale)));
        RawUserFlags.toArray().forEach(flag => userFlagEmojis.push(readableUserFlagsEmoji(flag)));
        // Filter out badgeless flags
        userFlagEmojis = userFlagEmojis.filter(emojiString => emojiString !== "NULL");


        // GuildMember Flags
        /** @type {Array<String>} */
        const MemberFlagStrings = [];
        if ( fetchedMember.flags.has(GuildMemberFlags.DidRejoin) ) { MemberFlagStrings.push(localize(slashCommand, 'INFO_COMMAND_MEMBER_FLAG_REJOIN')); }
        if ( fetchedMember.flags.has(GuildMemberFlags.StartedOnboarding) ) { MemberFlagStrings.push(localize(slashCommand, 'INFO_COMMAND_MEMBER_FLAG_ONBOARDING_STARTED')); }
        if ( fetchedMember.flags.has(GuildMemberFlags.CompletedOnboarding) ) { MemberFlagStrings.push(localize(slashCommand, 'INFO_COMMAND_MEMBER_FLAG_ONBOARDING_COMPLETED')); }
        if ( fetchedMember.flags.has(GuildMemberFlags.AutomodQuarantinedBio) ) { MemberFlagStrings.push(localize(slashCommand, 'INFO_COMMAND_MEMBER_FLAG_AUTOMOD_QUARANTIED_BIO')); }
        if ( fetchedMember.flags.has(GuildMemberFlags.AutomodQuarantinedUsernameOrGuildNickname) ) { MemberFlagStrings.push(localize(slashCommand, 'INFO_COMMAND_MEMBER_FLAG_AUTOMOD_QUARANTIED_NAME')); }
        if ( fetchedMember.flags.has(GuildMemberFlags.StartedHomeActions) ) { MemberFlagStrings.push(localize(slashCommand, 'INFO_COMMAND_MEMBER_FLAG_GUIDE_TODO_STARTED')); }
        if ( fetchedMember.flags.has(GuildMemberFlags.CompletedHomeActions) ) { MemberFlagStrings.push(localize(slashCommand, 'INFO_COMMAND_MEMBER_FLAG_GUIDE_TODO_COMPLETED')); }

        const UserInfoEmbed = new EmbedBuilder().setAuthor({ iconURL: fetchedMember.displayAvatarURL({ extension: 'png' }), name: `${fetchDisplayName(fetchedMember, true)}` })
        .setColor(MemberDisplayColorHex);

        
        // IF NOT A BOT
        if ( !IsBot )
        {
            const MemberPending = ( fetchedMember.pending || null );
            const MemberStartedBoosting = ( fetchedMember.premiumSince || null );

            // Construct strings for Embed
            // Member Info
            let memberInformationString = "";
            if ( MemberUser.id === slashCommand.guild.ownerId ) { memberInformationString += `${ExternalEmojiPermission ? `${EMOJI_OWNER_CROWN} `: ""}${localize(slashCommand, 'INFO_COMMAND_USER_SERVER_OWNER')} ${localize(slashCommand, 'TRUE_LOWERCASE')}`; }
            if ( MemberDisplayName != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${localize(slashCommand, 'INFO_COMMAND_USER_DISPLAY_NAME')} \`${MemberDisplayName}\``; }
            if ( MemberJoinedTime != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${localize(slashCommand, 'INFO_COMMAND_USER_JOINED_SERVER')} <t:${Math.floor(MemberJoinedTime.getTime() / 1000)}:R>`; }
            if ( MemberHighestRole != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${localize(slashCommand, 'INFO_COMMAND_USER_HIGHEST_ROLE')} ${MemberHighestRole === "@everyone" ? "@everyone" : `<@&${MemberHighestRole.id}>`}`; }
            if ( MemberRoleCount > 0 ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_ROLE} ` : ""}${localize(slashCommand, 'INFO_COMMAND_USER_ROLE_COUNT')} ${MemberRoleCount}`; }
            if ( MemberStartedBoosting != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_BOOST} ` : ""}${localize(slashCommand, 'INFO_COMMAND_USER_BOOSTING_SERVER')} <t:${Math.floor(MemberStartedBoosting.getTime() / 1000)}:R>`; }
            if ( MemberPending === true ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_MEMBERSHIP_GATING} ` : ""}${localize(slashCommand, 'INFO_COMMAND_USER_PENDING')}`; }
            if ( MemberTimedOut != null && MemberTimedOut.getTime() > Date.now() ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_TIMEOUT} ` : ""}${localize(slashCommand, 'INFO_COMMAND_USER_TIMED_OUT', `<t:${Math.floor(MemberTimedOut.getTime() / 1000)}:R>`)}`; }
            if ( memberInformationString.length > 1 ) { UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_MEMBER_INFO'), value: memberInformationString }); }

            // User Info
            let userInformationString = `${localize(slashCommand, 'INFO_COMMAND_USER_MENTION')} <@${MemberUser.id}>
${localize(slashCommand, 'INFO_COMMAND_USER_CREATED')} <t:${Math.floor(MemberUser.createdAt.getTime() / 1000)}:R>
${localize(slashCommand, 'INFO_COMMAND_USER_BOT')} ${MemberUser.id === "156482326887530498" ? `👀` : `${MemberUser.bot ? localize(slashCommand, 'TRUE_LOWERCASE') : localize(slashCommand, 'FALSE_LOWERCASE')}`}`;
            UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_USER_INFO'), value: userInformationString });

            // User Flags
            if ( UserFlagStrings.length > 0 ) { UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_USER_FLAGS'), value: UserFlagStrings.sort().join(', ').slice(0, 1023) }); }
            if ( userFlagEmojis.length > 0 && ExternalEmojiPermission ) { UserInfoEmbed.setDescription(userFlagEmojis.join(" ")); }

            // Member Flags
            if ( MemberFlagStrings.length > 0 ) { UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_MEMBER_FLAGS'), value: MemberFlagStrings.join(', ').slice(0, 1023) }); }

            // Asset Buttons
            const UserInfoActionRow = new ActionRowBuilder();
            if ( MemberRoleCount > 0 ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`info-user-role_${MemberUser.id}`).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_ROLES')).setEmoji(EMOJI_ROLE)); }
            if ( HasMemberAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_MEMBER_AVATAR')).setURL(fetchedMember.avatarURL())); }
            if ( HasGlobalAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_GLOBAL_AVATAR')).setURL(MemberUser.avatarURL())); }
            if ( HasGlobalBanner ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_GLOBAL_BANNER')).setURL(MemberUser.bannerURL())); }
            if ( HasAvatarDecoration ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_AVATAR_DECORATION')).setURL(MemberUser.avatarDecorationURL())); }

            // Send Embed and Buttons
            return await slashCommand.editReply({ embeds: [UserInfoEmbed], components: [UserInfoActionRow] });
        }
        // IS A BOT
        else
        {
            // Fetch specific Bot-related Information
            const BotApplicationFlags = MemberUser.client.application.flags.toArray();
            let botApplicationFlagStrings = [];
            let botIntentFlagStrings = [];
            BotApplicationFlags.forEach(flag => {
                if ( BotIntentFlags.includes(flag) ) { botIntentFlagStrings.push(readableApplicationFlags(flag, slashCommand.locale)); }
                else { botApplicationFlagStrings.push(readableApplicationFlags(flag, slashCommand.locale)); }
            });
            const BotRequiresCodeGrant = ( MemberUser.client.application.botRequireCodeGrant || null );
            const BotPubliclyInvitable = ( MemberUser.client.application.botPublic || null );

            // Construct strings for Embed
            // Member Info
            let memberInformationString = "";
            if ( MemberUser.id === slashCommand.guild.ownerId ) { memberInformationString += `${ExternalEmojiPermission ? `${EMOJI_OWNER_CROWN} `: ""}${localize(slashCommand, 'INFO_COMMAND_USER_SERVER_OWNER')} ${localize(slashCommand, 'TRUE_LOWERCASE')}`; }
            if ( MemberDisplayName != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${localize(slashCommand, 'INFO_COMMAND_USER_DISPLAY_NAME')} \`${MemberDisplayName}\``; }
            if ( MemberJoinedTime != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${localize(slashCommand, 'INFO_COMMAND_USER_JOINED_SERVER')} <t:${Math.floor(MemberJoinedTime.getTime() / 1000)}:R>`; }
            if ( MemberHighestRole != null ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${localize(slashCommand, 'INFO_COMMAND_USER_HIGHEST_ROLE')} ${MemberHighestRole === "@everyone" ? "@everyone" : `<@&${MemberHighestRole.id}>`}`; }
            if ( MemberRoleCount > 0 ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_ROLE} ` : ""}${localize(slashCommand, 'INFO_COMMAND_USER_ROLE_COUNT')} ${MemberRoleCount}`; }
            if ( MemberTimedOut != null && MemberTimedOut.getTime() > Date.now() ) { memberInformationString += `${memberInformationString.length > 1 ? `\n`: ""}${ExternalEmojiPermission ? `${EMOJI_TIMEOUT} ` : ""}${localize(slashCommand, 'INFO_COMMAND_USER_TIMED_OUT', `<t:${Math.floor(MemberTimedOut.getTime() / 1000)}:R>`)}`; }
            if ( memberInformationString.length > 1 ) { UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_MEMBER_INFO'), value: memberInformationString }); }

            // User Info
            let userInformationString = `${localize(slashCommand, 'INFO_COMMAND_USER_MENTION')} <@${MemberUser.id}>
${localize(slashCommand, 'INFO_COMMAND_USER_CREATED')} <t:${Math.floor(MemberUser.createdAt.getTime() / 1000)}:R>
${localize(slashCommand, 'INFO_COMMAND_USER_BOT')} ${MemberUser.bot ? localize(slashCommand, 'TRUE_LOWERCASE') : localize(slashCommand, 'FALSE_LOWERCASE')}`;
            UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_USER_INFO'), value: userInformationString });

            // Bot-specific Profile Badges!
            if ( botApplicationFlagStrings.includes("Supports Application Commands") ) { userFlagEmojis.unshift(EMOJI_SUPPORTS_APP_COMMANDS); }
            if ( botApplicationFlagStrings.includes("Uses AutoMod API") ) { userFlagEmojis.unshift(EMOJI_USES_AUTOMOD); }

            // Bot Information
            let botInformationString = "";
            if ( userFlagEmojis.length > 0 && ExternalEmojiPermission ) { UserInfoEmbed.setDescription(`${userFlagEmojis.join(" ")}`); }
            if ( BotPubliclyInvitable != null ) { botInformationString += `${localize(slashCommand, 'INFO_COMMAND_USER_BOT_INVITABLE')} ${BotPubliclyInvitable ? localize(slashCommand, 'TRUE_LOWERCASE') : localize(slashCommand, 'FALSE_LOWERCASE')}`; }
            if ( BotRequiresCodeGrant != null ) { botInformationString += `${botInformationString.length > 1 ? `\n` : ""}${localize(slashCommand, 'INFO_COMMAND_USER_BOT_OAUTH')} ${BotRequiresCodeGrant ? localize(slashCommand, 'TRUE_LOWERCASE') : localize(slashCommand, 'FALSE_LOWERCASE')}`; }
            if ( botIntentFlagStrings.length > 0 ) { botInformationString += `${botInformationString.length > 1 ? `\n` : ""}${botIntentFlagStrings.sort().join(`\n`).slice(0, 1023)}`; }
            if ( botInformationString.length > 1 ) { UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_BOT_INFO'), value: botInformationString }); }

            // User Flags
            if ( UserFlagStrings.length > 0 ) { UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_USER_FLAGS'), value: UserFlagStrings.sort().join(', ').slice(0, 1023) }) }
            // Bot Application Flags (that aren't Intents)
            if ( botApplicationFlagStrings.length > 0 ) { UserInfoEmbed.addFields({ name: localize(slashCommand, 'INFO_COMMAND_USER_BOT_FLAGS'), value: botApplicationFlagStrings.sort().join(', ').slice(0, 1023) }); }

            // Asset Buttons
            const UserInfoActionRow = new ActionRowBuilder();
            if ( MemberRoleCount > 0 ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`info-user-role_${MemberUser.id}`).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_ROLES')).setEmoji(EMOJI_ROLE)); }
            if ( HasMemberAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_MEMBER_AVATAR')).setURL(fetchedMember.avatarURL())); }
            if ( HasGlobalAvatar ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_GLOBAL_AVATAR')).setURL(MemberUser.avatarURL())); }
            if ( HasGlobalBanner ) { UserInfoActionRow.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(slashCommand, 'INFO_COMMAND_USER_BUTTON_GLOBAL_BANNER')).setURL(MemberUser.bannerURL())); }

            // Send Embed and Buttons
            return await slashCommand.editReply({ embeds: [UserInfoEmbed], components: [UserInfoActionRow] });
        }
    },



    /**
     * Fetches and Displays information about the given Discord Invite
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchInviteInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Grab given Invite Link
        const InputInviteLink = slashCommand.options.getString("code", true);
        // Check Invite does exist on Discord
        /** @type {Invite} */
        let fetchedInvite = null;
        try { fetchedInvite = await DiscordClient.fetchInvite(InputInviteLink); }
        catch (err) { return await slashCommand.editReply({ content: "Sorry, either that isn't a valid Server Invite, or the Invite doesn't exist on Discord!" }); }

        // Check for External Emoji Permission
        const ExternalEmojiPermission = checkEmojiPermission(slashCommand);


        // GRAB INFORMATION
        // Invite Data
        const InviteCode = fetchedInvite.code;
        const InviteCreatedTime = ( fetchedInvite.createdAt?.getTime() || null );
        const InviteExpireTime = ( fetchedInvite.expiresAt?.getTime() || null );
        const TargetApplication = ( fetchedInvite.targetApplication || null );
        const TargetType = ( fetchedInvite.targetType || null );
        const InviteChannel = ( fetchedInvite.channel || null );
        const InviteGuild = ( fetchedInvite.guild || null );
        const InviteCreatorUser = ( fetchedInvite.inviter || null );


        // Construct Embed
        const InviteInfoEmbed = new EmbedBuilder().setAuthor({ name: `Data for Invite Code: ${InviteCode}` });
        
        // General Invite Info
        let generalInviteInfo = "";
        if ( InviteCreatorUser != null ) { generalInviteInfo += `**Inviter:** ${fetchDisplayName(InviteCreatorUser, true)}\n**Bot User:** ${InviteCreatorUser.bot}`; }
        if ( InviteCreatedTime != null ) { generalInviteInfo += `${generalInviteInfo.length > 1 ? `\n` : ""}**Created:** <t:${Math.floor(InviteCreatedTime / 1000)}:R>`; }
        if ( InviteExpireTime != null ) { generalInviteInfo += `${generalInviteInfo.length > 1 ? `\n` : ""}**Expires:** <t:${Math.floor(InviteExpireTime / 1000)}:R>`; }
        if ( generalInviteInfo.length > 1 ) { InviteInfoEmbed.addFields({ name: `>> General Info`, value: generalInviteInfo }); }
        
        // Invite Target Info
        let targetInviteInfo = "";
        if ( InviteChannel != null ) { targetInviteInfo += `**Channel Type:** ${readableChannelType(InviteChannel.type, slashCommand.locale)}\n**Channel Name:** ${InviteChannel.name}`; }
        if ( TargetType != null && TargetType === InviteTargetType.Stream ) { targetInviteInfo += `${targetInviteInfo.length > 1 ? `\n` : ""}**Target Type:** Screenshare`; }
        if ( TargetType != null && TargetType === InviteTargetType.EmbeddedApplication ) { targetInviteInfo += `${targetInviteInfo.length > 1 ? `\n` : ""}**Target Type:** Voice Activity${(TargetApplication != null) && (TargetApplication.name != null) ? `\n**Activity Name:** ${TargetApplication.name}` : ""}`; }
        if ( targetInviteInfo.length > 1 ) { InviteInfoEmbed.addFields({ name: `>> Target Info`, value: targetInviteInfo }); }
        
        // Guild Info
        if ( InviteGuild != null )
        {
            if ( InviteGuild.description != null ) { InviteInfoEmbed.setDescription(InviteGuild.description); }
            if ( InviteGuild.icon != null ) { InviteInfoEmbed.setAuthor({ iconURL: InviteGuild.iconURL({ extension: 'png' }), name: `Data for Invite Code: ${InviteCode}` }); }
            let guildInviteInfo = `**Name:** ${InviteGuild.name}
${ExternalEmojiPermission && InviteGuild.partnered ? `${EMOJI_PARTNER} ` : ""}**Partnered:** ${InviteGuild.partnered}
${ExternalEmojiPermission && InviteGuild.verified ? `${EMOJI_VERIFIED} ` : ""}**Verified:** ${InviteGuild.verified}`;
            if ( InviteGuild.premiumSubscriptionCount != null ) { guildInviteInfo += `\n**Boosts:** ${InviteGuild.premiumSubscriptionCount}` }
            if ( fetchedInvite.memberCount ) { guildInviteInfo += `\n**Approx. Total Members:** ${fetchedInvite.memberCount}`; }
            if ( fetchedInvite.presenceCount ) { guildInviteInfo += `\n**Approx. Online Members:** ${fetchedInvite.presenceCount}`; }
            InviteInfoEmbed.addFields({ name: `>> Server Info`, value: guildInviteInfo });

            // Server Feature Flags, grabbing from raw API to ensure up-to-date data
            let rawData = await DiscordClient.rest.get(Routes.invite(InviteCode));
            const RawFeatures = rawData["guild"]["features"];
            let guildFeatures = [];
            RawFeatures.forEach(feature => guildFeatures.push(titleCaseGuildFeature(feature)));
            if ( guildFeatures.length > 0 ) { InviteInfoEmbed.addFields({ name: `>> Server's Feature Flags`, value: `${guildFeatures.sort().join(', ').slice(0, 1023)}` }); }
        }

        // Construct Invite Button
        const InviteLinkButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Join Server").setURL(`https://discord.gg/${InviteCode}`);
        const InviteInfoActionRow = new ActionRowBuilder().addComponents(InviteLinkButton);

        return await slashCommand.editReply({ embeds: [InviteInfoEmbed], components: [InviteInfoActionRow] });
    },



    /**
     * Fetches and Displays information about this Bot
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async fetchBotInfo(slashCommand)
    {
        // Defer
        await slashCommand.deferReply({ ephemeral: true });

        // Fetch Bot itself to update stuff
        const ApproxServerCount = (await DiscordClient.application.fetch()).approximateGuildCount;

        // Create Link Buttons
        const PrivacyButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Privacy Policy").setURL("https://github.com/TwilightZebby/HeccBot/blob/main/PRIVACY_POLICY.md");
        const LicenseButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("License").setURL("https://github.com/TwilightZebby/license/blob/main/license.md");
        const GitHubButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("GitHub").setURL("https://github.com/TwilightZebby/HeccBot");
        const ChangelogButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Changelog").setURL("https://github.com/TwilightZebby/HeccBot/releases");
        const BotInfoActionRow = new ActionRowBuilder().addComponents([PrivacyButton, LicenseButton, GitHubButton, ChangelogButton]);

        // Fetch App Commands
        const RegisteredGlobalCommands = await DiscordClient.application.commands.fetch();
        const RegisteredGuildCommands = await slashCommand.guild.commands.fetch();
        const TotalRegisteredCommands = RegisteredGlobalCommands.size + RegisteredGuildCommands.size;

        // Construct Embed
        const BotInfoEmbed = new EmbedBuilder()
        .setAuthor({ name: `${DiscordClient.user.username} Information`, iconURL: `${DiscordClient.user.avatarURL({ extension: 'png' })}` })
        .setDescription(`A private general purpose Bot. Has features such as \`/bonk\`, Button Role Menus, and more.`)
        .addFields(
            { name: `Developer`, value: `TwilightZebby`, inline: true },
            { name: `Bot Version`, value: `${Package.version}`, inline: true },
            { name: `Discord.JS Version`, value: `${Package.dependencies['discord.js']}`, inline: true },

            { name: `Global Commands`, value: `${RegisteredGlobalCommands.size}`, inline: true },
            { name: `Server Commands`, value: `${RegisteredGuildCommands.size}`, inline: true },
            { name: `Total App Commands`, value: `${TotalRegisteredCommands}`, inline: true },

            { name: `\u200B`, value: `\u200B`, inline: true },
            { name: `Approx. Server Count`, value: `${ApproxServerCount}`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true }
        );

        return await slashCommand.editReply({ embeds: [BotInfoEmbed], components: [BotInfoActionRow] });
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
