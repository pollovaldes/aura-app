import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import React from "react";
import { User } from "@/types/globalTypes";
import QRCode from "react-qr-code";

type QRCodeColumnProps = {
  profile: User;
};

export function QRCodeColumn({ profile }: QRCodeColumnProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.qrCodeContainer}>
        <QRCode
          value={profile.id}
          size={230}
          bgColor={styles.qrCode.backgroundColor}
          fgColor={styles.qrCode.foregroundColor}
        />
        <View>
          <Text style={styles.description}>Presenta este código QR a tu coordinador de flotilla.</Text>
        </View>
      </View>
      <View style={styles.descriptioonContainer}>
        <View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.name}>{`${profile.father_last_name} ${profile.mother_last_name}`}</Text>
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    width: "100%",
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: "center",
  },
  descriptioonContainer: {
    flexDirection: "column",
    gap: 8,
  },
  qrCodeContainer: {
    alignItems: "center",
    gap: 12,
  },
  qrCode: {
    backgroundColor: theme.ui.colors.card,
    foregroundColor: theme.textPresets.main,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.textPresets.main,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
  descriptionContainer: {
    marginTop: 12,
  },
}));
