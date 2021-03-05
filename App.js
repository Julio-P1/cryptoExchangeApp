import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';


export default function App() {

  const [cryptoCoin, setCryptoCoin] = useState([]);
  const [cryptoActual, setCryptoActual] = useState('');

  const [monedaLocal, setMonedaLocal] = useState('');
  const [resultado, setResultado] = useState(' ');

  //promise para cargar cripto monedas
  let cryptoCurrencyArray = [];
  useEffect( () => {
    fetch('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD')
    .then(response => response.json())
    .then(data => {
      let cryptoInfo = data.Data;
      //console.log("JSON: " + cryptoInfo.length)
      //console.log(cryptoInfo);
      cryptoInfo.forEach(element => {
        cryptoCurrencyArray.push(element.CoinInfo.Name);
        //console.log(element);
      });
      
      setCryptoCoin(cryptoCurrencyArray);
    });
  }, []);

  // Array para picker de cryptoCoins
  let arrPickerItems = [];
  cryptoCoin.map((item, index) => {
    if(item != undefined) {
      arrPickerItems.push(<Picker.Item label={item} value={item} key={index}/>)
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.Resultado}>  1 {cryptoActual} = {resultado} {monedaLocal} </Text>

      {/* Picker para las top 10 cripto-monedas de hoy */}
      <Picker 
      style={styles.cryptoPicker}
        selectedValue={cryptoActual}
        onValueChange={(itemValue, itemIndex) => {
          setCryptoActual(itemValue)
          
        }}
      
      >
        {arrPickerItems}

      </Picker>

      <Picker
        style={styles.monedaLocalPicker}
        selectedValue={monedaLocal}
        onValueChange={(itemValue, itemIndex) => {
          setMonedaLocal(itemValue)
        }}
      >
        <Picker.Item label='USD' value='USD' />
        <Picker.Item label='GBP' value='GBP' />
        <Picker.Item label='EUR' value='EUR' />
        <Picker.Item label='JPY' value='JPY' />
        <Picker.Item label='GTQ' value='GTQ' />
      </Picker>

      <View style={{marginTop: 15, fontWeight: 'bold'}}>
        <Button
        title="Convertir"
        onPress={() => {
          {/*setResultado(JSON.stringify(operarConversion(cryptoActual, monedaLocal)))*/}
          const URL = `https://min-api.cryptocompare.com/data/price?fsym=${cryptoActual}&tsyms=${monedaLocal}`;
          let resultado = " ";
          fetch(URL)
            .then(response => response.json())
            .then(datos => {
              //console.log(datos);
              resultado = datos;
              //console.log(resultado);
              let obj = resultado;
              let attrName;
              let attrValue;
              for (let key in obj) {
                attrName = key;
                attrValue = obj[key]
              }
              setResultado(attrValue)
            })
          
        }}
        /> 
      </View>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  Resultado: {
    height: 25,
    width: '65%',
    marginBottom: 10,
    fontSize: 18,
    fontFamily: 'AlNile-Bold',
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
    textAlign: 'center'
  },
  
  cryptoPicker:{
    height:50,
    width: '50%',
    fontWeight: 'bold',
    backgroundColor: 'lightgray',
    borderBottomColor: '#000',
    borderBottomWidth: 2,
    marginBottom: 25
    
  },

  monedaLocalPicker: {
    height:50,
    width: '50%',
    fontWeight: 'bold',
    backgroundColor: 'lightgray',
    borderBottomColor: '#000',
    borderBottomWidth: 2
  },

  container: {
    flex: 1,
    backgroundColor: '#4682b4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
