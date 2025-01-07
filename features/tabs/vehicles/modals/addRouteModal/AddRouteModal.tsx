import { createStyleSheet, useStyles } from "react-native-unistyles";
import { CreateRouteProvider } from "./CreateRouteContext";
import { RouteWelcomeStep } from "./RouteWelcomeStep";
import { useState } from "react";
import { RouteTitleDescription } from "./RouteTitleDescription";
import { StartLocation } from "./StartLocationSetp";
import { VehicleStep } from "./VehicleStep";
import { RouteSummary } from "./RouteSummary";

interface AddRouteModalProps {
  close: () => void;
}

export function AddRouteModal({ close }: AddRouteModalProps) {
  const { styles } = useStyles(stylesheet);
  const [step, setStep] = useState(0);

  return (
    <CreateRouteProvider step={step} setStep={setStep} close={close}>
      {step === 0 && <RouteWelcomeStep />}
      {step === 1 && <RouteTitleDescription />}
      {step === 2 && <StartLocation />}
      {step === 3 && <RouteSummary />}
    </CreateRouteProvider>
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
}));
