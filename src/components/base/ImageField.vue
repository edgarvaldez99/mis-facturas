<template lang="pug">
  div
    img(
      v-if="hasFiles"
      v-for="(img, idx) in files"
      ref="fileImages"
      :id="`file-image-${idx}`"
      :src="getImageSrcIfExist(idx)"
      width="100%"
    )
    img(
      v-if="!hasFiles"
      id="file-image"
      :src="src"
      width="100%"
    )

    file-field(
      v-model="model"
      :label="label"
      :accept="accept"
      :color="color"
      :disabled="disabled"
      :prepend-icon="prependIcon"
      :rules="rules"
      :clearable="clearable"
      :multiple="multiple"
      :required="required"
      :error-messages="errorMessages"
      @change="$emit('change', $event)"
      @change-files="changeFiles"
    )

</template>

<script>
import vmodelMixin from '@/mixins/v-model-for-custom-input-controls.js'

export default {
  name: 'ImageField',
  mixins: [ vmodelMixin ],
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    multiple: Boolean,
    prependIcon: {
      type: String,
      default: 'attachment'
    },
    errorMessages: {
      type: Array,
      default: () => ([])
    },
    src: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    files: []
  }),
  computed: {
    hasFiles () {
      return !!this.files.length
    }
  },
  methods: {
    changeFiles (files) {
      this.files = files
      this.$emit('change-files', files)
    },
    getImageSrcInFile (file) {
      return new Promise((resolve, reject) => {
        if (!file) return reject(new Error('File not found'))
        if (!FileReader) return reject(new Error('FileReader not supported'))
        const fr = new FileReader()
        fr.onload = () => resolve(fr.result)
        fr.readAsDataURL(file)
        if (fr.result) resolve(fr.result)
      })
    },
    getImageSrcIfExist (idx) {
      const self = this
      const file = self.files[idx]
      if (file) {
        self.getImageSrcInFile(file).then(imgSrc => {
          if (imgSrc) self.$refs.fileImages[idx].src = imgSrc
        })
      }
      return self.src
    }
  }
}
</script>
