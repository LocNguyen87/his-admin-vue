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
                      <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Potential Score</th>
                          <th>Date</th>
                          <th>Action</th>
                      </tr>
                    </thead>
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
      error: null,
      table: null
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
      .then(() => {
        const vm = this
        this.table = this.initTable()
        $('.viewDetailsBtn').on('click', function () {
          vm.goToDetails(this.id)
        })
      })

      var subscription = query.subscribe()

      subscription.on('open', () => {
        console.log('connection opened')
      })
      subscription.on('create', (object) => {
        this.registrations.push(object.toJSON())
        this.table.clear().rows.add(this.registrations).draw()
      })
      subscription.on('update', (object) => {
        var localMatchedObject = this.registrations.find(obj => { return obj.objectId === object.toJSON().objectId })
        Object.assign(localMatchedObject, object.toJSON())
        this.table.clear().rows.add(this.registrations).draw()
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
    initTable () {
      return $('#registration-table').DataTable({
        data: this.registrations,
        columns: [
          { data: 'fullName' },
          { data: 'email' },
          { data: 'phone' },
          {
            data: 'potentialScore',
            render: function (data, type, row, meta) {
              return '<span class="badge bg-green">' + (data * 10) + '%</span>'
            }
          },
          {
            data: 'createdAt',
            render: function (data, type, row, meta) {
              return moment(data).format('DD/MM/YYYY')
            }
          },
          {
            data: 'objectId',
            render: function (data, type, row, meta) {
              return '<div role="group" aria-label="..." class="btn-group"><a id="' + data + '" data-registration-id="' + data + '" class="btn btn-sm btn-primary viewDetailsBtn"><i class="fa fa-eye"></i>&nbsp;&nbsp;View </a> <a href="/registration" class="btn btn-sm btn-danger active router-link-active"><i class="fa fa-trash"></i>&nbsp;&nbsp;Delete</a></div>'
            }
          }
        ]
      })
    },
    getReadableDate (iso) {
      return moment(iso).format('DD/MM/YYYY')
    },
    goToDetails: function (id) {
      this.$router.push({name: 'details', params: { id }})
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
