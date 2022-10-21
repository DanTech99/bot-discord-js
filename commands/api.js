const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch-commonjs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('hentaila')
        .setDescription('Reclama Baka Baka'),
    async execute(interaction, client) {
        await fetch('https://hentaila.com/api/episodes?auth=XiYGysnFPRjxG9H6IWMzBgK32abTorrF')
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => console.log(err))
        /*  let data = await api.json();
         console.log(data.anime_id); */
        const embed1 = new EmbedBuilder()
            .setTitle('anime')
            .setDescription(`:right: **CAPITULOS:** `)
            .setColor('FF0055')
        await interaction.reply({ embeds: [embed1] });



    }
}