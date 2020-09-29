<template>
  <section class="ipfsReadWrite">
    <blockquote>An IPFS sandbox</blockquote>
    <h1>Write to IPFS</h1>
    <label for="message">Message to post into IPFS <textarea name="message" v-model="message"></textarea></label>
    <button v-if="message && !posting" v-on:click="post()">Post it !</button>
    <button v-if="posting">Posting...</button>
    <br/>
    <ul v-if="postedMessage">
      <li><strong>Hash:</strong> {{postedMessage.hash}}</li>
      <li>Url to read the message (wait a minute before trying): <strong><a target="_blank" v-bind:href="postedMessage.url">{{postedMessage.url}}</a></strong></li>
    </ul>
    <br/>
    <hr/>
    <br/>
    <h1>Read from IPFS</h1>
    <label>Hash to read from ipfs <input style="width: 450px" type="text" v-model="hash"></label>
    <button v-if="hash && !reading" v-on:click="read()">Read it !</button>
    <button v-if="reading">Reading ...</button>
    <br/>
    <div v-if="result">
      <h2>Résult</h2>
      <pre>{{result}}</pre></div>
  </section>
</template>

<script>
import { IPFS_MANAGER } from '~/services/ipfs';
export default {
  components: {},
  data() {
    return {
      message: null,
      posting: false,
      postedMessage: null,
      reading: false,
      hash: null,
      result: null
    }
  },
  methods: {
    async post() {
      this.posting = true;
      let message = this.message;
      this.message = null;
      this.postedMessage = null;
      this.postedMessage = await IPFS_MANAGER.add(message);
      this.hash = this.postedMessage.hash;
      this.posting = false;
    },

    async read() {
      this.reading = true;
      this.result = null;
      let result = await IPFS_MANAGER.read(this.hash);
      if (!result) {
        result = 'File not found';
      }
      this.result = result;
      this.reading = false;
    }
  }
}
</script>
<style></style>
