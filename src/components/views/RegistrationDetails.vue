<template lang="html">
  <div class="content">
    <div class="row center-block">
      <div class="loading" v-if="loading">
        Loading...
      </div>
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <div v-if="registration" class="invoice">
        <div class="row">
          <div class="col-xs-12">
            <h2 class="page-header">
              <i class="fa fa-globe"></i> Registration for travel consultancy
              <small class="pull-right">Date: {{ getReadableDate(registration.createdAt) }}</small>
            </h2>
          </div>
          <!-- /.col -->
        </div>
        <div class="row">
          <div class="col-md-4">
            <h4><i class="fa fa-user"></i>&nbsp;<strong>Personal Information</strong></h4>
            <p>
              <strong>Name:</strong> {{ registration.fullName }} <br />
              <strong>Email:</strong> {{ registration.email }} <br />
              <strong>Phone:</strong> {{ registration.phone }} <br />
              <strong>Address:</strong> {{ registration.address }} <br />
              <strong>Region:</strong> {{ registration.region }} <br />
              <strong>Nation:</strong> {{ registration.nation }} <br />
            </p>
          </div>
          <div class="col-md-4">
            <h4><i class="fa fa-comments"></i>&nbsp;<strong>Travel Request</strong></h4>
            <p>
              <strong>Has Visa:</strong> {{ registration.hasVisa === true ? 'Yes' : 'No' }} <br />
              <strong>Travel Type:</strong> {{ registration.travelType }} <br />
              <strong>Estimate Departure:</strong> {{ registration.timeToGo }} <br />
              <strong>Estimate Budget:</strong> {{ registration.budget }} <br />
              <strong>Request:</strong> {{ registration.request }} <br />
            </p>
          </div>
          <div class="col-md-4">
            <h4><i class="fa fa-bar-chart"></i>&nbsp;<strong>Device & Traffic Source</strong></h4>
            <p>
              <strong>Device:</strong> {{ registration.deviceInfo }} <br />
              <strong>System:</strong> {{ registration.systemInfo }} <br />
              <strong>URL:</strong> {{ registration.originalUrl }} <br />
              <strong>UTM Source:</strong> {{ registration.utmSource }} <br />
              <strong>UTM Medium:</strong> {{ registration.utmMedium }} <br />
              <strong>UTM Campaign:</strong> {{ registration.utmCampaign }} <br />
              <strong>GCLID:</strong> {{ registration.gclid }} <br />
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

var Parse = require('parse')
export default {
  name: 'RegistrationDetails',
  data () {
    return {
      loading: false,
      registration: null,
      error: null
    }
  },
  created () {
    this.getRegistrationData(this.$route.params.id)
  },
  methods: {
    getRegistrationData (id) {
      this.loading = true
      // live query
      Parse.initialize('his-data')
      Parse.serverURL = 'http://his-data.herokuapp.com/parse'
      var Registration = Parse.Object.extend('Registration')
      var query = new Parse.Query(Registration)
      query.get(id)
      .then(result => {
        this.loading = false
        this.registration = result.toJSON()
        console.log(this.registration)
      })
      .catch(error => {
        this.loading = false
        this.error = error
      })
    },
    getReadableDate (iso) {
      return moment(iso).format('DD/MM/YYYY')
    }
  }
}
</script>

<style lang="css">
</style>
