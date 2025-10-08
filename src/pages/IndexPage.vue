<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Basic Form</div>
            <div class="text-subtitle2">Fill the form and submit</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onSubmit" ref="formRef">
              <q-input v-model="form.name" label="Name" :rules="[val => !!val || 'Name is required']" />

              <q-input v-model="form.email" label="Email" type="email" :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']" />

              <q-select v-model="form.gender" label="Gender" :options="[{label:'Male', value:'male'},{label:'Female', value:'female'}]" />

              <q-toggle v-model="form.accept" label="I accept the terms" />

              <div class="row q-gutter-sm q-mt-md">
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn label="Reset" color="secondary" flat @click="onReset" />
              </div>
            </q-form>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-caption">Form Data (debug)</div>
            <pre>{{ form }}</pre>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref(null)

const form = ref({
  name: '',
  email: '',
  gender: null,
  accept: false,
})

function onSubmit () {
  // Basic validation: ensure formRef validates
  // Quasar's q-form doesn't expose a direct validate() in this setup but we keep handler simple
  if (!form.value.name || !form.value.email) {
    // show a browser alert as fallback
    alert('Please fill required fields')
    return
  }

  // In a real app we'd send this to a server
  // For demo, show success
  // Use console.log and an alert
  console.log('Form submitted', form.value)
  alert('Form submitted — check console for payload')
}

function onReset () {
  form.value = { name: '', email: '', gender: null, accept: false }
}
</script>
