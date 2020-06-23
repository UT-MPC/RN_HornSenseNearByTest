import React from "react"
import {View, Text,  FlatList, StyleSheet, SafeAreaView, Platform, TouchableOpacity, Switch} from "react-native"
import {connect} from "react-redux"
import { NearbyAPI } from "react-native-nearby-api"
import {saveEncounterDetails} from "../redux/actions/saveEncounterDetailsAction"
import uuid from 'react-native-uuid'

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const nearbyAPI = new NearbyAPI(true);

const API_KEY = 'AIzaSyDpPOPJM3FLNHAY6UgBhFapzVKCEaHXY2w'

class EncounterDetails extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            UUID:"",
            switch1Value: false,
            isConnected: false,
            nearbyMessage: null,
            isPublishing: false,
            isSubscribing: false,
            switchValue:false,
        }
    }

    async componentDidMount() {
    console.log("Mounting ", NearbyAPI);
    nearbyAPI.onConnected(message => {
      console.log(message);
      nearbyAPI.isConnected((connected, error) => {
        this.setState({
          nearbyMessage: `Connected - ${message}`,
          isConnected: connected
        });
      });
    });
    nearbyAPI.onDisconnected(message => {
      console.log(message);
      this.setState({
        isConnected: false,
        nearbyMessage: `Disconnected - ${message}`
      });
    });
    nearbyAPI.onFound(message => {
      console.log("Message Found!");
      console.log(message);
      this.setState({ nearbyMessage: `Message Found - ${message}` });
      this._storing(message);
    });
    nearbyAPI.onLost(message => {
      console.log("Message Lost!");
      console.log(message);
      this.setState({ nearbyMessage: `Message Lost - ${message}` });
    });
    nearbyAPI.onDistanceChanged((message, value) => {
      console.log("Distance Changed!");
      console.log(message, value);
      this.setState({
        nearbyMessage: `Distance Changed - ${message} - ${value}`
      });
    });
    nearbyAPI.onPublishSuccess(message => {
      nearbyAPI.isPublishing((status, error) => {
        this.setState({
          nearbyMessage: `Publish Success - ${message}`,
          isPublishing: status
        });
      });
    });
    nearbyAPI.onPublishFailed(message => {
      console.log(message);
      nearbyAPI.isPublishing((status, error) => {
        this.setState({
          nearbyMessage: `Publish Failed - ${message}`,
          isPublishing: status
        });
      });
    });
    nearbyAPI.onSubscribeSuccess(() => {
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `Subscribe Success`,
          isSubscribing: status
        });
      });
    });
    nearbyAPI.onSubscribeFailed(() => {
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `Subscribe Failed`,
          isSubscribing: status,
        });
      });
    });

    await this._connectPress();
    // this._subscribePress();

    setInterval(() => this.setState({UUID: uuid.v1()} ), 60000);
  }

  _connectPress = () => {
    if (this.state.isConnected) {
      nearbyAPI.disconnect();
      nearbyAPI.isConnected((connected, error) => {
        this.setState({
          nearbyMessage: `Disconnected`,
          isConnected: connected
        });
      });
    } else {
      nearbyAPI.connect(API_KEY);
    }
  };

   _publishPress = () => {
    if (!this.state.isPublishing) {
      nearbyAPI.publish(`Hello World! - ${Math.random()}`);
    } else {
      nearbyAPI.unpublish();
      nearbyAPI.isPublishing((status, error) => {
        this.setState({
          nearbyMessage: `unpublished`,
          isPublishing: status
        });
      });
    }
  };

  _subscribePress = () => {
    if (!this.state.isSubscribing) {
      nearbyAPI.subscribe();
    } else {
      nearbyAPI.unsubscribe();
      nearbyAPI.isSubscribing((status, error) => {
        this.setState({
          nearbyMessage: `unsubscribed`,
          isSubscribing: status
        });
      });
    }
  };

  _storing = (message) => {
      var encounterDetails = message
      this.props.reduxSaveEncounterDetail(encounterDetails)
      connect(null, mapDispatchToProps)//
  }

  toggleSwitch = (value) => {
      //onValueChange of the switch this function will be called
      this.setState({switchValue: value})
      // state changes according to switch
      if(value == true){
          this._subscribePress()
          setInterval(() => nearbyAPI.publish(this.state.UUID), 60000);
      } else{
         this._subscribePress()
          nearbyAPI.unpublish()
      }


   }

    render(){

    return (
      <View style={styles.container}>
        <Switch
            style={{marginTop:30}}
            onValueChange = {this.toggleSwitch}
            value = {this.state.switchValue}/>

        <Text style={styles.instructions}>
          Connect: {`${this.state.isConnected}`}
        </Text>
        <Text style={styles.instructions}>
          Is Subscribing: {`${this.state.isSubscribing}`}
        </Text>

        <Text style={styles.instructions}>
          Publish: {`${this.state.isPublishing}`}
        </Text>

        <View style={{ height: 10 }} />
        <TouchableOpacity onPress={this._subscribePress}>
          <Text style={styles.connectButton}>
            {this.state.isSubscribing ? "UNSUBSCRIBE" : "SUBSCRIBE"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 10 }} />
        <TouchableOpacity onPress={this._publishPress}>
          <Text style={styles.connectButton}>
            {this.state.isPublishing ? "UNPUBLISH" : "PUBLISH"}
          </Text>
         </TouchableOpacity>

        <View style={{ height: 32 }} />
        <FlatList
            data = {this.props.encounterDetails}
            renderItem={({item}) =>
                <View style={{
                              flex: 1,
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                            }}>
                    <Text style={styles.ListStyle}>{item}</Text>
                </View>
            }
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  connectButton: {
    fontSize: 30,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  TextStyle: {
    color: '#fff',
    marginLeft: 30,
    fontSize: 30,
  },
  ListStyle: {
    color: '#333333',
    fontSize: 15,
  },
});

  const mapDispatchToProps = (dispatch) =>
    {
        return{
         reduxSaveEncounterDetail:(encounterDetails) => dispatch(saveEncounterDetails(encounterDetails))

        }
    }

  const mapStateToProps = (state) => {
      return{
        encounterDetails: state.encounterDetailReducer.encounterDetails
      }
    }

    //The connect() function connects a React component to a Redux store
    export default connect(
        mapStateToProps,
          mapDispatchToProps
      )(EncounterDetails);
  // export default (EncounterDetails);
