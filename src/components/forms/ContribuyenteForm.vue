<template lang="pug">
v-form(ref='form', v-model='valid', lazy-validation, style="width: 100%;")
  v-card
    v-card-title
      v-progress-linear(:indeterminate="true" :active="sending")
      span.headline {{form.id ? 'Editar':'Crear'}} Contribuyente
    v-card-text
      v-alert(:value="!!alertMsg" :type="alertType" dismissible) {{alertMsg}}
      v-container(grid-list-md text-xs-center)
        v-layout(row wrap)
          v-flex(xs12)
            v-text-field(v-model='form.razonSocial', :rules='validators.razonSocial', label='Razón Social', required, :disabled="sending")
          v-flex(xs8)
            v-text-field(v-model='form.ruc', :rules='validators.ruc', label='RUC (sin dígito verificador)', :error-messages='errorMessages.ruc', type='number', required, :disabled="sending")
          v-flex(xs4)
            v-text-field(v-model='form.digitoVerificador', :rules='validators.digitoVerificador', label='Dígito verificador', type='number', required, :disabled="sending")
          v-flex(xs12)
            v-text-field(v-model='form.nombreFantasia', label='Nombre de Fantasía', required, :disabled="sending")
          v-flex(xs10)
            .subheading Timbrados
          v-flex(xs2)
            v-tooltip(left)
              template(v-slot:activator="{ on }")
                v-btn(color='success', icon, v-on="on", @click="addTimbrado()")
                  v-icon add
              span Agregar timbrado
          template(v-for='(timbrado, idx) in form.timbrados')
            v-flex(xs3, :key='`numeroTimbrado${idx}`')
              v-text-field(v-model='timbrado.numeroTimbrado', :rules='validators.timbrados.numeroTimbrado', :error-messages='errorMessages.numeroTimbrado[idx]', type='number', label='Número de timbrado', required, :disabled="sending")
            v-flex(xs3, :key='`vigenciaInicio${idx}`')
              datepicker(v-model='timbrado.vigenciaInicio', label='Inicio de vigencia', required, :disabled="sending")
            v-flex(xs3, :key='`vigenciaFin${idx}`')
              datepicker(v-model='timbrado.vigenciaFin', :rules='validators.timbrados.vigenciaFin', label='Fin de vigencia', required, :disabled="sending")
            v-flex(xs3, v-if='shouldBeAbleToRemove')
              v-tooltip(left)
                template(v-slot:activator="{ on }")
                  btn-with-dialog-alert(title='Eliminar timbrado', icon, v-on='on', @on-confirm='deleteTimbrado(idx)')
                    v-icon remove
                span Eliminar timbrado
    v-card-actions
      v-btn(:disabled='!valid', color="success", @click='validate') Guardar
      v-btn(color='blue darken-1', flat, @click='$emit("finished")') Cancelar

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const timbradoForm = {
  numeroTimbrado: '',
  vigenciaInicio: '',
  vigenciaFin: ''
}

const initialForm = {
  ruc: '',
  razonSocial: '',
  digitoVerificador: '',
  nombreFantasia: '',
  timbrados: [{ ...timbradoForm }]
}

export default {
  props: {
    formId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    valid: true,
    sending: false,
    alertMsg: '',
    alertType: 'success',
    form: { ...initialForm },
    validators: {
      ruc: [
        v => !!v || 'Este valor es requerido',
        v => /^[0-9]{6,8}$/.test(v) || 'El valor debe poseer de 6 a 8 números'
      ],
      razonSocial: [
        v => !!v || 'Este valor es requerido'
      ],
      digitoVerificador: [
        v => !!v || 'Este valor es requerido',
        v => /^[0-9]{1}$/.test(v) || 'Debe cargar un solo número'
      ],
      timbrados: {
        numeroTimbrado: [
          v => !!v || 'Este valor es requerido',
          v => !!/^[0-9]{8}$/.test(v) || 'El valor debe poseer de 8 números'
        ],
        vigenciaFin: [
          v => !!v || 'Este valor es requerido'
        ]
      }
    },
    errorMessages: {
      ruc: [],
      numeroTimbrado: []
    }
  }),
  computed: {
    ...mapGetters(['contribuyentes', 'getContribuyenteById', 'userSelected']),
    shouldBeAbleToRemove () {
      return this.form.timbrados.length !== 1
    }
  },
  watch: {
    formId () {
      this.loadFormById()
    },
    'form.ruc' (val) {
      const errors = []
      if (this.formId) this.contribuyentes.find(c => c.id !== this.formId && c.ruc === val) && errors.push('Este ruc ya existe')
      else this.contribuyentes.find(c => c.ruc === val) && errors.push('Este ruc ya existe')
      this.errorMessages.ruc = errors
    },
    'form.timbrados': {
      handler (timbrados) {
        const errors = []
        timbrados.forEach((tim, idx) => {
          for (let i = idx + 1, len = timbrados.length; i < len; i++) {
            let timbrado = timbrados[i]
            if (timbrado.numeroTimbrado === tim.numeroTimbrado) {
              if (!errors[i]) errors[i] = []
              return errors[i].push('Este número de timbrado ya existe')
            }
          }
        })
        this.errorMessages.numeroTimbrado = errors
      },
      deep: true
    }
  },
  mounted () {
    this.loadFormById()
  },
  methods: {
    ...mapActions(['saveContribuyente', 'setSnack']),
    changeFiles (files) {
      this.form.mediaFiles = files
    },
    validate () {
      this.alertMsg = ''
      if (this.$refs.form.validate()) {
        this.sending = true
        this.form.userId = this.userSelected.uid
        this.saveContribuyente(this.form)
          .then(data => {
            this.sending = false
            this.setSnack(`El Contribuyente fue ${this.form.id ? 'editado' : 'creado'} satisfactoriamente`)
            this.$emit('finished', data)
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
        this.form = this.getContribuyenteById(this.formId)
      } else {
        this.form = { ...initialForm, timbrados: [{ ...timbradoForm }] }
      }
    },
    addTimbrado () {
      this.form.timbrados.push({ ...timbradoForm })
    },
    deleteTimbrado (idx) {
      const len = this.form.timbrados.length - 1
      for (let i = idx; i < len; i++) {
        this.form.timbrados[i] = this.form.timbrados[i + 1]
      }
      this.form.timbrados.splice(len)
    }
  }
}

</script>
