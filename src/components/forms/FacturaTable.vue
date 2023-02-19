<template lang="pug">
div.factura-table-container
  v-tooltip(right)
    template(v-slot:activator="{ on }")
      v-btn(
        v-on="on",
        @click='downloadJson()'
      ) Descargar JSON
    span Descargar JSON de facturas
  v-tooltip(right)
    template(v-slot:activator="{ on }")
      v-btn(
        v-on="on",
        @click='downloadJsonV2()'
      ) Descargar JSON v2
    span Descargar JSON para Registro de Comprobantes de Compra
  v-expansion-panel
    v-expansion-panel-content
      template(v-slot:header)
        div Selectores de Rangos de Fechas
      .selectores-fecha-expansion-panel-content
        v-tooltip(right)
          template(v-slot:activator="{ on }")
            v-btn(
              v-on="on",
              v-html="datepickerType === 'month' ? 'Días' : 'Meses'",
              @click='changeDatepickerType()'
            )
          span Cambiar tipo de calendario

        .selectores-fecha-container
          v-layout(row wrap)
            v-flex(xs6, v-show="datepickerType === ''")
              v-date-picker(v-model="filters.startDay")

            v-flex(xs6, v-show="datepickerType === ''")
              v-date-picker(v-model="filters.endDay")

            v-flex(xs12, v-show="datepickerType === 'month'")
              v-date-picker(
                v-model="filters.months"
                type="month"
                :max="filters.maxMonth"
                :min="filters.minMonth"
                full-width
                landscape
                multiple
              )

    v-expansion-panel-content
      template(v-slot:header)
        div Tabla de Facturas
      .tabla-facturas-expansion-panel-content
        v-layout(row wrap)
          v-flex(xs12)
            v-card.ma-3
              v-card-title
                .title Lista de Facturas
                v-spacer
                v-text-field(
                  v-model='search'
                  append-icon='search'
                  label='Search'
                  single-line
                  hide-details
                  style="float: right; margin-right: 20px;"
                )

              .v-card-content.tabla-facturas
                v-data-table.elevation-1(:headers='headers', :items='facturaItems', :search='search')
                  template(v-slot:items='props')
                    td.justify-center.layout.px-0
                      v-tooltip(right)
                        template(v-slot:activator="{ on }")
                          v-btn(color="warning", icon, v-on="on", @click='editItem(props.item)')
                            v-icon edit
                        span Editar
                      v-tooltip(left)
                        template(v-slot:activator="{ on }")
                          btn-with-dialog-alert(title='Eliminar factura', icon, v-on='on', @on-confirm='deleteItem(props.item)')
                            v-icon delete
                        span Eliminar
                    td.text-xs-center {{ props.item.contribuyente.razonSocial }}
                    td.text-xs-center {{ props.item.contribuyente.nombreFantasia }}
                    td.text-xs-center.pl-0.pr-0 {{ getRUCby(props.item.contribuyente) }}
                    td.text-xs-center {{ props.item.numeroTimbrado }}
                    td.text-xs-center {{ props.item.numeroFactura }}
                    td.text-xs-centerpl-0.pr-0 {{ props.item.fecha }}
                    td.text-xs-center {{ props.item.condicion }}
                    td.text-xs-center {{ localify(props.item.gravada10) }}
                    td.text-xs-center {{ localify(props.item.gravada5) }}
                    td.text-xs-center {{ localify(+props.item.gravada10/10) }}
                    td.text-xs-center {{ localify(+props.item.gravada5/21) }}
                    td.text-xs-center {{ props.item.exenta ? 'Si' : 'No' }}
                    td.text-xs-center
                      img(:src="props.item.mediasrc" widh="56" height="56", @click="showImage(props.item.mediasrc)", style="cursor: pointer")
                    td.justify-center.layout.px-0
                      v-tooltip(right)
                        template(v-slot:activator="{ on }")
                          v-btn(color="warning", icon, v-on="on", @click='editItem(props.item)')
                            v-icon edit
                        span Editar
                      v-tooltip(left)
                        template(v-slot:activator="{ on }")
                          btn-with-dialog-alert(title='Eliminar factura', icon, v-on='on', @on-confirm='deleteItem(props.item)')
                            v-icon delete
                        span Eliminar
                  template(v-slot:no-data)
                    v-alert(:value="true" color="error" icon="warning") No hay facturas disponibles

  v-layout(row wrap)
    v-flex(xs8 sm3 lg2)
      .text-xs-left.text-sm-center.subheading.pt-4.pb-2 Total Gravada 10%
    v-flex(xs4 sm3 lg2)
      .text-xs-left.pt-4.pb-2 {{ localify(totals.gravada10) }}
    v-flex(xs8 sm3 lg2)
      .text-xs-left.text-sm-center.subheading.pt-4.pb-2 Total Gravada 5%
    v-flex(xs4 sm3 lg2)
      .text-xs-left.pt-4.pb-2 {{ localify(totals.gravada5) }}
    v-flex(xs12 md lg4)
      .right.pt-lg-4
        v-tooltip(left)
          template(v-slot:activator="{ on }")
            v-btn(color='success', icon, v-on="on", @click="createItem()")
              v-icon add
          span Agregar nueva factura

  v-dialog(v-model='dialog', persistent, max-width='1000px', scrollable)
    FacturaForm(v-if="dialog" :form-id="editFormId" @finished="dialog = false")

  v-dialog(v-model='imgDialog', max-width='500px', scrollable)
    v-card(v-if="imgDialog" style="position: relative;")
      v-responsive(style="overflow: auto; max-height: 500px; height: auto;")
        v-img(:src="imgDialog")
      v-btn(icon dark @click="dialog = false", style="position: absolute; top: 0; right: 10px;")
        v-icon mdi-close

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { isBefore, isSameMonth, isWithinRange, format, parse } from 'date-fns'
import { downloadObjectAsJson } from '../../utils/download-file'

