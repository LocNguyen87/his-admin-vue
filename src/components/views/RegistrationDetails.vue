<template lang="html">

</template>

<script>
var Parse = require('parse')
export default {
  methods: {
    getRegistrationData (id) {
      // live query
      Parse.initialize('his-data')
      Parse.serverURL = 'http://his-data.herokuapp.com/parse'
      var Registration = Parse.Object.extend('Registration')
      var query = new Parse.Query(Registration)
      query.get(id, {
        success: function (registration) {
          console.log(registration.toJSON())
        }
      }, {
        error: function (obj, error) {
          console.log(error)
        }
      })
    }
  },
  mounted () {
    this.getRegistrationData(this.$route.params.id)
  }
}
</script>

<style lang="css">
</style>
