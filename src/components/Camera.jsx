import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function ExpoCamera({setCameraVisible}) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    try {
      if (cameraRef?.current) {
        console.log("cameraRef?.current", cameraRef)
        const photo = await cameraRef.current.takePictureAsync();
        console.log("photo", photo)
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const retakePicture = () => {
    setPhotoUri(null);
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={retakePicture}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => alert(`Photo saved: ${photoUri}`)}>
              <Text style={styles.text}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView style={styles.camera} type={facing} ref={cameraRef}>
          <View style={styles.cameraButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={()=>setCameraVisible(false)}>
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    height: "80%",
    // flex: 2,
    width: '100%',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
  },
});
