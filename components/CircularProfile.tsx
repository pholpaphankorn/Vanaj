import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {
    imageUrl: string;
    isOnline: boolean;
};

const CircularProfile: React.FC<Props> = ({ isOnline }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: "https://i.kym-cdn.com/entries/icons/original/000/018/166/pakalu.png" }} style={styles.image} />
            {isOnline && <View style={styles.onlineDot} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    onlineDot: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "green",
        borderWidth: 2,
        borderColor: "white",
    },
});

export default CircularProfile;
