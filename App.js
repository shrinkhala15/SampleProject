/*Example of Making PDF from HTML in React Native*/
import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { WebView } from 'react-native-webview';
import FileViewer from 'react-native-file-viewer';

export default class App extends Component {
  state = {
      filePath: '',
      html: '',
      check : false
    };
  constructor(props) {
    super(props);
  }

  askPermission() {
    var that = this;
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'CameraExample App External Storage Write Permission',
            message:
              'CameraExample App needs access to Storage data in your SD Card ',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //If WRITE_EXTERNAL_STORAGE Permission is granted
          //changing the state to show Create PDF option
          // that.createPDF();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        alert('Write permission err', err);
        console.warn(err);
      }
    }
    //Calling the External Write permission function
    this.setState({check: true});
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    }
    //  else {
    //   this.createPDF();
    // }
  }

   createPDF = async () =>  {
     try {
      let options = {
        //Content to print
        html: this.state.html,
        //File Name
        fileName: 'test',
        //File directory
        directory: 'docs',
      };
      console.log("---------options------", options);
      let file = await RNHTMLtoPDF.convert(options);
      console.log("-------filePath------", file.filePath);
      this.setState({filePath: file.filePath, check: false});

      // this.setState({filePath: file.filePath});
     
      FileViewer.open(file.filePath)
      .then(() => {
        console.log("-----File Displayed Successfully------");
      })
      .catch(error => {
        console.log("-----error in file Viewer------", error);
      });

     } catch (error) {
       console.log("-----error in file Creation------", error);
     }
    
  }

  handleMessage = (message) => {
    console.log("--------",message.nativeEvent.data );
    this.setState({html: message.nativeEvent.data }, () => this.createPDF());
  }

  _onNavigationStateChange(webViewState){
    console.log("-------NavigationState-----", webViewState.url)
  }

  // INJECTED_JAVASCRIPT = `(function() {
  //   window.ReactNativeWebView.postMessage(JSON.stringify(document.title));
  // })();`;

  INJECTED_JAVASCRIPT = `(function() {
    window.ReactNativeWebView.postMessage(document.getElementsByTagName('html')[0].innerHTML);
  })();`;

  renderWebView(){
    if(this.state.check){
      return(
        <WebView 
            source={{ uri: 'https://reactnative.dev/' }}
            injectedJavaScript={this.INJECTED_JAVASCRIPT}
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            onMessage={this.handleMessage}
        />
      );
    }else {
       return(
        <View style={styles.MainContainer}>
        <TouchableOpacity onPress={this.askPermission.bind(this)}>
        <View>
          <Image
            //We are showing the Image from online
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/pdf.png',
            }}
            //You can also show the image from you project directory like below
            //source={require('./Images/facebook.png')}
            style={styles.ImageStyle}
          />
          <Text style={styles.text}>Create PDF</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.filePath}</Text>
        
      </View>
      );
    }
  }
  render() {
    console.log("---------this.state.check----", this.state.check);
    return( <View style={{flex:1}}>
      {this.renderWebView()}
     </View>)
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F4F4F',
    borderWidth: 1,
    borderColor: '#000',
  },
  text: {
    color: 'white',
    textAlign:'center',
    fontSize: 25,
    marginTop:16,
  },
  ImageStyle: {
    height: 150,
    width: 150,
    resizeMode: 'stretch',
  },
});