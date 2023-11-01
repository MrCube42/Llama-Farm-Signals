import { signal, computed, effect } from '@angular/core';
import { ref, watch } from 'vue';

class AngularSignals {
  searchText = signal('');
  filteredLlamas = signal([]);

  resultCount = computed(() => this.filteredLlamas().length);

  searchTextChanged(value: string): void {
    this.searchText.set(value);
  }

  constructor() {
    effect(() => {
      console.log(`Result count changed: ${this.resultCount()}`);
    });
  }
}

function VueCompositionApi() {
  const searchText = ref('');
  const filteredLlamas = ref([]);

  const resultCount = computed(() => filteredLlamas.value.length);

  function searchTextChanged(value: string): void {
    searchText.value = value;
  }

  watch(resultCount, (value) => {
    console.log(`Result count changed: ${value}`);
  });
}
