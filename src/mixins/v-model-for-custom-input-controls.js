import diff from 'deep-diff'

export default {
  props: {
    value: null,
    color: String,
    label: String,
    disabled: Boolean,
    required: Boolean,
    clearable: Boolean,
    rules: Array
  },
  data: () => ({
    model: null
  }),
  created () {
    this.model = this.value
  },
  watch: {
    value: {
      handler (val) {
        if (diff(val, this.model)) {
          this.model = val
        }
      },
      deep: true
    },
    model: {
      handler (val) {
        if (diff(val, this.value)) {
          this.$emit('input', val)
        }
      },
      deep: true
    }
  }
}
