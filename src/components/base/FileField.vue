<template lang="pug">
  div
    v-text-field(
      v-model="model"
      :label="label"
      :color="color"
      :disabled="disabled"
      :prepend-icon="prependIcon"
      :rules="rules"
      :clearable="clearable"
      :multiple="multiple"
      @click.stop="pickFile"
      @blur="$emit('blur', $event)"
    )
    input(type="file" style="display: none" ref="image" :accept="accept" :multiple="multiple" :error-messages="errorMessages" @change="onFilePicked")

</template>

<script>
import vmodelMixin from '@/mixins/v-model-for-custom-input-controls.js'

export default {
  name: 'FileField',
  mixins: [ vmodelMixin ],
  props: {
    accept: {
      type: String,
      default: ''
    },
    multiple: Boolean,
    clearable: Boolean,
    prependIcon: {
      type: String,
      default: 'attachment'
    },
    errorMessages: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (event) {
      const files = event.target.files
      const fileNames = []
      for (let i = 0, len = files.length; i < len; i++) {
        const file = files.item(i)
        fileNames.push(file.name)
      }
      this.$emit('change', event)
      this.$emit('change-files', Array.from(files))
      setTimeout(() => { this.model = fileNames.join(', ') })
    }
  }
}
</script>
