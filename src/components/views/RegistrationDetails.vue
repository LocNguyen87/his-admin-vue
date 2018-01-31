<template lang="html">
  <div class="content">
    <div class="row center-block">
      <p>Hello world ! {{ reg.email }}</p>
    </div>
  </div>
</template>

<script>

var Parse = require('parse')
export default {
  name: 'RegistrationDetails',
  data () {
    return {
      reg: this.$store.state.registration,
      error: null
    }
  },
  methods: {
    getRegistrationData (id) {
      // live query
      Parse.initialize('his-data')
      Parse.serverURL = 'http://his-data.herokuapp.com/parse'
      var Registration = Parse.Object.extend('Registration')
      var query = new Parse.Query(Registration)
      query.get(id)
      .then(result => {
        this.$store.commit('SET_REGISTRATION', result.toJSON())
        this.reg = result.toJSON()
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.getRegistrationData(this.$route.params.id)
  }
}
</script>

<style lang="css">
</style>
