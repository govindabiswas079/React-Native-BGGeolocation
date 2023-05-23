import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Platform, Button, Pressable } from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import {
    StyleSheet,
    View,
    StatusBar,
    Text,
    Dimensions
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import BackgroundGeolocation, { State, Config, Location, LocationError, Geofence, GeofenceEvent, GeofencesChangeEvent, HeartbeatEvent, HttpEvent, MotionActivityEvent, MotionChangeEvent, ProviderChangeEvent, ConnectivityChangeEvent } from "react-native-background-geolocation";
import { DarkMood, AubergineMood, NightMood, RetroMood, SilverMood, StandardMood, } from '../MapStyles';

const screen = Dimensions.get('window');

const Maps = () => {
    const MapRef = useRef();
    const [istrafic, setIsTrafic] = useState(false)
    const [isCoord, setCoord] = useState({
        latitude: 18.743784,
        longitude: 73.681940,
    })

    const onZoomInPress = () => {
        MapRef?.current?.getCamera().then((cam) => {
            if (Platform.OS === 'android') {
                cam.zoom += 1;
            } else {
                cam.altitude /= 2;
            }
            MapRef?.current?.animateCamera(cam);
        });
    };

    const onZoomOutPress = () => {
        MapRef?.current?.getCamera().then((cam) => {
            if (Platform.OS === 'android') {
                cam.zoom -= 1;
            } else {
                cam.altitude *= 2;
            }
            MapRef?.current?.animateCamera(cam);
        });
    };


    const SetCamera = () => {
        MapRef?.current?.animateCamera({
            // center: {
            //     latitude: this.state.mapLat,
            //     longitude: this.state.mapLong,
            // },
            pitch: 90,
            heading: 10,
        })
    }

    useEffect(() => {
        BackgroundGeolocation.ready({
            desiredAccuracy: BackgroundGeolocation.ACCURACY_AUTHORIZATION_FULL,
            distanceFilter: 50
        }).then((state) => {
            BackgroundGeolocation.start();
            BackgroundGeolocation.watchPosition(options => {
                const { latitude, longitude } = options?.coords
                // console.log('options', latitude, longitude)
                // setCoord({ ...isCoord, latitude: latitude, longitude: longitude })
            });
        });
    }, []);

    React.useEffect(() => {
        const degree_update_rate = 3;

        CompassHeading.start(degree_update_rate, ({ heading, accuracy }) => {
            MapRef.current?.animateCamera({ heading: 360 - heading })
        });

        return () => {
            CompassHeading.stop();
        };
    }, []);

    return (
        <Fragment>
            <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true} />
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
                backgroundColor: 'red'
            }}>
                <View style={{
                    ...StyleSheet.absoluteFillObject
                }}>
                    <MapView
                        // customMapStyle={NightMood}
                        mapType='standard'
                        initialRegion={{
                            latitude: 18.743784,
                            longitude: 73.681940,
                            latitudeDelta: 0.0922,
                            longitudeDelta: screen.width / screen.height,
                        }}
                        annotations={20}
                        ref={MapRef}
                        provider={PROVIDER_GOOGLE}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            // transform: [{ rotate: `${360 - 0}deg` }]
                            // width: '100%',
                            // height: 550,
                        }}
                        compassStyle={{
                            bottom: 20,
                            right: 30
                        }}
                        showsTraffic={istrafic}
                        // showsCompass={true}
                        // onLayout={(data) => { }}
                        // onMapReady={(data) => { }}

                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        userLocationPriority={'high'}
                        loadingEnabled={true}
                        minZoomLevel={1}
                        maxZoomLevel={50}
                        zoom={5}
                    // zoomEnabled={true}
                    // enableZoomControl={true}
                    // zoomTapEnabled={true}
                    // pitchEnabled={true}
                    >


                        <MapViewDirections
                            mode='DRIVING'
                            origin={{ latitude: 18.743784, longitude: 73.681940 }}
                            // waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : undefined}
                            destination={{ latitude: 19.9615, longitude: 79.2961 }}
                            apikey={'AIzaSyAhZVYw7_fop94kBO63xKxKdiX_GJGLKO0'} // AIzaSyCINS2dyuBipK8MZzOQnzyKdrS2I1_b5I4
                            strokeWidth={3}
                            strokeColor="red"
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                // console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                console.log(params);
                            }}
                            onReady={result => {
                                console.log(`Distance: ${result.distance} km`)
                                console.log(`Duration: ${result.duration} min.`)

                                MapRef?.current?.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (screen?.width / 20),
                                        bottom: (screen?.height / 20),
                                        left: (screen?.width / 20),
                                        top: (screen?.height / 20),
                                    }
                                });
                            }}
                            onError={(errorMessage) => {
                                console.log('GOT AN ERROR', errorMessage);
                            }}
                        />

                    </MapView>
                    <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                        <Pressable onPress={() => { onZoomInPress() }} style={{ width: 30, height: 30, borderRadius: 5, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontWeight: '700', fontSize: 25, color: '#000000' }}>L</Text>
                        </Pressable>
                        <Pressable onPress={() => { onZoomInPress() }} style={{ width: 30, height: 30, borderRadius: 5, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                            <Text style={{ fontWeight: '700', fontSize: 25, color: '#000000' }}>+</Text>
                        </Pressable>
                        <Pressable onPress={() => { onZoomOutPress() }} style={{ width: 30, height: 30, borderRadius: 5, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                            <Text style={{ fontWeight: '700', fontSize: 25, color: '#000000' }}>-</Text>
                        </Pressable>
                        <Pressable onPress={() => { SetCamera() }} style={{ width: 30, height: 30, borderRadius: 5, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                            <Text style={{ fontWeight: '700', fontSize: 20, color: '#000000' }}>3D</Text>
                        </Pressable>
                        <Pressable onPress={() => { setIsTrafic(!istrafic) }} style={{ width: 30, height: 30, borderRadius: 5, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                            <Text style={{ fontWeight: '700', fontSize: 20, color: '#000000' }}>T</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Fragment>
    )
}

export default Maps