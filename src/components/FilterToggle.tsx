// FilterToggle.tsx
import useColorSchemes from "@/themes/ColorSchemes";
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    LayoutChangeEvent,
    Animated,
    Easing,
    GestureResponderEvent,
} from "react-native";

type FilterKey = "upcoming" | "past";

type FilterToggleProps = {
    activeFilter: FilterKey;
    onChange: (f: FilterKey) => void;
    containerStyle?: object;
    tabStyle?: object;
    indicatorColor?: string;
    backgroundColor?: string;
};

export default function FilterToggle({
    activeFilter,
    onChange,
    containerStyle,
    tabStyle,
}: FilterToggleProps) {
    // store measured layout for each tab (index 0 = upcoming, 1 = past)
    const [layouts, setLayouts] = useState<Array<{ x: number; width: number }>>(
        []
    );

    const colors = useColorSchemes();

    const translateX = useRef(new Animated.Value(0)).current;
    const indicatorWidth = useRef(new Animated.Value(0)).current;

    const scalesRef = useRef<[Animated.Value, Animated.Value]>([
        new Animated.Value(1),
        new Animated.Value(1),
    ]);
    const idxOf = (f: FilterKey) => (f === "upcoming" ? 0 : 1);
    const onTabLayout = (evt: LayoutChangeEvent, idx: number) => {
        const { x, width } = evt.nativeEvent.layout;
        setLayouts(prev => {
            const next = [...prev];
            next[idx] = { x, width };
            return next;
        });
    };
    useEffect(() => {
        if (layouts.length < 2 || !layouts[0] || !layouts[1]) return;
        const idx = idxOf(activeFilter);
        const layout = layouts[idx];
        translateX.setValue(layout.x);
        indicatorWidth.setValue(layout.width);
    }, [layouts]);

    useEffect(() => {
        const idx = idxOf(activeFilter);
        const layout = layouts[idx];
        if (!layout) return;

        Animated.parallel([
            Animated.timing(translateX, {
                toValue: layout.x,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }),
            Animated.timing(indicatorWidth, {
                toValue: layout.width,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }),
        ]).start();
    }, [activeFilter, layouts]);

    // Press feedback handlers (scale)
    const handlePressIn = (index: number) => {
        Animated.spring(scalesRef.current[index], {
            toValue: 0.96,
            useNativeDriver: true,
            friction: 6,
            tension: 80,
        }).start();
    };
    const handlePressOut = (index: number) => {
        Animated.spring(scalesRef.current[index], {
            toValue: 1,
            useNativeDriver: true,
            friction: 6,
            tension: 80,
        }).start();
    };

    // Render a tab (label and key)
    const renderTab = (label: string, key: FilterKey, idx: number) => {
        const isActive = activeFilter === key;
        const scale = scalesRef.current[idx];

        return (
            <Pressable
                key={key}
                onLayout={e => onTabLayout(e, idx)}
                onPress={(e: GestureResponderEvent) => onChange(key)}
                onPressIn={() => handlePressIn(idx)}
                onPressOut={() => handlePressOut(idx)}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                style={[styles.tabWrapper, tabStyle]}
            >
                <Animated.View style={{ transform: [{ scale }], flexDirection : 'row', alignItems : "center", justifyContent : "center" }}>
                    <Text style={[styles.tabText, { color: colors.onSurface }, isActive && { color: colors.onPrimary }]}>
                        {label}
                    </Text>
                </Animated.View>
            </Pressable>
        );
    };

    // Animated indicator style
    const indicatorStyle = {
        position: "absolute" as const,
        height: 36,
        borderRadius: 19,
        top: 4,
        width: indicatorWidth,
        transform: [{ translateX }],
        backgroundColor: colors.primary,
        shadowColor: colors.onPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface}, containerStyle]}>
            <Animated.View style={indicatorStyle} />
            <View style={styles.row}>
                {renderTab("Upcoming", "upcoming", 0)}
                {renderTab("Past", "past", 1)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 2,
        borderRadius: 7,
        position: "relative",
        overflow: "visible",
        flexDirection : 'row',
        alignItems : "center"
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent : 'center'
    },
    tabWrapper: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
