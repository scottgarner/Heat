<template>
  <div class="container">
    <div v-for="[id, channel] of channels" class="card">
      <div class="stream">
        <div class="broadcaster">{{ channel.user_name }}</div>
        <div class="viewers">
          <img class="eye" src="https://www.svgrepo.com/show/501194/eye.svg" />
          <span>{{ channel.viewer_count }}</span>
        </div>
      </div>
      <div>
        <a :href="channel.url"><img :src="channel.thumbnail_url" class="image" width="320" height="180" /></a>
      </div>
      <div class="info">
        <div class="category">{{ channel.game_name }}</div>
        <div>{{ channel.title }}</div>
      </div>
    </div>
  </div>
</template>

<style >
body,
html {
  background: #2b3990;
  background: linear-gradient(45deg, #2b3990 0%, #92278f 100%);
  background-attachment: fixed;
  height: 100%;
}

body {
  font-family: sans-serif;
  font-size: 10pt;
  margin: 0;
  padding: 1em;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.card {
  position: relative;
  display: inline;
  border: 1px solid gray;
  flex-basis: 320px;
  min-width: 320px;
  border-radius: .5em;
  overflow: hidden;
  background: #efefef;
}

.info {
  padding: 1em;
}

.info>div {
  padding-bottom: .5em;
}

.stream {
  background: rgba(0, 0, 0, .5);
  backdrop-filter: blur(2px);
  padding: 1em;
  display: flex;
  justify-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.broadcaster {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
  color: white;
}

.viewers {
  background: red;
  border-radius: .25em;
  padding: .25em;
  color: white;
  font-weight: bold;
  min-width: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye {
  filter: invert(1);
  width: 1em;
  height: 1em;
  margin-right: .25em;
}

.category {
  font-size: 1.1em;
  font-weight: bold;
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
      // if (!this.channels.has(channel.user_id)) {
      this.channels.set(channel.user_id, {
        ...channel,
        url: "https://twitch.tv/" + channel.user_name,
        thumbnail_url: channel.thumbnail_url.replace("{width}", "320").replace("{height}", "180")
      });
      console.log(channel);
      // }
    });

  },
};
</script>