const { StringSelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, RoleSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const fs = require("fs");
const { Collections } = require("../../constants.js");
const { localize } = require("../../BotModules/LocalizationModule.js");


module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "create-role-menu",

    // Select's Description
    Description: `Handles processing options for creation of Role Menus`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 3,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        const AddRoleSelect = new ActionRowBuilder().addComponents([
            new RoleSelectMenuBuilder().setCustomId(`create-menu-add-role`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'ROLE_MENU_ROLE_ADD_SEARCH'))
        ]);
        
        const RemoveRoleSelect = new ActionRowBuilder().addComponents([
            new RoleSelectMenuBuilder().setCustomId(`create-menu-remove-role`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'ROLE_MENU_ROLE_REMOVE_SEARCH'))
        ]);
        
        const SetTypeSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`create-set-menu-type`).setMinValues(1).setMaxValues(1).setPlaceholder(localize(selectInteraction.locale, 'ROLE_MENU_SELECT_MENU_TYPE')).setOptions([
                new StringSelectMenuOptionBuilder().setValue(`TOGGLE`).setLabel(localize(selectInteraction.locale, 'ROLE_MENU_MENU_TYPE_TOGGLE')),
                new StringSelectMenuOptionBuilder().setValue(`SWAP`).setLabel(localize(selectInteraction.locale, 'ROLE_MENU_MENU_TYPE_SWAPPABLE')),
                new StringSelectMenuOptionBuilder().setValue(`SINGLE`).setLabel(localize(selectInteraction.locale, 'ROLE_MENU_MENU_TYPE_SINGLE'))
            ])
        ]);



        // Grab value
        const SelectedOption = selectInteraction.values.shift();

        switch (SelectedOption)
        {
            // Set Menu Type
            case "set-type":
                await selectInteraction.deferUpdate();
                await selectInteraction.followUp({ ephemeral: true, components: [SetTypeSelect], content: localize(selectInteraction.locale, 'ROLE_MENU_SET_MENU_TYPE_INSTRUCTIONS') });

                // Temp-store interaction so we can return to it
                let tempData = Collections.RoleMenuCreation.get(selectInteraction.guildId);
                tempData.interaction = selectInteraction;
                Collections.RoleMenuCreation.set(selectInteraction.guildId, tempData);
                break;


            // Edit Embed
            case "configure-embed":
                let embedData = Collections.RoleMenuCreation.get(selectInteraction.guildId)?.embed;

                let embedModal = new ModalBuilder().setCustomId(`create-menu-embed`).setTitle(localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURE_MENU_EMBED')).addComponents([
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`title`).setLabel(localize(selectInteraction.locale, 'ROLE_MENU_EMBED_TITLE')).setMaxLength(256).setStyle(TextInputStyle.Short).setRequired(true).setValue(!embedData?.data.title ? "" : embedData.data.title) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`description`).setLabel(localize(selectInteraction.locale, 'ROLE_MENU_EMBED_DESCRIPTION')).setMaxLength(2000).setStyle(TextInputStyle.Paragraph).setRequired(false).setValue(!embedData?.data.description ? "" : embedData.data.description) ]),
                    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`hex-colour`).setLabel(localize(selectInteraction.locale, 'ROLE_MENU_EMBED_COLOR')).setMaxLength(7).setPlaceholder("#ab44ff").setStyle(TextInputStyle.Short).setRequired(false).setValue(!embedData?.data.color ? "" : `${typeof embedData.data.color === 'number' ? `#${embedData.data.color.toString(16).padStart(6, '0')}` : embedData.data.color}`) ])
                ]);

                await selectInteraction.showModal(embedModal);
                break;


            // Add new Role to Menu
            case "add-role":
                // Validate Menu doesn't already have self-imposed max of 10 Buttons
                let fetchedButtons = Collections.RoleMenuCreation.get(selectInteraction.guildId).roles;
                if ( fetchedButtons?.length === 10 )
                {
                    await selectInteraction.reply({ ephemeral: true, content: localize(selectInteraction.locale, 'ROLE_MENU_ERROR_BUTTON_LIMIT_EXCEEDED') });
                    break;
                }

                // Ask for which Role to add
                await selectInteraction.deferUpdate(); // Just so the original is editable later
                await selectInteraction.followUp({ ephemeral: true, components: [AddRoleSelect], content: localize(selectInteraction.locale, 'ROLE_MENU_ROLE_ADD_INSTRUCTIONS') });

                // Temp-store interaction so we can return to it
                let menuData = Collections.RoleMenuCreation.get(selectInteraction.guildId);
                menuData.interaction = selectInteraction;
                Collections.RoleMenuCreation.set(selectInteraction.guildId, menuData);
                break;


            // Remove Role from Menu
            case "remove-role":
                // ACK to User to choose which Role to remove from Menu
                await selectInteraction.deferUpdate(); // So original is editable later
                await selectInteraction.followUp({ ephemeral: true, components: [RemoveRoleSelect], content: localize(selectInteraction.locale, 'ROLE_MENU_ROLE_REMOVE_INSTRUCTIONS') });

                // Temp-store interaction so we can return to it
                let menuDataRemove = Collections.RoleMenuCreation.get(selectInteraction.guildId);
                menuDataRemove.interaction = selectInteraction;
                Collections.RoleMenuCreation.set(selectInteraction.guildId, menuDataRemove);
                break;

            
            // Save & Display Menu
            case "save":
                await this.saveAndDisplay(selectInteraction);
                break;


            // Cancel creation
            case "cancel":
                // Clear Timeout first, just in case
                let timeoutCache = Collections.RoleMenuCreation.get(selectInteraction.guildId).timeout;
                clearTimeout(timeoutCache);
                Collections.RoleMenuCreation.delete(selectInteraction.guildId);
                await selectInteraction.update({ embeds: [], components: [], content: localize(selectInteraction.locale, 'ROLE_MENU_CONFIGURATION_CANCELLED') });
                break;
                

            default:
                await selectInteraction.reply({ ephemeral: true, content: localize(selectInteraction.locale, 'ERROR_GENERIC') });
                break;
        }

        return;
    },





    /**
     * Saves & Displays the new Menu for Members to use
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async saveAndDisplay(selectInteraction)
    {
        // Defer
        await selectInteraction.deferUpdate();

        // Bring in JSON
        const RoleMenuJson = require("../../JsonFiles/Hidden/RoleMenus.json");

        // Fetch data
        const MenuDataCache = Collections.RoleMenuCreation.get(selectInteraction.guildId);
        const RoleDataCache = MenuDataCache.roles;
        const EmbedDataCache = MenuDataCache.embed.setFooter({ text: localize(selectInteraction.guildLocale, 'ROLE_MENU_TYPE_FOOTER', `${MenuDataCache.type}`) });
        const ButtonDataCache = MenuDataCache.buttons;
        const MenuType = MenuDataCache.type;

        // Construct Component Row(s)
        let temp;
        /** @type {Array<ActionRowBuilder>} */
        let buttonsArray = [];

        for ( let i = 0; i <= ButtonDataCache.length - 1; i++ )
        {
            // So that the Custom IDs of the Buttons can be updated from the "during creation" one to the "assign role" one
            let tempRoleID = ButtonDataCache[i].data.custom_id.split("_").pop();

            if ( i === 0 )
            {
                // First Button on first row
                temp = new ActionRowBuilder().addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // push early if only Button
                if ( ButtonDataCache.length - 1 === i ) { buttonsArray.push(temp); }
            }
            else if ( i > 0 && i < 4 )
            {
                // First row, buttons two through four
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // push early if last Button
                if ( ButtonDataCache.length - 1 === i ) { buttonsArray.push(temp); }
            }
            else if ( i === 4 )
            {
                // First row, fifth button
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // Free up TEMP ready for second row
                buttonsArray.push(temp);
                temp = new ActionRowBuilder();
            }
            else if ( i > 4 && i < 9 )
            {
                // Second row, buttons one through four
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                // push early if last Button
                if ( ButtonDataCache.length - 1 === i ) { buttonsArray.push(temp); }
            }
            else if ( i === 9 )
            {
                // Second row, fifth button
                temp.addComponents(ButtonDataCache[i].setCustomId(`role_${tempRoleID}`));
                buttonsArray.push(temp);
            }
            else { break; }
        }


        // Send Message with Menu
        await selectInteraction.channel.send({ embeds: [EmbedDataCache], components: buttonsArray, allowedMentions: { parse: [] } })
        .then(async sentMessage => {
            // Save to JSON
            RoleMenuJson[sentMessage.id] = {
                MESSAGE_ID: sentMessage.id,
                CHANNEL_ID: sentMessage.channel.id,
                GUILD_ID: sentMessage.guild.id,
                MENU_TYPE: MenuType,
                ROLES: RoleDataCache,
                EMBED: {
                    TITLE: EmbedDataCache.data.title,
                    DESCRIPTION: EmbedDataCache.data.description !== undefined ? EmbedDataCache.data.description : null,
                    COLOR: EmbedDataCache.data.color !== undefined ? EmbedDataCache.data.color : null
                }
            };

            fs.writeFile('./JsonFiles/Hidden/RoleMenus.json', JSON.stringify(RoleMenuJson, null, 4), async (err) => {
                if ( err )
                { 
                    await selectInteraction.followUp({ content: localize(selectInteraction.locale, 'ROLE_MENU_ERROR_CREATION_GENERIC'), ephemeral: true });
                    return;
                }
            });


            // Clean up
            clearTimeout(MenuDataCache.timeout);
            Collections.RoleMenuCreation.delete(selectInteraction.guildId);
            await selectInteraction.followUp({ ephemeral: true, content: localize(selectInteraction.locale, 'ROLE_MENU_CREATION_SUCCESS', `https://i.imgur.com/m1uBo5J.png`) });
            return;
        })
        .catch(err => {
            //console.error(err);
            return;
        });

        return;
    }
}
