<script setup>
let dataArray = new Array(1000).fill(1).map(() => parseInt(Math.random() * 300));

const Serialization = (dataElement) => {
  let serialized = '';
  for (let i = 0; i < dataElement.length; i++) {
    serialized += String.fromCharCode(dataElement[i]);
  }
  return serialized;
};

const Deserialization = (dataSerialized) => {
  let deserialized = [];
  for (let i = 0; i < dataSerialized.length; i++) {
    deserialized.push(dataSerialized.charCodeAt(i));
  }
  return deserialized;
};

const Tests = () => {
  return dataArray;
  /* console.log(dataArray); */
  /* console.log(Serialization(dataArray)); */
};

module.exports = (function () {
  return {
    initialData: dataArray,
    serialized: Serialization(dataArray),
    deserialized: Deserialization(Serialization(dataArray)),
  };
})();
</script>
