import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import useColorSchemes from '@/themes/ColorSchemes';
import { Link, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchAllSpecializations } from '@/store/homeSlice';
import { setDoctorSpecialitiesPageTitle, setSelectedSpecialist } from '@/store/utilsSlice';
import getenvValues from '@/utils/getenvValues';
import { ColorTheme } from '@/types/ColorTheme';

const { width } = Dimensions.get('window');
const CARD_GAP = 14;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - (NUM_COLUMNS + 1) * CARD_GAP) / NUM_COLUMNS;

/** sanitizeSvg: remove text nodes that break RN, normalize colors, ensure root fill=currentColor */
function sanitizeSvg(xml: string) {
  if (!xml || typeof xml !== 'string') return xml;
  let out = xml;
  out = out.replace(/<title[\s\S]*?<\/title>/gi, '');
  out = out.replace(/<desc[\s\S]*?<\/desc>/gi, '');
  out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<style[\s\S]*?<\/style>/gi, '');
  out = out.replace(/<text[\s\S]*?<\/text>/gi, '');
  out = out.replace(/>\s*[^<>\s][^<]*\s*</g, '><');
  out = out.replace(/fill:\s*#[0-9a-fA-F]{3,6}/gi, 'fill:currentColor');
  out = out.replace(/stroke:\s*#[0-9a-fA-F]{3,6}/gi, 'stroke:currentColor');
  out = out.replace(/fill="(?!currentColor)[^"]*"/gi, 'fill="currentColor"');
  out = out.replace(/stroke="(?!currentColor)[^"]*"/gi, 'stroke="currentColor"');
  out = out.replace(/<svg([^>]*)>/i, (m, p1) => {
    if (/fill\s*=/i.test(p1)) return `<svg${p1}>`;
    return `<svg${p1} fill="currentColor">`;
  });
  return out;
}

export default function Home() {
  const colors = useColorSchemes();
  const styles = dynamicStyles(colors);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { file_service_base_url } = getenvValues();

  const { allSpecializations } = useSelector((s: RootState) => s.home);


  const [svgCache, setSvgCache] = useState<Record<number, string>>({});

  const [loadingIcons, setLoadingIcons] = useState<Record<number, boolean>>({});

  // refs to keep stable maps across renders and avoid re-fetch races
  const svgCacheRef = useRef<Record<number, string>>({});
  const pendingFetchRef = useRef<Record<number, Promise<string | null>>>({});

  useEffect(() => {
    dispatch(fetchAllSpecializations());
  }, [dispatch]);

  // memoized fetch function (uses refs to avoid repeated requests and race conditions)
  const fetchAndSanitizeSvg = useCallback(async (entityID: number, iconUrl: string) => {
    if (!iconUrl) return null;

    // return immediately if cached
    if (svgCacheRef.current[entityID]) return svgCacheRef.current[entityID];

    // if a fetch is already pending for this id, return that promise
    if (await pendingFetchRef.current[entityID]) {
      return pendingFetchRef.current[entityID];
    }

    // create the fetch promise and store in pending map
    const p = (async () => {
      try {
        setLoadingIcons((s) => ({ ...s, [entityID]: true }));
        const res = await fetch(iconUrl);
        if (!res.ok) return null;
        const text = await res.text();
        const sanitized = sanitizeSvg(text || '');

        // update refs and state once
        svgCacheRef.current = { ...svgCacheRef.current, [entityID]: sanitized };
        setSvgCache((prev) => ({ ...prev, [entityID]: sanitized }));

        return sanitized;
      } catch (err) {
        return null;
      } finally {
        setLoadingIcons((s) => ({ ...s, [entityID]: false }));
        // cleanup pending
        delete pendingFetchRef.current[entityID];
      }
    })();

    pendingFetchRef.current[entityID] = p;
    return p;
  }, []);

  useEffect(() => {
    if (!allSpecializations || allSpecializations.length === 0) return;

    (async () => {
      for (const item of allSpecializations) {
        const id = item?.entityID;
        const iconUrl = item?.icon ? `${file_service_base_url}${item.icon}` : null;
        if (!id || !iconUrl) continue;

        // skip if already cached or currently pending
        if (svgCacheRef.current[id] || await pendingFetchRef.current[id]) continue;

        // start fetch, but do not await here — let it populate cache when done
        fetchAndSanitizeSvg(id, iconUrl).catch(() => {
          /* swallow errors — cards will show fallback */
        });
      }
    })()

  }, [allSpecializations, fetchAndSanitizeSvg, file_service_base_url]);

  function ServiceCard({ title, subtitle, icon, route, bgColors, accent }: any) {
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
    const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    const handlePress = () => {
      if (route) router?.push(route);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={{ width: '58%' }}
      >
        <Animated.View style={[styles.serviceCard, { transform: [{ scale }] }]}>
          <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.serviceInner}>
            <View style={[styles.serviceIconWrap, { backgroundColor: `${accent}1A` }]}>
              <Image source={icon} style={styles.serviceIcon} resizeMode="contain" />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.serviceTitle}>{title}</Text>
              {subtitle ? <Text style={styles.serviceSubtitle}>{subtitle}</Text> : null}
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  // Speciality card: reads from state only; no fetching inside card
  function SpecialityCard({ item }: any) {
    const id = item?.entityID;
    const cachedXml = svgCache[id];
    const loading = loadingIcons[id];

    const onPress = () => {
      dispatch(setDoctorSpecialitiesPageTitle({ specializationName: item?.entityBusinessName, specializationID: item?.entityBusinessID }));
      dispatch(setSelectedSpecialist(item));
      router?.push('/screens/ShowDoctors');
    };

    const canRenderSvg = typeof cachedXml === 'string' && /<svg[\s\S]*?>/i.test(cachedXml);

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.specialityCard}>
        <View style={styles.specialityTop}>
          {canRenderSvg ? (
            <SvgXml xml={cachedXml as string} width={46} height={46} color={colors.primary} />
          ) : loading ? (
            <View style={{ width: 46, height: 46, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.fallbackCircle}>
              <Text style={styles.fallbackInitials}>{(item?.entityBusinessName || '?').slice(0, 1).toUpperCase()}</Text>
            </View>
          )}
        </View>

        <Text style={styles.specialityTitle} numberOfLines={2}>{item?.entityBusinessName}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <LinearGradient colors={[colors.surface, colors.secondaryContainer || colors.surface]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Our Services</Text>
        </View>

        <View style={styles.servicesRow}>
          <ServiceCard
            title="Appointment Booking"
            subtitle="Find a doctor & book"
            icon={require('../../../assets/images/ourservices/appointmentBooking.png')}
            bgColors={[colors.primaryContainer, colors.surface]}
            accent={colors.primary}
            route={'/screens/BookAppointment'}
          />
        </View>

        <View style={[styles.sectionRow, { marginTop: 18 }]}>
          <Text style={styles.sectionTitle}>Specialities At Our Hospital</Text>

          <Link href={'/screens/ShowAllSpecialities'}>
            <Text style={styles.viewAll}>View All</Text>
          </Link>
        </View>

        <View style={styles.gridContainer}>
          {allSpecializations && allSpecializations.length > 0 ? (
            allSpecializations.map((item) => (
              <SpecialityCard key={String(item?.entityID ?? item?.id ?? Math.random())} item={item} />
            ))
          ) : (
            <View style={{ padding: 18 }}>
              <Text style={{ color: colors.onSurface }}>No specialities available.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const dynamicStyles = (colors: ColorTheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.surface,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  viewAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  serviceCard: {
    borderRadius: 8,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  serviceInner: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    minHeight: 76,
  },
  serviceIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    width: 35,
    height: 35,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: colors.onSurface,
    marginTop: 2,
    fontWeight : '500'
  },
  chev: {
    marginLeft: 8,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginTop: 12,
  },
  specialityCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
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
  specialityTop: {
    width: 62,
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.surface}55`,
    marginBottom: 8,
  },
  fallbackCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  fallbackInitials: {
    color: '#fff',
    fontWeight: '700',
  },
  specialityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
    textAlign: 'center',
  },
});
