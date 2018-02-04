<template lang="html">
  <div class="content">
    <div class="row center-block">
      <div class="loading" v-if="loading">
        Loading...
      </div>
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <div v-if="registration">
        <div class="row">
          <div class="col-md-4">
            <div class="box box-info">
              <div class="box-header with-border">
                <i class="fa fa-user fa-2x"></i> <h3 class="box-title">Personal Information</h3>
              </div>
              <div class="box-body">
                <dl>
                  <dt>Name:</dt>
                  <dd>{{ registration.fullName }}</dd>
                  <dt>Email:</dt>
                  <dd>{{ registration.email }}</dd>
                  <dt>Phone:</dt>
                  <dd>{{ registration.phone }}</dd>
                  <dt>Address:</dt>
                  <dd>{{ registration.address }}</dd>
                  <dt>Region:</dt>
                  <dd>{{ registration.region }}</dd>
                  <dt>Nation:</dt>
                  <dd>{{ registration.nation }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="box box-info">
              <div class="box-header with-border">
                <i class="fa fa-comments fa-2x"></i> <h3 class="box-title">Travel Request</h3>
              </div>
              <div class="box-body">
                <dl>
                  <dt>Has Visa:</dt>
                  <dd>{{ registration.hasVisa === true ? 'Yes' : 'No' }}</dd>
                  <dt>Travel Type:</dt>
                  <dd>{{ registration.travelType }}</dd>
                  <dt>Estimate Departure:</dt>
                  <dd>{{ registration.timeToGo }}</dd>
                  <dt>Estimate Budget:</dt>
                  <dd>{{ registration.budget }}</dd>
                  <dt>Request:</dt>
                  <dd>{{ registration.request }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="box box-info">
              <div class="box-header with-border">
                <i class="fa fa-bar-chart fa-2x"></i> <h3 class="box-title">Device & Traffic Source</h3>
              </div>
              <div class="box-body">
                <dl>
                  <dt>Device:</dt>
                  <dd>{{ registration.deviceInfo }}</dd>
                  <dt>Browser:</dt>
                  <dd>{{ registration.systemInfo }}</dd>
                  <dt>URL:</dt>
                  <dd>{{ registration.originalUrl }}</dd>
                  <dt>UTM Source:</dt>
                  <dd>{{ registration.utmSource }}</dd>
                  <dt>UTM Medium:</dt>
                  <dd>{{ registration.utmMedium }}</dd>
                  <dt>UTM Campaign:</dt>
                  <dd>{{ registration.utmCampaign }}</dd>
                  <dt>GCLID:</dt>
                  <dd>{{ registration.gclid }}</dd>
                </dl>
              </div>
            </div>
          </div>
          <!-- /.col -->
        </div>
        <div class="row">
          <div class="col-xs-12">
            <div class="box box-warning">
              <div class="box-header with-border">
                  <i class="fa fa-globe"></i> <h3 class="box-title">Submission General Data</h3>
              </div>
              <div class="box-body">
                <div class="row">
                  <div class="col-md-4">
                    <dl>
                      <dt>Created on </dt>
                      <dd>{{ getReadableDate(registration.createdAt) }}</dd>
                      <dt>Updated on </dt>
                      <dd>{{ getReadableDate(registration.updatedAt) }}</dd>
                    </dl>
                  </div>
                  <div class="col-md-4">
                    <dl>
                      <dt>Time Spent On Page (seconds)</dt>
                      <dd>{{ registration.readingTime }}</dd>
                      <dt>Scrolled </dt>
                      <dd>{{ registration.scrolled }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
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
      return moment(iso).format('h:mm:ss a') + ' - ' + moment(iso).format('DD/MM/YYYY')
    }
  }
}
</script>

<style lang="css">
</style>
