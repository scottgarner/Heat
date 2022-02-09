<template>
  <table>
    <tr>
      <th>Channel Id</th>
      <th>Channel Name</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
    <tr v-for="channel in channels" :key="channel.id">
      <td>{{ channel.id }}</td>
      <td>
        <a v-bind:href="channel.url">{{ channel.name }}</a>
      </td>
      <td>{{ channel.count }}</td>
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
      channels: [],
    };
  },
  async created() {
    let response = await fetch("https://heat-api.j38.net/status");
    let json = await response.json();

    // Filter respones into single object.
    let channelObject = {};
    json.channelConnections.forEach(async (replica) => {
      replica.forEach(async (channel) => {
        let channelId = channel.id;
        if (!(channelId in channelObject)) channelObject[channelId] = 0;
        channelObject[channelId] += 1;
      });
    });
    // Process individual channels.
    for (const [channelId, count] of Object.entries(channelObject)) {
      let response = await fetch(
        "https://api.twitch.tv/kraken/users/" + channelId,
        {
          headers: {
            "Client-ID": "cr20njfkgll4okyrhag7xxph270sqk",
            Accept: "application/vnd.twitchtv.v5+json",
          },
        }
      );

      let channelJson = await response.json();
      this.channels.push({
        id: channelId,
        name: channelJson.name,
        url: "https://twitch.tv/" + channelJson.name,
        count: count,
      });
    }
  },
};
</script>