<template lang="pug">
v-layout(align-center justify-center)
  v-flex(xs12 sm8 md4)
    v-progress-linear(:indeterminate="true" :active="sending")
    v-alert(:value="!!error" type="error") {{error}}
    v-card
      v-card-text
        v-form(ref='form', v-model='valid', lazy-validation)
          v-text-field(v-model='form.email', :rules='validators.email', label='Correo electrónico', required, :disabled="sending")
          v-text-field(v-model='form.password', type="password", :counter='6', :rules='validators.password', label='Contraseña', required, :disabled="sending")
          v-btn(:disabled='!valid', color='success', @click='validate') Iniciar sesión
          v-btn(color='#d34836', @click='loginWithGoogle') Iniciar con Google

</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    error: '',
    valid: true,
    sending: false,
    form: {
      email: '',
      password: ''
    },
    validators: {
      email: [
        v => !!v || 'El correo es requerido',
        v => /.+@.+/.test(v) || 'El correo es invalido'
      ],
      password: [
        v => !!v || 'La contraseña es requerida',
        v => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
      ]
    }
  }),
  methods: {
    ...mapActions([ 'userLogin', 'loginWithGoogle' ]),
    validate () {
      this.error = ''
      if (this.$refs.form.validate()) {
        this.sending = true
        this.userLogin(this.form)
          .then(_ => {
            this.sending = false
            this.$router.push({ name: 'forms' })
          })
          .catch(err => {
            this.sending = false
            this.error = err.message
          })
      }
    }
  }
}

</script>
