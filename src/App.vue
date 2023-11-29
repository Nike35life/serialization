<script setup>
import { ref, computed } from 'vue';

const activeTab = ref(0);

const initialArray = ref([]);
initialArray.value = new Array(1000).fill(1).map(() => parseInt(Math.random() * 300));

const dataArray = computed({
  set: (newValue) => {
    if (!Array.isArray(newValue)) {
      initialArray.value = newValue.split(',');
      return newValue.split(',');
    }
    return newValue;
  },
  get: () => {
    return initialArray.value;
  },
});

/* UTF-16 Serialisation */
const serialisation = computed(() => {
  let serialized = '';
  for (let i = 0; i < dataArray.value.length; i++) {
    serialized += String.fromCharCode(dataArray.value[i]);
  }
  return serialized;
});
const deserialisation = computed(() => {
  let deserialized = [];
  for (let i = 0; i < serialisation.value.length; i++) {
    deserialized.push(serialisation.value.charCodeAt(i));
  }
  return deserialized;
});

/* Equal Serialisation */
const equalityArray = computed(() => {
  let equalTemp = Array.from(dataArray.value);
  let equalityArray = [];

  dataArray.value.forEach((element, index) => {
    let entires = 0;

    while (equalTemp.includes(element)) {
      entires++;
      equalTemp.splice(equalTemp.lastIndexOf(element), 1);
    }
    if (entires !== 0) {
      return equalityArray.push(entires + '.' + element);
    }
  });

  return equalityArray;
});
const deequalisator = computed(() => {
  let deserializedArray = [];

  equalityArray.value.forEach((element) => {
    for (let i = 0; i < parseInt(element.split('.')[0]); i++) {
      deserializedArray.push(parseInt(element.split('.')[1]));
    }
  });

  return deserializedArray;
});

/* Colorfull Serialisation */
const colorTriples = computed(() => {
  let triplesArray = [];
  let hexColor = '#';

  dataArray.value.forEach((element, index) => {
    let elemMod = parseInt(element);
    if (elemMod > 255) {
      elemMod = elemMod - 300;
    }

    let hex = elemMod.toString(16);
    if (hex.includes('-')) {
      hex = hex.length === 2 ? '-0' + hex.substring(1) : hex;
    } else {
      hex = hex.length === 1 ? '0' + hex : hex;
    }
    hexColor += hex;

    if (!((index + 1) % 3)) {
      triplesArray.push(hexColor);
      hexColor = '#';
    }
  });

  if (hexColor !== '#') {
    triplesArray.push(hexColor);
    hexColor = '#';
  }

  return triplesArray;
});

const parseColors = computed(() => {
  let decoded = [];
  let position = 0;

  colorTriples.value.forEach((element) => {
    let hex = element.replace('#', '');
    for (let i = 0; i < parseInt(hex.length / 2); i++) {
      if (hex.includes('-')) {
        if (hex[position] === '-') {
          if (!!hex.substring(position, position + 3)) {
            decoded.push(hex.substring(position, position + 3));
            position += 3;
          }
        } else {
          if (!!hex.substring(position, position + 2)) {
            decoded.push(hex.substring(position, position + 2));
            position += 2;
          }
        }
      } else {
        if (!!hex.substring(position, position + 2)) {
          decoded.push(hex.substring(position, position + 2));
          position += 2;
        }
      }
    }
    position = 0;
  });

  decoded = decoded.map((element) => {
    let decimal = parseInt(element, 16);

    if (decimal > 0) {
      return decimal;
    } else {
      return decimal + 300;
    }
  });

  return decoded;
});
</script>

<template>
  <h1>Serialisation Test by Nikita Shapovalov</h1>
  <hr />
  <h2>Initial data</h2>
  <textarea
    cols="175"
    rows="20"
    v-model="dataArray"></textarea>
  <div class="center">
    <button @click="activeTab = 0">UTF-16 Serialisation</button>
    <button @click="activeTab = 1">Equal Serialisation</button>
    <button @click="activeTab = 2">Colorfull Serialisation</button>
  </div>
  <!-- utf-16 tab -->
  <div v-if="activeTab === 0">
    <h2>Serialised data</h2>
    <hr />
    <table border="1">
      <tr>
        <td>initial string length</td>
        <td>serialized string length</td>
        <td>compress rate</td>
      </tr>
      <tr>
        <td>{{ dataArray.toString().replaceAll(',', '').length }}</td>
        <td>{{ serialisation.toString().length }}</td>
        <td>{{ 100 - parseInt((serialisation.toString().length / dataArray.toString().replaceAll(',', '').length) * 100) }}%</td>
      </tr>
    </table>
    <br />
    <div class="serialised">{{ serialisation }}</div>
    <h2>Deserialised data</h2>
    <div>{{ deserialisation }}</div>
  </div>
  <!-- equality tab -->
  <div v-if="activeTab === 1">
    <h2>Serialised data</h2>
    <hr />
    <table border="1">
      <tr>
        <td>initial string length</td>
        <td>serialized string length</td>
        <td>compress rate</td>
      </tr>
      <tr>
        <td>{{ dataArray.toString().replaceAll(',', '').length }}</td>
        <td>{{ equalityArray.toString().length }}</td>
        <td>{{ 100 - parseInt((equalityArray.toString().length / dataArray.toString().replaceAll(',', '').length) * 100) }}%</td>
      </tr>
    </table>
    <br />
    <div class="serialised">{{ equalityArray }}</div>
    <h2>Deserialised data</h2>
    <div>{{ deequalisator }}</div>
  </div>
  <!-- colorfull tab -->
  <div v-if="activeTab === 2">
    <h2>Serialised data</h2>
    <hr />
    <table border="1">
      <tr>
        <td>initial string length</td>
        <td>serialized string length</td>
        <td>compress rate</td>
      </tr>
      <tr>
        <td>{{ dataArray.toString().replaceAll(',', '').length }}</td>
        <td>{{ colorTriples.toString().replaceAll(',', '').length }}</td>
        <td>{{ 100 - parseInt((colorTriples.toString().replaceAll(',', '').length / dataArray.toString().replaceAll(',', '').length) * 100) }}%</td>
      </tr>
    </table>
    <br />
    <div class="colorWrapper">
      <div
        v-for="color in colorTriples"
        :style="{ background: color.replaceAll('-', '') }"
        :data-color="color"
        class="colorPalets"></div>
    </div>
    <h2>Deserialised data</h2>
    <div>{{ parseColors }}</div>
  </div>
</template>

<style scoped>
* {
  word-wrap: break-word;
}
textarea {
  width: 100%;
}
.center {
  padding: 15px;
  text-align: center;
  background: red;
}
.serialised {
  background: rgba(0, 202, 0, 0.44);
  border: 1px solid #000;
}
.colorWrapper {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  border: 1px solid #000;
}
.colorPalets {
  width: 30px;
  height: 30px;
}
</style>
