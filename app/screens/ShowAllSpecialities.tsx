import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useColorSchemes from "@/themes/ColorSchemes";
import { ColorTheme } from "@/types/ColorTheme";
import getenvValues from "@/utils/getenvValues";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setDoctorSpecialitiesPageTitle, setSelectedSpecialist } from "@/store/utilsSlice";
import { useRouter } from "expo-router";
import { SvgXml } from "react-native-svg";

/** Sanitize SVG: remove text/title/desc/metadata/script/style, remove stray text nodes,
 * normalize fill/stroke to currentColor and ensure root svg has fill="currentColor".
 */
function sanitizeSvg(xml: string) {
    if (!xml || typeof xml !== "string") return xml;
    let out = xml;

    out = out.replace(/<title[\s\S]*?<\/title>/gi, "");
    out = out.replace(/<desc[\s\S]*?<\/desc>/gi, "");
    out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
    out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
    out = out.replace(/<style[\s\S]*?<\/style>/gi, "");
    out = out.replace(/<text[\s\S]*?<\/text>/gi, "");

    // remove stray text nodes between tags (e.g. > SOME_TEXT <)
    out = out.replace(/>\s*[^<>\s][^<]*\s*</g, "><");

    // normalize inline style color values and attributes
    out = out.replace(/fill:\s*#[0-9a-fA-F]{3,6}/gi, "fill:currentColor");
    out = out.replace(/stroke:\s*#[0-9a-fA-F]{3,6}/gi, "stroke:currentColor");
    out = out.replace(/fill="(?!currentColor)[^"]*"/gi, 'fill="currentColor"');
    out = out.replace(/stroke="(?!currentColor)[^"]*"/gi, 'stroke="currentColor"');

    // ensure svg root has fill="currentColor" if missing
    out = out.replace(/<svg([^>]*)>/i, (m, p1) => {
        if (/fill\s*=\s*"/i.test(p1)) return `<svg${p1}>`;
        return `<svg${p1} fill="currentColor">`;
    });

    return out;
}

const ShowAllSpecialities = () => {
    const colors = useColorSchemes();
    const styles = dynamicStyles(colors);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { allSpecializations } = useSelector((state: RootState) => state.home);
    const { file_service_base_url } = getenvValues();

    // Cache sanitized SVG strings by entityID
    const [svgCache, setSvgCache] = useState<Record<number, string>>({});
    // Track ids that failed to fetch/sanitize
    const [errorIds, setErrorIds] = useState<Record<number, boolean>>({});
    // Refs to avoid duplicate fetches and to hold cache between renders
    const fetchingRef = useRef<Record<number, boolean>>({});
    const cacheRef = useRef<Record<number, string>>({});

    // stable fetch function
    const fetchAndCacheSvg = useCallback(async (id: number, url: string) => {
        if (!id || !url) return null;
        if (cacheRef.current[id] || fetchingRef.current[id]) return null;

        try {
            fetchingRef.current[id] = true;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Network error");
            const text = await res.text();
            const sanitized = sanitizeSvg(text || "");
            // only cache if sanitized contains <svg
            if (/<svg[\s\S]*?>/i.test(sanitized)) {
                cacheRef.current = { ...cacheRef.current, [id]: sanitized };
                setSvgCache((prev) => ({ ...prev, [id]: sanitized }));
            } else {
                // mark as error (invalid svg content)
                setErrorIds((e) => ({ ...e, [id]: true }));
            }
        } catch (err) {
            setErrorIds((e) => ({ ...e, [id]: true }));
        } finally {
            fetchingRef.current[id] = false;
        }
    }, []);

    // Prefetch all SVGs once when specializations arrive.
    useEffect(() => {
        if (!Array.isArray(allSpecializations) || allSpecializations.length === 0) return;
        for (const item of allSpecializations) {
            if (!item?.icon) continue;
            const id = item.entityID;
            const url = `${file_service_base_url}${item.icon}`;
            // skip if already cached or errored
            if (cacheRef.current[id] || errorIds[id]) continue;
            fetchAndCacheSvg(id, url).catch(() => {
                /* swallow; errors recorded in state */
            });
        }
        // We intentionally don't include fetchAndCacheSvg in deps to keep stable reference (it's memoized).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allSpecializations, file_service_base_url]);

    return (
        <LinearGradient
            colors={[colors.surface, colors.secondaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainPageContainer}
        >
            <View style={styles.specialitiesContainer}>
                <View style={styles.specialitiesGrid}>
                    {allSpecializations?.map((item) => {
                        const id = item.entityID;
                        const svgXml = svgCache[id] ?? cacheRef.current[id];
                        const hasError = !!errorIds[id];
                        const isFetching = !!fetchingRef.current[id];

                        return (
                            <TouchableOpacity
                                key={String(id)}
                                style={styles.specialitiesItemCard}
                                activeOpacity={0.85}
                                onPress={() => {
                                    dispatch(
                                        setDoctorSpecialitiesPageTitle({
                                            specializationName: item?.entityBusinessName,
                                            specializationID: item?.entityBusinessID,
                                        })
                                    );
                                    dispatch(setSelectedSpecialist(item));
                                    router?.push("/screens/ShowDoctors");
                                }}
                            >
                                {/* Render sanitized SVG if available */}
                                {svgXml && !hasError ? (
                                    <SvgXml xml={svgXml} width={50} height={50} color={colors.primary} />
                                ) : hasError ? (
                                    <View style={styles.fallbackCircle} />
                                ) : isFetching ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    // still not fetched/queued: show loader and kick off fetch
                                    <ActivityIndicator
                                        size="small"
                                        color={colors.primary}
                                        // start fetch on first render if not yet fetched
                                        onLayout={() => {
                                            const url = item?.icon ? `${file_service_base_url}${item.icon}` : null;
                                            if (url && !fetchingRef.current[id] && !cacheRef.current[id] && !errorIds[id]) {
                                                fetchAndCacheSvg(id, url).catch(() => { /* swallow */ });
                                            }
                                        }}
                                    />
                                )}

                                <Text style={styles.specialitiesItemText}>{item.entityBusinessName}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </LinearGradient>
    );
};

export default ShowAllSpecialities;

/* --- Styles --- */
const dynamicStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        mainPageContainer: {
            flex: 1,
            padding: 14,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.primary,
            marginVertical: 10,
        },
        ourServicesContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
        },
        ourServicesItemCard: {
            width: "48%",
            backgroundColor: colors.primaryContainer,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        ourServicesItemLogo: {
            width: 40,
            height: 40,
            marginBottom: 8,
        },
        ourServicesItemText: {
            fontSize: 14,
            fontWeight: "500",
            color: colors.onPrimaryContainer,
            textAlign: "center",
        },
        viewAllContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        viewAllText: {
            fontSize: 15,
            fontWeight: "600",
            textDecorationLine: "underline",
            color: colors.primary,
        },
        specialitiesContainer: {
            marginTop: 10,
        },
        specialitiesGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },
        specialitiesItemCard: {
            width: "48%",
            backgroundColor: colors.surface || colors.surface,
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 4,
        },
        specialitiesItemText: {
            fontSize: 13,
            fontWeight: "600",
            color: colors.onSurface,
            textAlign: "center",
            marginTop: 6,
        },
        fallbackCircle: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#ccc",
        },
    });
