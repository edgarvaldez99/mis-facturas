<template lang="pug">
v-form(ref='form', v-model='valid', lazy-validation, style='width: 100%;')
  v-card
    v-card-title
      v-progress-linear(:indeterminate='true' :active='sending')
      span.headline {{form.id ? 'Editar':'Crear'}} Factura
    v-card-text
      v-alert(:value='!!alertMsg' :type='alertType' dismissible) {{alertMsg}}
      v-autocomplete(v-model='form.contribuyenteId', label='Contribuyente', :items='contribuyenteItems', item-text='text', item-value='id', :search-input.sync='autocomplete.contribuyenteSearch', :disabled='sending')
        template(v-slot:append-outer)
          v-tooltip(left)
            template(v-slot:activator='{ on }')
              v-btn.ma-0(color='success', icon, v-on='on', @click='createContribuyente')
                v-icon add
            span Agregar nuevo contribuyente
        template(v-slot:no-data)
          v-list-tile
            v-list-tile-content
              v-list-tile-title No hay contribuyente que coincida con su busqueda ¿ Desea crearlo ?
            v-list-tile-action
              v-tooltip(left)
                template(v-slot:activator='{ on }')
                  v-btn(color='success', icon, v-on='on', @click='createContribuyente')
                    v-icon add
                span Agregar nuevo contribuyente
      v-autocomplete(v-model='form.numeroTimbrado', label='Timbrado', :items='timbradoItems', item-text='numeroTimbrado', :error-messages='errorMessages.numeroTimbrado', :search-input.sync='autocomplete.timbradoSearch', type='number', :disabled='!form.contribuyenteId || sending')
      v-text-field(v-model='form.numeroFactura', ref='numeroFacturaField', :rules='validators.numeroFactura', :error-messages='errorMessages.numeroFactura', label='Número de Factura', mask='nnn-nnn-nnnnnnn', return-masked-value, required, :disabled='sending')
      datepicker(v-model='form.fecha' :rules='validators.fecha', :error-messages='errorMessages.fecha' label='Fecha', required, :disabled='sending')
      v-radio-group(v-model='form.condicion')
        v-radio(v-for='(condicion, idx) in condiciones' :key='`condicion${idx}`' :label='condicion' :value='condicion')
      v-switch(v-model='form.exenta', label='Excenta')
      v-divider.pt-2
      v-text-field(v-model='calculated.valorIVAincluido', label='Valor con IVA incluido', v-if='!form.exenta', type='number', :disabled='sending')
      v-btn.mb-2(v-if='!form.exenta' v-for='(iva, idx) in tiposIVA' :key='`tipoIVA${idx}`' @click='convertGravada(iva)') Convertir a gravada {{iva}}
      v-divider.pt-2
      v-text-field(v-model='form.gravada10', :rules='validators.gravada10', label='Gravadas 10%', type='number', v-if='!form.exenta', required, :disabled='sending')
      v-text-field(v-model='form.gravada5', :rules='validators.gravada5', label='Gravadas 5%', type='number', v-if='!form.exenta', required, :disabled='sending')
      v-text-field(v-model='calculated.iva10', label='IVA 10%', type='number', v-if='!form.exenta', readonly, :disabled='sending')
      v-text-field(v-model='calculated.iva5', label='IVA 5%', type='number', v-if='!form.exenta', readonly, :disabled='sending')
      v-text-field(v-model='form.monto', label='Monto', type='number', :readonly='!form.exenta', :disabled='sending')
    v-card-actions
      div
        div
          v-btn(:disabled='!valid', color='success', @click='validate({})') Guardar y agregar para este contribuyente
        .mt-2
          v-btn(:disabled='!valid', color='success', @click='validate({ other: true })') Guardar y agregar otro
        .mt-2
          v-btn(:disabled='!valid', color='success', @click='validate({ saveAndClose: true })') Guardar
          v-btn(color='blue darken-1', flat, @click='$emit("finished")') Cancelar

  v-dialog(v-model='createContribuyenteDialog', ref='createContribuyenteDialog', persistent, scrollable, max-width='80vw')
    ContribuyenteForm(v-if='createContribuyenteDialog' @finished='getContribuyenteAndCloseDialog')

