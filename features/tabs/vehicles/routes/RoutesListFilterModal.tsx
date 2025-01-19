import FormTitle from "@/app/auth/FormTitle";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useState } from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import DateTimePicker from "react-native-ui-datepicker";
import { pickTextColor } from "@/features/global/functions/pickTectColor";
import dayjs from "dayjs";
import React from "react";

interface RoutesListFilterModalProps {
  close: () => void;
}

export function RoutesListFilterModal({ close }: RoutesListFilterModalProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [date, setDate] = useState(dayjs());

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Filtros de búsqueda" />
      </View>
      <View style={styles.group}>
        <SegmentedControl
          values={["Básicos", "Avanzados"]}
          selectedIndex={selectedIndex}
          onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
        />
      </View>
      <View style={styles.group}>
        {selectedIndex === 0 ? (
          <Text style={styles.subtitle}>Filtros básicos</Text>
        ) : (
          <>
            <View style={styles.dateContainer}>
              <DateTimePicker
                mode="single"
                date={date}
                onChange={(params) => setDate(params.date)}
                selectedItemColor={theme.ui.colors.primary}
                locale="mx"
                calendarTextStyle={{ color: theme.textPresets.main }}
                selectedTextStyle={{ color: pickTextColor(theme.ui.colors.primary) }}
                headerTextStyle={{ color: theme.textPresets.main }}
                headerButtonStyle={{ borderColor: theme.ui.colors.primary }}
                weekDaysTextStyle={{ color: theme.textPresets.main }}
                headerButtonColor={theme.textPresets.main}
                monthContainerStyle={{ backgroundColor: theme.ui.colors.background }}
                yearContainerStyle={{ backgroundColor: theme.ui.colors.background }}
              />
            </View>
            <Text style={styles.subtitle}>{date.toString()}</Text>
            <Text style={styles.subtitle}>Filtros avanzados</Text>
          </>
        )}
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
  dateContainer: {
    backgroundColor: theme.ui.colors.background,
    borderRadius: 10,
    padding: 12,
  },
}));
