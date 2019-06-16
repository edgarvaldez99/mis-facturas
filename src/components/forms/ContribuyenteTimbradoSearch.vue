<template lang="pug">
v-layout(v-if="timbrados.length")
  v-flex(xs12 md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3)
    v-card(max-width='1000px' style="margin-bottom: 20px;")
      v-card-title
        .title Lista de Timbrados
        v-spacer
        v-text-field(
          v-model='search'
          append-icon='search'
          label='Search'
          single-line
          hide-details
          style="float: right; margin-right: 20px;"
        )

      v-data-table.elevation-1(:headers='headers', :items='timbrados', :search='search')
        template(v-slot:items='props')
          tr(@click="selectItem(props.item)")
            td.text-xs-center {{ props.item.numeroTimbrado }}
            td.text-xs-center {{ props.item.vigenciaInicio }}
            td.text-xs-center {{ props.item.vigenciaFin }}
        template(v-slot:no-results)
          v-alert(:value='true' color='error' icon='warning') La busqueda "{{ search }}" no tuvo resultados.
        template(v-slot:no-data)
          v-alert(:value="true" color="error" icon="warning") No hay contribuyentes disponibles

</template>

<script>
export default {
  props: {
    timbrados: {
      type: Array,
      default: _ => ([])
    }
  },
  data: () => ({
    headers: [
      { text: 'Número de timbrado', align: 'center', value: 'numeroTimbrado' },
      { text: 'Inicio de vigencia', align: 'center', value: 'vigenciaInicio' },
      { text: 'Fin de vigencia', align: 'center', value: 'vigenciaFin' }
    ],
    search: ''
  }),

  methods: {
    selectItem (item) {
      this.$emit('selected', item)
    }
  }
}

</script>