</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { format, isBefore, isAfter, parse } from 'date-fns'

const condiciones = ['Contado', 'Crédito']

const tiposIVA = ['10%', '5%']

const initialForm = {
  contribuyenteId: '',
  numeroTimbrado: '',
  numeroFactura: '',
  fecha: format(new Date(), 'YYYY-MM-DD'),
  condicion: condiciones[0],
  exenta: false,
  gravada10: 0,
  gravada5: 0,
  monto: 0
}

export default {
  components: {
    ContribuyenteForm: _ => import('@/components/forms/ContribuyenteForm')
  },
  props: {
    formId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      valid: true,
      sending: false,
      createContribuyenteDialog: false,
      alertMsg: '',
      alertType: 'success',
      form: this.getInitialForm(),
      validators: {
        contribuyenteId: [
          v => !!v || 'Este valor es requerido'
        ],
        numeroTimbrado: [
          v => !!v || 'Este valor es requerido'
        ],
        numeroFactura: [
          v => !!v || 'Este valor es requerido',
          v => /^[0-9]{3}-[0-9]{3}-[0-9]{7}$/.test(v) || 'El número de factura es invalido'
        ],
        fecha: [
          v => !!v || 'Este valor es requerido'
        ]
      },
      errorMessages: {
        numeroTimbrado: [],
        numeroFactura: [],
        fecha: [],
        monto: []
      },
      autocomplete: {
        contribuyenteSearch: '',
        contribuyenteSelected: '',
        timbradoSearch: '',
        timbradoSelected: ''
      },
      calculated: {
        valorIVAincluido: 0,
        tipoIVA: '10%',
        iva10: 0,
        iva5: 0
      }
    }
  },
  computed: {
    ...mapGetters(['contribuyentes', 'facturas', 'getContribuyenteById', 'getFacturaById', 'userSelected', 'monthSelected']),
    contribuyenteItems () {
      return this.contribuyentes.map(c => ({ ...c, text: `${c.razonSocial} ${c.nombreFantasia ? '(' + c.nombreFantasia + ')' : ''} ${c.ruc}-${c.digitoVerificador}` }))
    },
    timbradoItems () {
      return this.autocomplete.contribuyenteSelected.timbrados
    },
    condiciones () {
      return condiciones
    },
    tiposIVA () {
      return tiposIVA
    }
  },
  watch: {
    formId () {
      this.loadFormById()
    },
    'form.contribuyenteId' (id) {
      if (!id) return
      this.autocomplete.contribuyenteSelected = this.getContribuyenteById(id)
      setTimeout(_ => this.loadDataFromContribuyente(this.autocomplete.contribuyenteSelected))
    },
    'form.numeroTimbrado' (val) {
      if (!val) return
      this.autocomplete.timbradoSelected = this.timbradoItems.find(t => t.numeroTimbrado === val)
      setTimeout(_ => this.validateNumeroTimbrado())
    },
    'form.numeroFactura' (val) {
      const errors = []
      if (this.formId) this.facturas.find(c => c.id !== this.formId && c.numeroFactura === val) && errors.push('Este número de factura ya existe')
      else this.facturas.find(c => c.numeroFactura === val) && errors.push('Este número de factura ya existe')
      this.errorMessages.numeroFactura = errors
    },
    'form.fecha' () {
      this.validateNumeroTimbrado()
    },
    'form.gravada10' (val) {
      this.calculated.iva10 = Math.round(val * 0.1)
      this.loadMontoTotal()
    },
    'form.gravada5' (val) {
      this.calculated.iva5 = Math.round(val * 0.05)
      this.loadMontoTotal()
    },
    'form.monto' () {
      const errors = []
      this.form.exenta && !this.form.monto && errors.push('El monto es requerido')
      this.errorMessages.monto = errors
    }
  },
  mounted () {
    this.loadFormById()
  },
  methods: {
    ...mapActions(['setSnack', 'saveFactura']),
    createContribuyente () {
      this.createContribuyenteDialog = true
      setTimeout(_ => this.$refs.createContribuyenteDialog.$el.click())
    },
    getInitialForm () {
      if (!this.monthSelected) return { ...initialForm }
      return {
        ...initialForm,
        fecha: format(this.monthSelected, 'YYYY-MM-DD')
      }
    },
    getLastNumeroTimbrado (contribuyente) {
      let numeroTimbrado
      let dateCompare = new Date()
      contribuyente.timbrados.forEach((tim, idx, list) => {
        if (isAfter(tim.vigenciaFin, dateCompare)) {
          dateCompare = parse(tim.vigenciaFin)
          numeroTimbrado = tim.numeroTimbrado
        }
      })
      return numeroTimbrado
    },
    getLastNumeroFactura (contribuyente) {
      let numeroFactura
      let dateCompare = parse('1970-01-01')
      this.facturas.forEach((f, idx, list) => {
        if (f.contribuyenteId === contribuyente.id && isAfter(f.fecha, dateCompare)) {
          dateCompare = parse(f.fecha)
          numeroFactura = f.numeroFactura
        }
      })
      return numeroFactura
    },
    getContribuyenteAndCloseDialog (data) {
      if (data) this.loadDataFromContribuyente(data)
      this.createContribuyenteDialog = false
    },
    changeFiles (files) {
      this.form.mediaFiles = files
    },
    validate ({ saveAndClose, other }) {
      this.alertMsg = ''
      if (this.$refs.form.validate()) {
        this.sending = true
        this.form.userId = this.userSelected.uid
        this.saveFactura(this.form)
          .then(_ => {
            this.sending = false
            this.setSnack(`La factura fue ${this.form.id ? 'editada' : 'creada'} satisfactoriamente`)
            if (saveAndClose) return this.$emit('finished')
            if (other) {
              this.form = this.getInitialForm()
            }
          })
          .catch(err => {
            this.sending = false
            this.alertMsg = err.message
            this.alertType = 'error'
          })
      }
    },
    loadFormById () {
      if (this.formId) {
        this.form = this.getFacturaById(this.formId)
        this.form.gravada10 = parseInt(this.form.gravada10, 10)
        this.form.gravada5 = parseInt(this.form.gravada5, 10)
      } else {
        this.form = this.getInitialForm()
      }
    },
    loadDataFromContribuyente (contribuyente) {
      this.form.contribuyenteId = contribuyente.id
      if (!this.form.numeroTimbrado) this.form.numeroTimbrado = this.getLastNumeroTimbrado(contribuyente)
      if (!this.form.numeroFactura) this.form.numeroFactura = this.getLastNumeroFactura(contribuyente)
      this.$refs.numeroFacturaField.focus()
    },
    convertGravada (tipoIVA) {
      switch (tipoIVA) {
        case '5%':
          this.form.gravada5 = Math.round(this.calculated.valorIVAincluido / 1.05)
          break
        case '10%':
        default:
          this.form.gravada10 = Math.round(this.calculated.valorIVAincluido / 1.1)
          break
      }
    },
    loadMontoTotal () {
      this.form.monto = this.form.gravada10 + this.form.gravada5 + this.calculated.iva10 + this.calculated.iva5
    },
    validateNumeroTimbrado () {
      const errors = []
      this.form.fecha && isAfter(this.form.fecha, this.autocomplete.timbradoSelected.vigenciaFin) && errors.push('El timbrado ya está vencido')
      this.form.fecha && this.autocomplete.timbradoSelected.vigenciaInicio && isBefore(this.form.fecha, this.autocomplete.timbradoSelected.vigenciaInicio) && errors.push('El timbrado todavía no está en vigencia')
      this.errorMessages.fecha = errors
    }
  }
}

</script>
