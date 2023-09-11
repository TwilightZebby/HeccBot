module.exports = {
    // ******* GENERIC STUFF
    PLEASE_SELECT_AN_ACTION: `Please select an action`,
    CREATED: `Created`,
    TRUE_LOWERCASE: `true`,
    FALSE_LOWERCASE: `false`,
    NO_LIMIT: `No limit`,
    KBPS: `kbps`,
    SECONDS: `seconds`,



    // ******* GENERIC SLASH COMMAND STUFF
    SLASH_COMMAND_ERROR_GENERIC: `Sorry, but there was a problem trying to run this Slash Command.`,
    SLASH_COMMAND_ERROR_NO_DMS: `Sorry, but this Slash Command __cannot__ be used within DMs (Direct Messages) or Group DMs.`,
    SLASH_COMMAND_ERROR_ONLY_TEXT_CHANNELS: `Sorry, but this Slash Command can only be used inside of Server Text Channels.\n(You used it in {{0}} Channel)`,
    SLASH_COMMAND_ERROR_DISCORD_OUTAGE: `Sorry, but this Command is unusable while there's a Discord Outage affecting your Server. You can check [Discord's Outage Page](https://discordstatus.com) for extra details.`,



    // ******* CHANNEL TYPES
    CHANNEL_TYPE_DM: `Direct Message (DM)`,
    CHANNEL_TYPE_GROUP_DM: `Group DM`,
    CHANNEL_TYPE_CATEGORY: `Category`,
    CHANNEL_TYPE_DIRECTORY: `Directory`,
    CHANNEL_TYPE_FORUM: `Forum`,
    CHANNEL_TYPE_ANNOUNCEMENT: `Announcement`,
    CHANNEL_TYPE_THREAD_ANNOUNCEMENT: `Public Thread (in Announcement)`,
    CHANNEL_TYPE_THREAD_PRIVATE: `Private Thread`,
    CHANNEL_TYPE_THREAD_PUBLIC: `Public Thread`,
    CHANNEL_TYPE_STAGE: `Stage`,
    CHANNEL_TYPE_TEXT: `Text`,
    CHANNEL_TYPE_VOICE: `Voice`,
    CHANNEL_TYPE_MEDIA: `Media`,
    CHANNEL_TYPE_UNKNOWN: `Unknown`,
    // While not Types of Channels, these are specially flagged Channels
    CHANNEL_AFK: `AFK`,
    CHANNEL_SYSTEM: `System`,
    CHANNEL_RULES: `Rules`,



    // ******* FOR ACTION COMMANDS
    ACTION_COMMAND_OTHER_USER_HEADPAT: `**{{0}}** gave **{{1}}** a headpat`,
    ACTION_COMMAND_OTHER_USER_HUG: `**{{0}}** cuddled **{{1}}`,
    ACTION_COMMAND_OTHER_USER_BONK: `**{{0}}** bonked **{{1}}`,
    ACTION_COMMAND_OTHER_USER_BOOP: `**{{0}}** booped **{{1}}`,
    ACTION_COMMAND_OTHER_USER_KISS: `**{{0}}** kissed **{{1}}`,

    ACTION_COMMAND_SELF_USER_HEADPAT: `**{{0}}** gave themself a headpat`,
    ACTION_COMMAND_SELF_USER_HUG: `**{{0}}** gave themself a cuddle`,
    ACTION_COMMAND_SELF_USER_BONK: `**{{0}}** bonked themself`,
    ACTION_COMMAND_SELF_USER_BOOP: `**{{0}}** booped themself`,
    ACTION_COMMAND_SELF_USER_KISS: `**{{0}}** attempted to kiss themself`,

    ACTION_COMMAND_ROLE_HEADPAT: `**{{0}}** gave everyone with **{{1}}** headpats`,
    ACTION_COMMAND_ROLE_HUG: `**{{0}}** gave everyone with **{{1}}** a group hug`,
    ACTION_COMMAND_ROLE_BONK: `**{{0}}** collectively bonked **{{1}}**`,
    ACTION_COMMAND_ROLE_BOOP: `**{{0}}** booped everyone with **{{1}}**`,
    ACTION_COMMAND_ROLE_KISS: `**{{0}}** kissed everyone with **{{1}}**`,

    ACTION_COMMAND_EVERYONE_HEADPAT: `**{{0}}** gave \`@everyone\` a headpat`,
    ACTION_COMMAND_EVERYONE_HUG: `**{{0}}** gave \`@everyone\` a group hug`,
    ACTION_COMMAND_EVERYONE_BONK: `**{{0}}** bonked \`@everyone\``,
    ACTION_COMMAND_EVERYONE_BOOP: `**{{0}}** booped \`@everyone\``,
    ACTION_COMMAND_EVERYONE_KISS: `**{{0}}** gave \`@everyone\` a kiss`,

    ACTION_COMMAND_OTHER_BOTS_HEADPAT: `**{{0}}** gave **{{1}}** a virtual headpat`,
    ACTION_COMMAND_OTHER_BOTS_HUG: `**{{0}}** virtually cuddled **{{1}}**`,
    ACTION_COMMAND_OTHER_BOTS_BONK: `**{{0}}** bonked **{{1}}**'s code`,
    ACTION_COMMAND_OTHER_BOTS_BOOP: `**{{0}}** booped **{{1}}**`,
    ACTION_COMMAND_OTHER_BOTS_KISS: `**{{0}}** sent **{{1}}** a virtual kiss`,

    ACTION_COMMAND_HECCBOT_HEADPAT: `**{{0}}** gave me a headpat <3`,
    ACTION_COMMAND_HECCBOT_HUG: `**{{0}}** cuddled me <3`,
    ACTION_COMMAND_HECCBOT_BONK: `I bonked **{{0}}** in retaliation - nobody attempts to bonk me!`,
    ACTION_COMMAND_HECCBOT_BOOP: `**{{0}}** booped me!`,
    ACTION_COMMAND_HECCBOT_KISS: `**{{0}}** kissed...me? :flushed:`,

    ACTION_COMMAND_MEE6_HEADPAT: `***{{0}}** gave **{{1}}** a headpat...*`,
    ACTION_COMMAND_MEE6_HUG: `***{{0}}** hugged **{{1}}**...*`,
    ACTION_COMMAND_MEE6_BONK: `**{{0}}** bonked **{{1}}**! >:D`,
    ACTION_COMMAND_MEE6_BOOP: `***{{0}}** booped **{{1}}**...*`,
    ACTION_COMMAND_MEE6_KISS: `OK, listen **{{0}}**, **{{1}}** doesn't deserve a kiss.`,

    ACTION_RETURN_HEADPAT: `**{{0}}** gave **{{1}}** a headpat in return!`,
    ACTION_RETURN_HUG: `**{{0}}** cuddled **{{1}}** too!`,
    ACTION_RETURN_BONK: `**{{0}}** bonked **{{1}}** in retaliation!`,
    ACTION_RETURN_BOOP: `**{{0}}** revenge booped **{{1}}**!`,
    ACTION_RETURN_KISS: `**{{0}}** kissed **{{1}}** in return!`,



    // ******* FOR TEMPERATURE STUFF
    TEMPERATURE_COMMAND_INVALID_TEMPERATURE: `:warning: {{0}}{{1}} is a temperature that cannot exist! (It is below Absolute Zero!)`,
    TEMPERATURE_COMMAND_CONVERTED: `{{0}}{{1}} is about {{2}}{{3}} or {{4}}{{5}}`,



    // ******* FOR SOMEONE COMMAND
    SOMEONE_COMMAND_RESPONSE: `\`@someone\` *({{0}})*`,



    // ******* ROLE MENU STUFF
    ROLE_MENU_PREVIEW_EMPTY: `*Role Menu is currently empty. Please use the Select Menu below to configure this Role Menu.*`,
    ROLE_MENU_SET_MENU_TYPE: `Set Menu Type`,
    ROLE_MENU_SET_MENU_TYPE_DESCRIPTION: `Change how this Menu will behave once saved`,
    ROLE_MENU_CANCEL_CREATION: `Cancel Creation`,
    ROLE_MENU_CANCEL_CREATION_DESCRIPTION: `Cancels creation of this Role Menu`,

    ROLE_MENU_CREATE_INTRUCTIONS: `__**Self-Assignable Role Menu Creation**__
Use the Select Menu below to configure this Menu's Type, Embed and Role Buttons. Press an existing Role Button to edit its label and/or emoji.
If including in Buttons, please make sure to have the relevant Emoji IDs ready (such as in a notepad program); as you won't be able to copy from a Discord Message while an Input Form is open.
Additionally, both Custom Discord Emojis, and standard Unicode Emojis, are supported.

An auto-updating preview of what your new Self-Assignable Role Menu will look like is shown below.`,

    ROLE_MENU_ERROR_MISSING_MANAGE_ROLES_PERMISSION: `:warning: I do not seem to have the **Manage Roles** Permission!\nPlease ensure I have been granted it in order for my Self-Assignable Role Module to work.`,
    ROLE_MENU_ERROR_MISSING_SEND_MESSAGES_PERMISSION: `:warning: Sorry, but I cannot create a Role Menu in this Channel without having the **Send Messages** Permission!`,
    ROLE_MENU_ERROR_ACTIVE_CREATION: `Sorry, but there seems to already be an active Role Menu creation happening on this Server right now; either by yourself or someone else.\nPlease either wait for the User to finish creating their Role Menu, or wait for the inactive creation timer to expire (which is about one hour from initial use of this Slash Command).`,



    // ******* POLL STUFF
    POLL_PREVIEW_EMPTY: `*Poll is currently empty. Please use the Select Menu below to configure this Poll.*`,
    POLL_SET_POLL_TYPE: `Set Poll Type`,
    POLL_SET_POLL_TYPE_DESCRIPTION: `Change how this Poll will behave once saved`,
    POLL_CONFIGURE_EMBED: `Configure Embed`,
    POLL_CONFIGURE_EMBED_DESCRIPTION: `Set the Question, Description, and Colour of this Poll`,
    POLL_CANCEL_CREATION: `Cancel Creation`,
    POLL_CANCEL_CREATION_DESCRIPTION: `Cancels creation of this Poll`,

    POLL_CREATE_INTRUCTIONS: `__**Poll Creation**__
Use the Select Menu to configure this Poll's Embed and Buttons. Press an existing Button to edit its label.
    
An auto-updating preview of what your new Poll will look like is shown below.`,

    POLL_ERROR_ACTIVE_CREATION: `Sorry, but there seems to already be an active Poll creation happening on this Server right now; either by yourself or someone else.\nPlease either wait for the User to finish creating their Poll, or wait for the inactive creation timer to expire (which is about one hour from initial use of this Slash Command).`,



    // ******* LOCKEMOJI COMMAND
    LOCKEMOJI_COMMAND_AUDIT_LOG_EMOJI_UPLOADED: `Role-locked Custom Emoji uploaded by {{0}}`,
    LOCKEMOJI_COMMAND_UPLOAD_SUCCESS: `Successfully uploaded your new Role-locked Custom Emoji to this Server.\nYou can rename and/or delete your EMoji, much like others, in Server Settings > Emojis, providing you have the **Manage Expressions** Permission.`,

    LOCKEMOJI_COMMAND_ERROR_MISSING_CREATE_EXPRESSIONS_PERMISSION: `Sorry, but I cannot upload a Custom Emoji to this Server without having the **Create Expressions** Permission.\nPlease try again, once I have been granted that Permission!`,
    LOCKEMOJI_COMMAND_ERROR_INVALID_FILE_TYPE: `Sorry, but that Emoji file wasn't a **PNG** or **GIF** file type.\nPlease try again, ensuring you use either a \`.png\` or \`.gif\` file for your Custom Emoji.`,
    LOCKEMOJI_COMMAND_ERROR_FILE_TOO_LARGE: `Sorry, but that Emoji file is too large to be uploaded as a Custom Emoji.\nDiscord requires Custom Emojis to be smaller than 256kb in file size. Please try again, once you have a smaller file size for your Custom Emoji.`,
    LOCKEMOJI_COMMAND_ERROR_FAILED_UPLOAD: `Sorry, but there was an error trying to upload your Custom Emoji to this Server.\nPreview of the raw error:\n\`\`\`\n{{0}}\`\`\``,



    // ******* INFO COMMAND STUFF - THERE'S A LOT HERE TO PREPARE THYSELF
    INFO_COMMAND_GUILD_VERIFICATION_NONE: `Unrestricted`,
    INFO_COMMAND_GUILD_VERIFICATION_LOW: `Low (Verified Email)`,
    INFO_COMMAND_GUILD_VERIFICATION_MEDIUM: `Medium (Account age >5 minutes)`,
    INFO_COMMAND_GUILD_VERIFICATION_HIGH: `High (Member for >10 minutes)`,
    INFO_COMMAND_GUILD_VERIFICATION_VERY_HIGH: `Highest (Verified Phone Number)`,

    INFO_COMMAND_GUILD_EXPLICIT_FILTER_DISABLED: `Disabled`,
    INFO_COMMAND_GUILD_EXPLICIT_FILTER_ROLELESS: `Only scan roleless Members content`,
    INFO_COMMAND_GUILD_EXPLICIT_FILTER_EVERYONE: `Scan content from everyone`,

    INFO_COMMAND_GUILD_DEFAULT_NOTIFICATION_ALL_MESSAGES: `All Messages`,
    INFO_COMMAND_GUILD_DEFAULT_NOTIFICATION_ONLY_MENTIONS: `Only @mentions`,

    INFO_COMMAND_GUILD_MFA_NONE: `None`,
    INFO_COMMAND_GUILD_MFA_ELEVATED: `Enabled`,

    INFO_COMMAND_GUILD_NSFW_DEFAULT: `Default`,
    INFO_COMMAND_GUILD_NSFW_SAFE: `Safe`,
    INFO_COMMAND_GUILD_NSFW_AGE_RESTRICTED: `Age Restricted`,
    INFO_COMMAND_GUILD_NSFW_EXPLICIT: `Explicit`,

    INFO_COMMAND_GUILD_BOOST_TIER_NONE: `None`,
    INFO_COMMAND_GUILD_BOOST_TIER_ONE: `Tier 1`,
    INFO_COMMAND_GUILD_BOOST_TIER_TWO: `Tier 2`,
    INFO_COMMAND_GUILD_BOOST_TIER_THREE: `Tier 3`,

    INFO_COMMAND_USER_FLAG_ACTIVE_DEVELOPER: `Active Developer`,
    INFO_COMMAND_USER_FLAG_BOT_HTTP_INTERACTIONS: `HTTP Interactions Bot`,
    INFO_COMMAND_USER_FLAG_BUG_HUNTER_TIER_ONE: `Bug Hunter Tier 1`,
    INFO_COMMAND_USER_FLAG_BUG_HUNTER_TIER_TWO: `Bug Hunter Tier 2`,
    INFO_COMMAND_USER_FLAG_CERTIFIED_MODERATOR: `Moderator Programs Alumni`,
    INFO_COMMAND_USER_FLAG_COLLABORATOR: `Collaborator`,
    INFO_COMMAND_USER_FLAG_HYPESQUAD_HOUSE_BRAVERY: `HypeSquad Bravery House`,
    INFO_COMMAND_USER_FLAG_HYPESQUAD_HOUSE_BRILLIANCE: `HypeSquad Brilliance House`,
    INFO_COMMAND_USER_FLAG_HYPESQUAD_HOUSE_BALANCE: `HypeSquad Balance House`,
    INFO_COMMAND_USER_FLAG_HYPESQUAD_EVENTS: `HypeSquad Events`,
    INFO_COMMAND_USER_FLAG_PARTNER: `Partnered Server Owner`,
    INFO_COMMAND_USER_FLAG_EARLY_SUPPORTER: `Early Nitro Supporter`,
    INFO_COMMAND_USER_FLAG_QUARANTINED: `**Quarantined**`,
    INFO_COMMAND_USER_FLAG_RESTRICTED_COLLABORATOR: `Restricted Collaborator`,
    INFO_COMMAND_USER_FLAG_SPAMMER: `**Spammer**`,
    INFO_COMMAND_USER_FLAG_STAFF: `Discord Employee`,
    INFO_COMMAND_USER_FLAG_TEAM_USER: `Team (Pseudo User)`,
    INFO_COMMAND_USER_FLAG_VERIFIED_BOT: `Verified Bot`,
    INFO_COMMAND_USER_FLAG_VERIFIED_BOT_DEVELOPER: `Early Verified Bot Developer`,

    INFO_COMMAND_APPLICATION_FLAG_AUTOMOD_BADGE: `Uses AutoMod API`,
    INFO_COMMAND_APPLICATION_FLAG_APPLICATION_COMMANDS_BADGE: `Supports Application Commands`,
    INFO_COMMAND_APPLICATION_FLAG_EMBEDDED: `Embedded`,
    INFO_COMMAND_APPLICATION_FLAG_EMBEDDED_FIRST_PARTY: `Embedded First Party`,
    INFO_COMMAND_APPLICATION_FLAG_EMBEDDED_IAP: `Embedded IAP (In-App Purchases)`,
    INFO_COMMAND_APPLICATION_FLAG_EMBEDDED_RELEASED: `Embedded Released`,
    INFO_COMMAND_APPLICATION_FLAG_INTENT_GUILD_MEMBERS: `Has Guild Members Intent (Verified)`,
    INFO_COMMAND_APPLICATION_FLAG_INTENT_GUILD_MEMBERS_LIMITED: `Has Guild Members Intent`,
    INFO_COMMAND_APPLICATION_FLAG_INTENT_MESSAGE_CONTENT: `Has Message Content Intent (Verified)`,
    INFO_COMMAND_APPLICATION_FLAG_INTENT_MESSAGE_CONTENT_LIMITED: `Has Message Content Intent`,
    INFO_COMMAND_APPLICATION_FLAG_INTENT_PRESENCE: `Has Presence Intent (Verified)`,
    INFO_COMMAND_APPLICATION_FLAG_INTENT_PRESENCE_LIMITED: `Has Presence Intent`,
    INFO_COMMAND_APPLICATION_FLAG_GROUP_DM_CREATE: `Can create Group DMs`,
    INFO_COMMAND_APPLICATION_FLAG_MANAGED_EMOJI: `Managed Emoji`,
    INFO_COMMAND_APPLICATION_FLAG_RPC_CONNECTED: `RPC has connected`,
    INFO_COMMAND_APPLICATION_FLAG_VERIFICATION_BLOCKED_BY_GROWTH: `Verification blocked by unusual growth`,

    INFO_COMMAND_CHANNEL_DIRECTORY_UNSUPPORTED: `Sorry, but the [Directory Channel](<https://support.discord.com/hc/en-us/articles/4406046651927>) type isn't supported by this Bot!`,
    INFO_COMMAND_CHANNEL_MEDIA_UNSUPPORTED: `Sorry, but the [Media Channel](<https://creator-support.discord.com/hc/en-us/articles/14346342766743>) type isn't currently supported yet by this Bot!`,
    INFO_COMMAND_CHANNEL_DM_UNSUPPORTED: `Sorry, but this Bot cannot be used to fetch information of Direct Messages (DMs) or Group Direct Messages (GDMs)!`,

    INFO_COMMAND_ERROR_CHANNEL_FETCH_FAILED: `Sorry, there was an error trying to fetch information about that Channel.\nI may not have the **View Channels** Permission to be able to see that specified Channel, __or__ something in my code failed.`,

    INFO_COMMAND_CHANNEL_TYPE: `**Channel Type:**`,
    INFO_COMMAND_CHANNEL_MENTION: `**Channel Mention:**`,
    INFO_COMMAND_CHANNEL_PARENT: `**Parent Channel:**`,
    INFO_COMMAND_CHANNEL_CATEGORY_PARENT: `**Parent Category:**`,
    INFO_COMMAND_CHANNEL_CACHED_CHILDREN: `**Cached Child Channels:**`,
    INFO_COMMAND_CHANNEL_NSFW: `**Age-Restricted:**`,
    INFO_COMMAND_CHANNEL_DEFAULT_THREAD_AUTO_HIDE: `**Default Thread Auto-hide Duration:**`,
    INFO_COMMAND_CHANNEL_MESSAGE_SLOWMODE: `**Message Slowmode:**`,
    INFO_COMMAND_CHANNEL_AUDIO_BITRATE: `**Audio Bitrate:**`,
    INFO_COMMAND_CHANNEL_CONNECTED_MEMBERS: `**Cached Connected Members:**`,
    INFO_COMMAND_CHANNEL_VIDEO_QUALITY_MODE: `**Video Quality Mode:**`,

    INFO_COMMAND_CHANNEL_FORUM_DEFAULT_REACTION: `**Has Set Default Reaction:**`,
    INFO_COMMAND_CHANNEL_FORUM_DEFAULT_SORT_ORDER: `**Default Sort Order:**`,
    INFO_COMMAND_CHANNEL_FORUM_SORT_CREATION: `Creation Date`,
    INFO_COMMAND_CHANNEL_FORUM_SORT_ACTIVITY: `Latest Activity`,
    INFO_COMMAND_CHANNEL_FORUM_DEFAULT_AUTO_HIDE: `**Default Post Auto-hide Duration:**`,
    INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_HOUR: `One Hour`,
    INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_DAY: `One Day`,
    INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_THREE_DAYS: `Three Days`,
    INFO_COMMAND_CHANNEL_FORUM_AUTO_HIDE_DURATION_ONE_WEEK: `One Week`,
    INFO_COMMAND_CHANNEL_FORUM_DEFAULT_MESSAGE_SLOWMODE: `**Default Message Slowmode:**`,
    INFO_COMMAND_CHANNEL_FORUM_POST_SLOWMODE: `**Post Creation Slowmode:**`,
    INFO_COMMAND_CHANNEL_FORUM_REQUIRES_TAGS: `**Requires Tags for Posts:**`,
    INFO_COMMAND_CHANNEL_FORUM_TAG_AMOUNT: `**Number of Tags:**`,

    INFO_COMMAND_CHANNEL_STAGE_FULL: `**Is Stage full:**`,
    INFO_COMMAND_CHANNEL_STAGE_LIMIT: `**Stage Member Limit:**`,
    INFO_COMMAND_CHANNEL_STAGE_LIVE_STARTED: `**Live Stage started:**`,
    INFO_COMMAND_CHANNEL_STAGE_EVENT_CONNECTION: `**Connected to Scheduled Event:**`,
    INFO_COMMAND_CHANNEL_STAGE_TOPIC: `**Stage Topic:**`,

    INFO_COMMAND_CHANNEL_THREAD_CREATOR: `**Thread/Post Creator:**`,
    INFO_COMMAND_CHANNEL_THREAD_APPLIED_TAGS: `**Number of Applied Tags:**`,
    INFO_COMMAND_CHANNEL_THREAD_CLOSED: `**Closed:**`,
    INFO_COMMAND_CHANNEL_THREAD_LOCKED: `**Locked:**`,
    INFO_COMMAND_CHANNEL_THREAD_AUTO_HIDE_DURATION: `**Auto-hide Duration:**`,
    INFO_COMMAND_CHANNEL_THREAD_INVITABLE: `**Can Anyone Invite to Private Thread:**`,
    INFO_COMMAND_CHANNEL_THREAD_PINNED: `**Is Post Pinned:**`,

    INFO_COMMAND_CHANNEL_VOICE_FULL: `**Is Voice full:**`,
    INFO_COMMAND_CHANNEL_VOICE_LIMIT: `**Voice Member Limit:**`,

    INFO_COMMAND_CHANNEL_FLAG_CLYDE: `ClydeAI`, // Discord please burn ClydeAI already you don't need it so stop bandwagoning :S
    INFO_COMMAND_CHANNEL_FLAG_RESOURCE: `Is Guide Resource`,
    INFO_COMMAND_CHANNEL_FLAG_SCHEDULED_DELETION: `Is Scheduled for Deletion`,
    INFO_COMMAND_CHANNEL_FLAG_SPAM: `Is Spam`,
    
    INFO_COMMAND_CHANNEL_GENERAL: `>> General Information`,
    INFO_COMMAND_CHANNEL_CATEGORY_INFO: `>> Category Information`,
    INFO_COMMAND_CHANNEL_FORUM_INFO: `>> Forum Information`,
    INFO_COMMAND_CHANNEL_FORUM_TAG_INFO: `>> Available Tags`,
    INFO_COMMAND_CHANNEL_ANNOUNCEMENT_INFO: `>> Announcement Information`,
    INFO_COMMAND_CHANNEL_STAGE_INFO: `>> Stage Information`,
    INFO_COMMAND_CHANNEL_LIVE_STAGE_INFO: `>> Live Stage Information`,
    INFO_COMMAND_CHANNEL_TEXT_INFO: `>> Text Information`,
    INFO_COMMAND_CHANNEL_THREAD_INFO: `>> Thread Information`,
    INFO_COMMAND_CHANNEL_POST_INFO: `>> Forum Post Information`,
    INFO_COMMAND_CHANNEL_VOICE_INFO: `>> Voice Information`,
    INFO_COMMAND_CHANNEL_FLAG_INFO: `>> Channel Flags`,


    INFO_COMMAND_SERVER_ERROR_OUTAGE: `Sorry, it seems I'm currently unable to read this Server's information - this could be due to an on-going [Discord outage](https://discordstatus.com).\nIf so, please wait and try again later.`,

    INFO_COMMAND_SERVER_PARTNERED: `**Is Partnered**`,
    INFO_COMMAND_SERVER_VERIFIED: `**Is Verified**`,
    INFO_COMMAND_SERVER_OWNER: `**Owner:**`,
    INFO_COMMAND_SERVER_BOOST_TIER: `**Boost Tier:**`,
    INFO_COMMAND_SERVER_BOOST_COUNT: `**Boost Count:**`,
    INFO_COMMAND_SERVER_EMOJIS: `**Emojis:**`,
    INFO_COMMAND_SERVER_STICKERS: `**Stickers:**`,
    INFO_COMMAND_SERVER_SOUNDS: `**Soundboard Sounds:**`,
    INFO_COMMAND_SERVER_ROLES: `**Roles:**`,
    INFO_COMMAND_SERVER_SCHEDULED_EVENTS: `**Scheduled Events:**`,
    INFO_COMMAND_SERVER_VANITY: `**Invite Vanity:**`,
    INFO_COMMAND_SERVER_APPROX_TOTAL_MEMBERS: `**Approximate Total Members:**`,
    INFO_COMMAND_SERVER_APPROX_ONLINE_MEMBERS: `**Appproximate Online Members:**`,

    INFO_COMMAND_SERVER_VERIFICATION_LEVEL: `**Verification Level:**`,
    INFO_COMMAND_SERVER_EXPLICITY_FILTER: `**Explicit Content Filter:**`,
    INFO_COMMAND_SERVER_MFA_MODERATION: `**MFA-enabled Moderation:**`,
    INFO_COMMAND_SERVER_NSFW_LEVEL: `**Age-restricted Level:**`,
    INFO_COMMAND_SERVER_DEFAULT_NOTIFICATIONS: `**Default Notifications:**`,

    INFO_COMMAND_SERVER_GENERAL_INFO: `>> General Information`,
    INFO_COMMAND_SERVER_CHANNEL_INFO: `>> Channels`,
    INFO_COMMAND_SERVER_SECURITY_INFO: `>> Security & Moderation`,
    INFO_COMMAND_SERVER_FEATURE_FLAG_INFO: `>> Feature Flags`,

    INFO_COMMAND_SERVER_BUTTON_ICON: `Icon`,
    INFO_COMMAND_SERVER_BUTTON_BANNER: `Banner`,
    INFO_COMMAND_SERVER_BUTTON_INVITE_SPLASH: `Invite Splash`,
    INFO_COMMAND_SERVER_BUTTON_DISCOVERY_SPLASH: `Discovery Splash`,
};
