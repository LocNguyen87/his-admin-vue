<template lang="html">
  <section class="content">
    <div class="row center-block">
      <h2>Registration List</h2>
      <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">All of registration sent from landing pages</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
            <div class="dataTables_wrapper form-inline dt-bootstrap" id="example1_wrapper">
              <div class="row">
                <div class="col-sm-6">
                  <div id="example1_length" class="dataTables_length">

                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12 table-responsive">
                  <table aria-describedby="example1_info" role="grid" id="example1" class="table table-bordered table-striped dataTable">
                    <thead>
                      <tr role="row">
                        <th aria-label="Rendering engine: activate to sort column descending" aria-sort="ascending" style="width: 167px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting_asc">Name</th>
                        <th aria-label="Browser: activate to sort column ascending" style="width: 207px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Email</th>
                        <th aria-label="Platform(s): activate to sort column ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Potential Score (s)</th>
                        <th aria-label="Engine version: activate to sort column ascending" style="width: 142px;" colspan="1" rowspan="1" aria-controls="example1" tabindex="0" class="sorting">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="registration in registrations" >
                        <td>{{ registration.fullName }}</td>
                        <td>{{ registration.email }}</td>
                        <td>{{ registration.potentialScore }}</td>
                        <td>hihi</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="1" rowspan="1">Name</th>
                        <th colspan="1" rowspan="1">Email</th>
                        <th colspan="1" rowspan="1">Potential Score(s)</th>
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
import $ from 'jquery'
var Parse = require('parse')

// import $ from 'jquery'
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
      // api.getRegistrations()
      // .then(response => {
      //   this.registrations = response.data.results
      // })
      // .catch(error => {
      //   console.log(error)
      //   this.error = error
      // })

      // Parse.initialize('his-data')
      // Parse.serverURL = 'http://his-data.herokuapp.com/parse'
      // var Registration = Parse.Object.extend('Registration')
      // var query = new Parse.Query(Registration)
      // query.find()
      // .then(result => {
      //   result.forEach(val => {
      //     this.registrations.push(val.toJSON())
      //   })
      // })
      // .catch(error => {
      //   console.log(error)
      // })

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
    }
  },
  mounted () {
    this.getRegistrations()
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
