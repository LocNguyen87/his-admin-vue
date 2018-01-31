<template lang="html">
  <section class="content">
    <div class="row center-block">
      <h2>Registration List ({{ registrations.length }})</h2>
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">All of registration sent from landing pages</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
            <div class="dataTables_wrapper form-inline dt-bootstrap" id="registration-table_wrapper">
              <div class="row">
                <div class="col-sm-6">
                  <div id="registration-table_length" class="dataTables_length">

                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12 table-responsive">
                  <table aria-describedby="registration-table_info" role="grid" id="registration-table" class="table table-bordered table-striped dataTable">
                    <thead>
                      <tr role="row">
                        <th aria-label="Rendering engine: activate to sort column descending" aria-sort="ascending" style="width: 167px;" colspan="1" rowspan="1" aria-controls="registration-table" tabindex="0" class="sorting_asc">Name</th>
                        <th aria-label="Browser: activate to sort column ascending" style="width: 207px;" colspan="1" rowspan="1" aria-controls="registration-table" tabindex="0" class="sorting">Email</th>
                        <th aria-label="Phone Number" style="width: 207px;" colspan="1" rowspan="1" aria-controls="registration-table" tabindex="0" class="sorting">Phone Number</th>
                        <th aria-label="Platform(s): activate to sort column ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="registration-table" tabindex="0" class="sorting">Potential Score (s)</th>
                        <th aria-label="Platform(s): activate to sort column ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="registration-table" tabindex="0" class="sorting">Submitted At</th>
                        <th aria-label="Engine version: activate to sort column ascending" style="width: 142px;" colspan="1" rowspan="1" aria-controls="registration-table" tabindex="0" class="sorting">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="registration in registrations" >
                        <td>{{ registration.fullName }}</td>
                        <td>{{ registration.email }}</td>
                        <td>{{ registration.phone }}</td>
                        <td>
                          <span class="badge bg-green">{{ registration.potentialScore * 10 }}%</span>
                        </td>
                        <td class="sorting_1">
                          {{ getReadableDate(registration.createdAt) }}
                        </td>
                        <td>
                          <div class="btn-group" role="group" aria-label="...">
                            <router-link tag="a" class="btn btn-sm btn-primary" :to="{name: 'details', params: {  id: registration.objectId }}">
                                <i class="fa fa-eye"></i>&nbsp;&nbsp;View
                            </router-link>
                            <router-link tag="a" class="btn btn-sm btn-danger" to="/registration">
                                <i class="fa fa-trash"></i>&nbsp;&nbsp;Delete
                            </router-link>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="1" rowspan="1">Name</th>
                        <th colspan="1" rowspan="1">Email</th>
                        <th colspan="1" rowspan="1">Phone Number</th>
                        <th colspan="1" rowspan="1">Potential Score(s)</th>
                        <th colspan="1" rowspan="1">Submitted At</th>
                        <th colspan="1" rowspan="1">Action</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <!-- /.box-body -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import api from '../../api'
import moment from 'moment'
import $ from 'jquery'
var Parse = require('parse')

// Require needed datatables modules
import 'datatables.net'
import 'datatables.net-bs'
export default {
  name: 'Registration',
  data () {
    return {
      registrations: [],
      error: null
    }
  },
  methods: {
    getRegistrations () {
      // live query
      Parse.initialize('his-data')
      Parse.serverURL = 'http://his-data.herokuapp.com/parse'
      var Registration = Parse.Object.extend('Registration')
      var query = new Parse.Query(Registration)

      query.find()
      .then(result => {
        result.forEach(val => {
          this.registrations.push(val.toJSON())
        })
      })
      .catch(error => {
        console.log(error)
      })

      var subscription = query.subscribe()

      subscription.on('open', () => {
        console.log('connection opened')
      })
      subscription.on('create', (object) => {
        this.registrations.push(object.toJSON())
      })
      subscription.on('update', (object) => {
        var localMatchedObject = this.registrations.find(obj => { return obj.objectId === object.toJSON().objectId })
        Object.assign(localMatchedObject, object.toJSON())
      })
      subscription.on('delete', (object) => {
        var localMatchedObject = this.registrations.find(obj => { return obj.objectId === object.toJSON().objectId })
        Object.assign(localMatchedObject, null)

        var updatedData = $.grep(this.registrations, function (e) {
          return e.objectId !== object.toJSON().objectId
        })
        this.registrations = updatedData
      })
    },
    getReadableDate (iso) {
      return moment(iso).format('DD/MM/YYYY')
    }
  },
  mounted () {
    this.getRegistrations()
    this.$nextTick(() => {
      $('#registration-table').DataTable({
        data: this.registrations,
        columns: [
          { data: 'name' },
          { data: 'email' },
          { data: 'phone' },
          { data: 'potentialScore' },
          { data: 'createdAt' },
          { data: '' }
        ]
      })
    })
  }
}
</script>

<style lang="css">
@import url('/static/js/plugins/datatables/dataTables.bootstrap.css');

table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'FontAwesome';
}

table.dataTable thead .sorting:after {
  content: "\f0dc";
}

table.dataTable thead .sorting_asc:after {
  content: "\f0dd";
}

table.dataTable thead .sorting_desc:after {
  content: "\f0de";
}
</style>
