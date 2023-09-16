# HeccBot - Privacy Policy
Last Updated: 16th September 2023

Effective: 30th September 2023

---

**HeccBot** (henseforth "**The Bot**") does __not__, and will __never__, collect & store Messages, User Data, or Server Data without explicit notice & consent.

As of the current iteration, **The Bot** does not store any Messages, and only listens to the `MESSAGE_CREATE` Event from Discord's API for its Developer-only commands to function. All these commands are viewable, as is the rest of **The Bot**'s code, in **The Bot**'s GitHub Repo ( https://github.com/TwilightZebby/HeccBot ).

---

**The Bot** does, however, store information *explicitly given* to **The Bot** by the User for a couple of its systems to function. The data collected is as listed:

- FOR THE "BUTTON ROLE MENUS" FEATURE:
  - IDs for
    - Roles, to know which Role to grant or revoke to a Server Member upon clicking a Button on a "Role Menu"
    - Messages, specifically only Messages sent by **The Bot** that also contains a "Role Menu"
    - Channels and Guilds/Servers, as to know where the "Role Menu"'s Message is
    - Custom Emojis, if given, to be displayed in the specified Button on a "Role Menu"
  - Strings specified to be displayed as Labels for Buttons, or as Titles/Descriptions on Embeds, for "Role Menus"

Should the User want to remove a "Role Menu", all they need to do is use the "Delete Role Menu" Message Context Command on the Message containing the "Role Menu", and **The Bot** will remove all data it has regarding that "Role Menu", in addition to removing the Message itself.

- FOR THE POLL FEATURE:
  - IDs for
    - Messages, specifically only Messages sent by **The Bot** that also contains a Poll
    - Channels and Guilds/Servers, as to know where the Poll's Message is
    - Members, specifically only Members that HAVE voted on a Poll (by explicitly pressing on a Button attached to said Poll), to know who has voted in which Poll made with **The Bot** as to prevent duplicate voting
  - Strings specified to be displayed as Labels/Choices for Buttons, or as Titles/Descriptions on Embeds, for Polls

Should the User want to remove a Poll, all they need to do is use the "End Poll" Message Context Command on the Message containing the Poll, and **The Bot** will remove all data it has regarding that Poll.

---

Finally, **The Bot** also makes use of the publicly available locale data (i.e: what language Users and Servers have set) Discord sends to all Bots using Discord's public API for "Interactions" (e.g: Slash Commands, Context Commands, Select Menus, Buttons, Modals). This locale data is only used for knowing which language **The Bot** should send its responses in, and is __NOT__ stored or tracked in any way.

You can see the public API Documentation regarding what the locale data includes on these official Discord API Documentation Pages:
- [API Locale Reference](https://discord.com/developers/docs/reference#locales)
- [Locale field in Interaction Objects](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object)

---

The Developer of **The Bot**, TwilightZebby, is contactable for matters regarding **The Bot** via GitHub, preferrably via opening an Issue Ticket or Discussion on **The Bot**'s [GitHub Repo](https://github.com/TwilightZebby/HeccBot).

Please also see [Discord's own Privacy Policy](https://discord.com/privacy).

*This Privacy Policy is subject to change at any time. A suitable notification system for privacy policy updates will be added to the Bot in the future.*
