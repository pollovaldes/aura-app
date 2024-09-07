import { useState } from "react";
import Modal from "../Modal/Modal";
import NotificationCard from "./NotificationCard";
import { View, Text, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface NotificationProps {
  title: string;
  onPress?: () => void;
  onPressDiscard: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  kind?: kind;
}

interface DefaultProps extends NotificationProps {
  caption?: string;
  description?: string;
  timestamp?: string;
  creator?: string;
  target?: string;
  status?: status;
  simple?: boolean;
}

type status = "read" | "unread";

type kind = "message" | "bad" | "good" | "info";

export default function Notification({
  title,
  onPress,
  onPressDiscard,
  disabled = true,
  isLoading,
  kind = "message",
  caption,
  description,
  timestamp,
  creator,
  target,
  status = "unread",
  simple
}: DefaultProps) {
  const { styles } = useStyles(stylesheet);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen}>
        <View>
          <View style={styles.section}>
            <View style={styles.group}>
              <NotificationCard
                title={title}
                onPress={onPress}
                onPressSeeMore={() => setIsOpen(true)}
                onPressDiscard={onPressDiscard}
                disabled={disabled}
                isLoading={isLoading}
                kind={kind}
                caption={caption}
                simple={false}
                childrenRight={
                  <Text style={styles.closeButton} onPress={() => setIsOpen(false)}>
                    Cerrar
                  </Text>
                }
              >
                <Text>{description}</Text>
              </NotificationCard>
            </View>
            <View style={styles.group}>
            </View>
          </View>
        </View>
      </Modal>
      <NotificationCard
        title={title}
        onPress={onPress}
        onPressSeeMore={() => setIsOpen(true)}
        onPressDiscard={onPressDiscard}
        disabled={disabled}
        isLoading={isLoading}
        kind={kind}
        caption={caption}
        simple={simple}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
}));