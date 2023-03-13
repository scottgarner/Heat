<template>
  <table>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Game Name</th>
      <th>Title</th>
    </tr>
    <tr v-for="[id, channel] of channels">
      <td>{{ channel.broadcaster_id }}</td>
      <td>
        <a :href="channel.url">{{ channel.broadcaster_name }}</a>
      </td>
      <td>{{ channel.game_name }}</td>
      <td>{{ channel.title }}</td>
    </tr>
  </table>
</template>

<style scoped>
* {
  font-family: monospace, sans-serif;
}
</style>

<script>
export default {
  data() {
    return {
      channels: new Map(),
    };
  },
  async created() {
    let response = await fetch("https://heat-api-staging.j38.workers.dev/live");
    let json = await response.json();

    json.forEach(async (channel) => {
      if (!this.channels.has(channel.broadcaster_id)) {
        this.channels.set(channel.broadcaster_id, {
          ...channel,
          url: "https://twitch.tv/" + channel.broadcaster_name,
        });
        console.log(channel);
      }
    });

  },
};
</script>