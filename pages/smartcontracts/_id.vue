<template>
  <pre>{{contract}}</pre>
</template>

<script>
import SMARTCONTRACTS from '~/services/constants/smartcontracts'
export default {
  layout: 'empty',
  data() {
    return {
      contract: null
    }
  },
  mounted() {
    this.contract = SMARTCONTRACTS[this.$route.params.id];
  }
}
</script>
<style></style>
