<template lang="html">
  <section class="content">
    <div class="row center-block">
      <h2 class="pull-left">Submission List ({{ registrations.length }})</h2>
      <a @click="doExport" class="btn btn-primary pull-right"><i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;Export Data</a>
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
                          <th>UTM Source</th>
                          <th>UTM Campaign</th>
                          <th>UTM Content</th>
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
import xlsx from 'xlsx' // eslint-disable-line no-unused-vars
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
      Parse.serverURL = 'https://his-data.herokuapp.com/parse'
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
        $('td').on('click', '.viewDetailsBtn', function () {
          vm.goToDetails($(this).parent().attr('id'))
        })
      })

      var subscription = query.subscribe()

      subscription.on('open', () => {
        console.log('connection opened')
      })
      subscription.on('create', (object) => {
        this.registrations.push(object.toJSON())
        this.reloadTable()
      })
      subscription.on('update', (object) => {
        var localMatchedObject = this.registrations.find(obj => { return obj.objectId === object.toJSON().objectId })
        Object.assign(localMatchedObject, object.toJSON())
        this.reloadTable()
      })
      subscription.on('delete', (object) => {
        var localMatchedObject = this.registrations.find(obj => { return obj.objectId === object.toJSON().objectId })
        Object.assign(localMatchedObject, null)

        var updatedData = $.grep(this.registrations, function (e) {
          return e.objectId !== object.toJSON().objectId
        })
        this.registrations = updatedData
        this.reloadTable()
      })
    },
    reloadTable () {
      $('#registration-table').dataTable().fnClearTable()
      $('#registration-table').dataTable().fnDestroy()
      this.table = this.initTable()

      this.$nextTick(function () {
        const vm = this
        $('td').on('click', '.viewDetailsBtn', function () {
          vm.goToDetails($(this).parent().attr('id'))
        })
      })
    },
    initTable () {
      const vm = this
      return $('#registration-table')
      .on('length.dt', function () {
        vm.$nextTick(function () {
          $('td').on('click', '.viewDetailsBtn', function () {
            vm.goToDetails($(this).parent().attr('id'))
          })
        })
      })
      .on('order.dt', function () {
        vm.$nextTick(function () {
          $('td').on('click', '.viewDetailsBtn', function () {
            vm.goToDetails($(this).parent().attr('id'))
          })
        })
      })
      .on('search.dt', function () {
        vm.$nextTick(function () {
          $('td').on('click', '.viewDetailsBtn', function () {
            vm.goToDetails($(this).parent().attr('id'))
          })
        })
      })
      .on('page.dt', function () {
        vm.$nextTick(function () {
          $('td').on('click', '.viewDetailsBtn', function () {
            vm.goToDetails($(this).parent().attr('id'))
          })
        })
      })
      .DataTable({
        data: this.registrations,
        pageLength: 50,
        order: [[ 6, 'desc' ]],
        columns: [
          { data: 'fullName' },
          { data: 'email' },
          { data: 'phone' },
          { data: 'utmSource' },
          { data: 'utmCampaign' },
          { data: 'utmContent' },
          {
            data: 'potentialScore',
            render: function (data, type, row, meta) {
              var color
              if (data <= 3) color = 'red'
              else if (data > 3.1 && data < 7.9) color = 'orange'
              else color = 'green'
              return '<span class="badge bg-' + color + '">' + (data * 10) + '%</span>'
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
              return '<div role="group" aria-label="..." class="btn-group" id="' + data + '"><a data-record-id="' + data + '" class="btn btn-sm btn-primary viewDetailsBtn"><i class="fa fa-eye"></i>&nbsp;&nbsp;View </a> <a href="/registration" class="btn btn-sm btn-danger active router-link-active"><i class="fa fa-trash"></i>&nbsp;&nbsp;Delete</a></div>'
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
    },
    doExport () {
      const wb = xlsx.utils.book_new()
      const ws = xlsx.utils.json_to_sheet(this.registrations)
      xlsx.utils.book_append_sheet(wb, ws, 'Osaka-Registration-Data')
      xlsx.writeFile(wb, 'Osaka-Registration-Data.xlsx')
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
h2.pull-left {
  margin-top:0;
}
</style>