const maxMonth = format(new Date(), 'YYYY-MM')

export default {
  components: {
    FacturaForm: _ => import('@/components/forms/FacturaForm')
  },
  data: () => ({
    dialog: false,
    imgDialog: false,
    search: '',
    headers: [
      { text: 'Acciones', align: 'center', value: 'title', sortable: false },
      { text: 'Razón Social', align: 'center', value: 'contribuyente.razonSocial' },
      { text: 'Alias', align: 'center', value: 'contribuyente.nombreFantasia' },
      { text: 'RUC', align: 'center', value: 'contribuyente.ruc' },
      { text: 'Número de timbrado', align: 'center', value: 'numeroTimbrado' },
      { text: 'Número de factura', align: 'center', value: 'numeroFactura' },
      { text: 'Fecha', align: 'center', value: 'fecha' },
      { text: 'Condición', align: 'center', value: 'condicion' },
      { text: 'Gravada 10%', align: 'center', value: 'gravada10' },
      { text: 'Gravada 5%', align: 'center', value: 'gravada5' },
      { text: 'IVA 10%', align: 'center', value: 'gravada10' },
      { text: 'IVA 5%', align: 'center', value: 'gravada5' },
      { text: 'Es exenta', align: 'center', value: 'exenta' },
      { text: 'Foto de la Factura', align: 'center', value: 'mediasrc' },
      { text: 'Acciones', align: 'center', value: 'title', sortable: false }
    ],
    editFormId: '',
    contribuyenteSelected: {},
    timbradoSelected: {},
    totals: {
      gravada10: 0,
      gravada5: 0
    },
    filters: {
      startDay: '',
      endDay: '',
      months: [],
      maxMonth,
      minMonth: maxMonth
    },
    datepickerType: 'month'
  }),

  computed: {
    ...mapGetters(['facturas', 'getContribuyenteById']),
    facturaItems () {
      const self = this
      self.totals.gravada10 = 0
      self.totals.gravada5 = 0
      return this.facturas
        .filter(f => {
          if (self.datepickerType === 'month') {
            const date1 = parse(f.fecha)
            const date2 = parse(self.filters.minMonth)
            if (isBefore(date1, date2)) self.filters.minMonth = format(date1, 'YYYY-MM')
            const len = self.filters.months.length
            if (!len) return true
            for (let i = 0; i < len; i++) {
              if (isSameMonth(self.filters.months[i], f.fecha)) return true
            }
            return false
          } else {
            return isWithinRange(f.fecha, self.filters.startDay, self.filters.endDay)
          }
        })
        .map(f => {
          if (!f.exenta) {
            self.totals.gravada10 += parseInt(f.gravada10, 10)
            self.totals.gravada5 += parseInt(f.gravada5, 10)
          }
          return {
            ...f,
            contribuyente: self.getContribuyenteById(f.contribuyenteId)
          }
        })
    }
  },

  watch: {
    'filters.months' (months) {
      if (!months || !months.length) return this.setMonthSelected(new Date())
      const month = months[months.length - 1]
      this.setMonthSelected(parse(month))
    }
  },

  methods: {
    ...mapActions(['deleteFactura', 'setSnack', 'setMonthSelected']),

    showImage (img) {
      this.imgDialog = true
    },

    createItem () {
      this.editFormId = ''
      this.dialog = true
    },

    editItem (item) {
      this.editFormId = item.id
      this.dialog = true
    },

    deleteItem (item) {
      this.deleteFactura(item.id).then(val => this.setSnack(`La factura "${item.title}" ha sido eliminada`))
    },

    getContribuyenteSelected (item) {
      this.contribuyenteSelected = item
    },

    getTimbradoSelected (item) {
      this.timbradoSelected = item
    },

    getRUCby (contribuyente) {
      return `${contribuyente.ruc}-${contribuyente.digitoVerificador}`
    },

    localify (val) {
      return val.toString().toLocaleString('es')
    },

    changeDatepickerType () {
      this.datepickerType = this.datepickerType === 'month' ? '' : 'month'
    },

    downloadJson () {
      let totalEgreso = 0
      const currentYear = (new Date()).getFullYear()
      const egresos = this.facturaItems.map((item, idx) => {
        const egresoMontoTotal = item.gravada10 + item.gravada5 + (item.exenta ? item.monto : 0)
        totalEgreso += egresoMontoTotal
        return {
          'periodo': (currentYear - 1).toString(),
          'tipo': '1', // Tipo FACTURA === '1'
          'relacionadoTipoIdentificacion': 'RUC',
          'fecha': item.fecha,
          'id': idx + 1,
          'ruc': '4010971',
          'egresoMontoTotal': egresoMontoTotal,
          'relacionadoNombres': item.contribuyente.razonSocial ? item.contribuyente.razonSocial.toUpperCase() : '',
          'relacionadoNumeroIdentificacion': item.contribuyente.ruc,
          'timbradoCondicion': item.condicion ? item.condicion.toLowerCase() : '',
          'timbradoDocumento': item.numeroFactura,
          'timbradoNumero': item.numeroTimbrado,
          'tipoEgreso': 'gasto',
          'tipoEgresoTexto': 'Gasto',
          'tipoTexto': 'Factura',
          'subtipoEgreso': 'GPERS',
          'subtipoEgresoTexto': 'Gastos personales y de familiares a cargo realizados en el país'
        }
      })
      downloadObjectAsJson({ totalEgreso, egresos }, 'egresos')
    },

    downloadJsonV2 () {
      let totalEgreso = 0
      const compras = this.facturaItems.map((item, idx) => {
        const date = parse(item.fecha)
        const fecha = format(date, 'DD-MM-YYYY')
        const gravada10 = item.gravada10
        const gravada5 = item.gravada5
        const iva10 = gravada10 / 10
        const iva5 = gravada5 / 20
        const gravada10ConIVA = gravada10 + iva10
        const gravada5ConIVA = gravada5 + iva5
        const exenta = item.exenta ? item.monto : 0
        const totalComprobante = gravada10ConIVA + gravada5ConIVA + exenta
        const nombre = item.contribuyente.razonSocial ? item.contribuyente.razonSocial.toUpperCase() : ''
        const condicion = item.condicion === 'Contado' ? 1 : item.condicion === 'Credito' ? 2 : ''
        const round = (num) => (Math.round((num + Number.EPSILON) * 100) / 100).toLocaleString()
        totalEgreso += totalComprobante
        return {
          'CÓDIGO TIPO DE REGISTRO': 2,
          'CÓDIGO TIPO DE IDENTIFICACIÓN DEL PROVEEDOR/ VENDEDOR': 11,
          'NÚMERO DE IDENTIFICACIÓN DEL PROVEEDOR/VENDEDOR': item.contribuyente.ruc,
          'NOMBRE O RAZÓN SOCIAL DEL PROVEEDOR/ VENDEDOR': nombre,
          'CÓDIGO TIPO DE COMPROBANTE': 109,
          'FECHA DE EMISIÓN DEL COMPROBANTE': fecha,
          'NÚMERO DE TIMBRADO': item.numeroTimbrado,
          'NÚMERO DEL COMPROBANTE': item.numeroFactura,
          'MONTO GRAVADO AL 10%  (IVA INCLUIDO)': round(gravada10ConIVA),
          'MONTO GRAVADO AL 5%  (IVA INCLUIDO)': round(gravada5ConIVA),
          'MONTO NO GRAVADO O EXENTO': exenta,
          'MONTO TOTAL DEL COMPROBANTE': round(totalComprobante),
          'CONDICIÓN DE COMPRA': condicion,
          'OPERACIÓN EN MONEDA EXTRANJERA': 'N',
          'IMPUTA AL IVA': item.exenta ? 'N' : 'S',
          'IMPUTA AL IRE': 'N',
          'IMPUTA AL  IRP-RSP': 'S',
          'NO IMPUTA': 'N',
          'NÚMERO DEL COMPROBANTE DE VENTA ASOCIADO': '',
          'TIMBRADO DEL COMPROBANTE DE VENTA ASOCIADO': '',
          'FECHA': item.fecha,
          'MONTO GRAVADO AL 10%  (SIN IVA)': round(gravada10),
          'MONTO GRAVADO AL 5%  (SIN IVA)': round(gravada5),
          'MONTO IVA AL 10%': round(iva10),
          'MONTO IVA AL 5%': round(iva5)
        }
      })
      downloadObjectAsJson({ totalEgreso, compras }, 'compras')
    }

  }
}

</script>

<style scoped lang="stylus">
.factura-table-container
  padding: 10px 2rem

.selectores-fecha-container,
.v-card-content.tabla-facturas
  overflow: auto
  padding 1rem

.selectores-fecha-container
  height: calc(100vh - 434px)
.v-card-content.tabla-facturas
  height: calc(100vh - 498px)

.right
  display: flex
  justify-content: right

@media (min-width: 1264px) and (max-width: 1904px)
  .pt-lg-4
    padding-top: 24px

</style>
