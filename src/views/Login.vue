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
          v-text-field(v-if='signUp', v-model='form.confirmPassword', type="password", :counter='6', :rules='validators.confirmPassword', :error-messages='errorMessages.confirmPassword', label='Confirmar contraseña', required, :disabled="sending")
          v-btn(:disabled='!valid', color='success', @click='validate') {{ signUp ? 'Crear cuenta' : 'Iniciar sesión' }}
          v-btn(color='#d34836', @click='loginWithGoogle') Iniciar con Google
          div
            v-btn(v-if='!signUp' @click='signUp = true') Registrarse
            v-btn(v-if='signUp' @click='signUp = false') Ingresar

</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    error: '',
    valid: true,
    sending: false,
    signUp: false,
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
      ],
      confirmPassword: [
        v => !!v || 'La contraseña es requerida',
        v => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
      ]
    },
    errorMessages: {
      confirmPassword: []
    }
  }),
  watch: {
    'form.confirmPassword' (val) {
      const errors = []
      this.form.password !== this.form.confirmPassword && errors.push('Ambas contraseñas no coinciden')
      this.errorMessages.confirmPassword = errors
    }
  },
  methods: {
    ...mapActions([ 'createUser', 'userLogin', 'loginWithGoogle' ]),
    validate () {
      this.error = ''
      if (this.$refs.form.validate()) {
        this.sending = true
        if (this.signUp) {
          this.createUser(this.form)
            .then(user => {
              this.sending = false
              this.$router.push({ name: 'forms' })
            })
            .catch(err => {
              this.sending = false
              this.error = err.message
            })
        } else {
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
}

</script>
