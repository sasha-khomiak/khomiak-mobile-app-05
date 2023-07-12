// ДОПРАЦЮВАТИ КНОПКУ НАЗАД!!!!!!!!

import React, { useState, useEffect, useRef } from "react";

// Бібліотеки для камери та медіатеки
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

// Бібліотека геолокації
import * as Location from "expo-location";

// Компоненти
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

// Стилі
import { stylesCreatePostsScreen } from "./stylesCreatePostsScreen";

// Іконки
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

// Навігація
import { useNavigation } from "@react-navigation/native";

const CreatePostsScreen = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [geoLocation, setGeoLocation] = useState(null);
  const [photoURI, setPhotoURI] = useState(null);

  // навігація по сторінках
  const navigation = useNavigation();

  // Дозвіл користуватися камерою і медіатекою
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  // Отримання геолокації
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setGeoLocation(coords);
    })();
  }, []);

  // при натисканні на кнопку "сфотографувати"
  const makePhoto = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync({
        quality: 1,
        base64: true,
      });
      // await MediaLibrary.createAssetAsync(uri);
      setPhotoURI(uri);
    }
  };

  // рендеринг сторінки
  if (cameraPermission === null) {
    return <View />;
  }
  if (cameraPermission === false) {
    // navigation.navigate("Posts");
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={stylesCreatePostsScreen.container}>
      {/* верхнє меню вантажиться з компонента HOME із customHeader */}
      {/* блок головного контенту */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView style={stylesCreatePostsScreen.mainContent}>
            <View style={stylesCreatePostsScreen.photoWrap}>
              {photoURI && (
                <ImageBackground
                  source={photoURI}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Pressable style={stylesCreatePostsScreen.buttonLoadPhoto}>
                    <FontAwesome name="camera" size={24} color="#BDBDBD" />
                  </Pressable>
                </ImageBackground>
              )}
              {!photoURI && (
                <Camera
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // height: 240,
                    height: "100%",
                    width: "100%",
                  }}
                  type={type}
                  ref={setCameraRef}
                  ratio="1:1"
                >
                  <Pressable
                    style={stylesCreatePostsScreen.buttonLoadPhoto}
                    onPress={makePhoto}
                  >
                    <FontAwesome name="camera" size={24} color="#BDBDBD" />
                  </Pressable>
                </Camera>
              )}
            </View>
            <Text style={stylesCreatePostsScreen.operationPhotoText}>
              Завантажте фото
            </Text>

            <TextInput
              placeholder="Назва..."
              style={stylesCreatePostsScreen.inputName}
            ></TextInput>
            <View style={stylesCreatePostsScreen.inputPlaceWrap}>
              <TextInput
                placeholder="Місцевість..."
                style={stylesCreatePostsScreen.inputPlace}
              />

              <AntDesign
                name="enviromento"
                size={24}
                color="#BDBDBD"
                style={stylesCreatePostsScreen.inputPlaceIco}
              />
            </View>

            <Pressable style={stylesCreatePostsScreen.postButton}>
              <Text style={stylesCreatePostsScreen.postButtonText}>
                Опубліковати
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <Pressable style={stylesCreatePostsScreen.postButtonTrash}>
        <Feather name="trash-2" size={24} color="#BDBDBD" />
      </Pressable>
    </View>
  );
};

export default CreatePostsScreen;
