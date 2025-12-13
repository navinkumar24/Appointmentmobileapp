import dayjs from "dayjs";
import { Text } from "react-native";
import React from "react";
import useColorSchemes from "../themes/ColorSchemes";

export type DoctorLeave = {
  entityID: number;
  startDate: string;
  endDate?: string | null;
  displayText?: string;
};

export function useLeavesMessage(
  leaves: DoctorLeave[] | undefined | null,
  pickedDate?: Date | string | null,
  prefix = "This doctor is unavailable from "
): React.ReactNode | null {
  const colors = useColorSchemes();

  if (!leaves || leaves.length === 0 || !pickedDate) return null;

  const picked = dayjs(pickedDate);

  const pickedIsInAny = leaves.some((l) => {
    if (!l?.startDate) return false;
    const start = dayjs(l.startDate);
    const end = l.endDate ? dayjs(l.endDate) : start;

    return (
      picked.isSame(start, "day") ||
      picked.isSame(end, "day") ||
      (picked.isAfter(start, "day") && picked.isBefore(end, "day"))
    );
  });

  if (!pickedIsInAny) return null;

  return (
    <Text style={{ color: colors.onSurface, lineHeight: 20 }}>
      {prefix}{" "}
      {leaves.map((l, index) => {
        const start = dayjs(l.startDate).format("DD-MM-YYYY");
        const end = l.endDate
          ? dayjs(l.endDate).format("DD-MM-YYYY")
          : start;

        return (
          <Text key={index}>
            <Text style={{ color: colors.error, fontWeight : '500' }}>{start}</Text>
            {" to "}
            <Text style={{ color: colors.error, fontWeight : '500' }}>{end}</Text>

            {index !== leaves.length - 1 ? " and from " : ""}
          </Text>
        );
      })}
    </Text>
  );
}
