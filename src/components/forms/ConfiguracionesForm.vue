<template lang="pug">
v-form(ref='form', v-model='valid', lazy-validation, style="width: 100%;")
  v-card
    v-card-title
      v-progress-linear(:indeterminate="true" :active="sending")
      span.headline Editar configuraciones
    v-card-text
      v-alert(:value="!!alertMsg" :type="alertType" dismissible) {{alertMsg}}
      v-container(grid-list-md text-xs-center)
        v-layout(row wrap)
          v-flex(xs12)
            v-text-field(v-model='form.adminEmail', :rules='validators.adminEmail', label='Formato del correo de Administradores', required, :disabled="sending")
    v-card-actions
      v-btn(:disabled='!valid', color="success", @click='validate') Guardar
      v-btn(color='blue darken-1', flat, @click='$emit("finished")') Cancelar

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const initialForm = {
  adminEmail: ''
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
      adminEmail: [
        v => !!v || 'Este valor es requerido',
        v => /.+@.+/.test(v) || 'El correo es invalido'
      ]
    },
    errorMessages: {
      ruc: [],
      numeroTimbrado: []
    }
  }),
  computed: {
    ...mapGetters(['configuraciones'])
  },
  methods: {
    ...mapActions(['saveContribuyente', 'setSnack']),
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
    }
  }
}

</script>
