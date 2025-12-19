// app/screens/AboutScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import useColorSchemes from '@/themes/ColorSchemes';
import getenvValues from '@/utils/getenvValues';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const colors = useColorSchemes();
  return (
    <Animatable.View
      animation="fadeInUp"
      duration={380}
      useNativeDriver
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{title}</Text>
      <View style={{ marginTop: 8 }}>{children}</View>
    </Animatable.View>
  );
};

const AboutScreen: React.FC<{ appVersion?: string }> = () => {
  const colors = useColorSchemes();
   const { companyGmail, companyMobile, companyName } = getenvValues();

  return (
    <LinearGradient colors={[colors.surface, colors.secondaryContainer]} style={styles.gradient}>
    
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
          
          <SectionCard title="Our Mission">
            <Text style={[styles.bodyText, { color: colors.onSurface }]}>
              Our mission is to make appointment booking fast, reliable, and convenient for both customers and service providers.
              We prioritise privacy, security, and excellent support.
            </Text>
          </SectionCard>

          <SectionCard title="Security & Privacy">
            <Text style={[styles.bodyText, { color: colors.onSurface }]}>
              We take data security seriously. Personal information is handled according to our Privacy Policy. Sensitive operations
              (payments, authentication) use industry-standard protections.
            </Text>
          </SectionCard>

          <SectionCard title="Open Source & Credits">
            <Text style={[styles.bodyText, { color: colors.onSurface }]}>
              Built with React Native and other open-source libraries. Thank you to the community.
            </Text>
          </SectionCard>

          <SectionCard title="Legal & Links">
            <View style={{ marginBottom: 8 }}>
              <Pressable
                style={styles.linkRow}
                onPress={() => Linking.openURL('https://www.gsneuroscience.com/privacypolicy')}
              >
                <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>
                <MaterialIcons name="open-in-new" size={16} color={colors.onSurface} />
              </Pressable>
            </View>

            
          </SectionCard>

          <SectionCard title="Contact">
            <Text style={[styles.bodyText, { color: colors.onSurface }]}>
              For support or partnership inquiries:
            </Text>

            <View style={styles.row}>
              <Pressable
                style={[styles.contactButton, { backgroundColor: colors.primary, shadowColor: colors.onSurface }]}
                onPress={() => Linking.openURL(`mailto:${companyGmail}`)}
              >
                <MaterialIcons name="email" size={18} color={colors.onPrimary} />
                <Text style={[styles.buttonText, { color: colors.onPrimary }]}> Email</Text>
              </Pressable>

              <Pressable
                style={[styles.contactButton, { marginLeft: 12, backgroundColor: colors.primary, shadowColor: colors.onSurface }]}
                onPress={() => Linking.openURL(`tel:${companyMobile}`)}
              >
                <MaterialIcons name="call" size={18} color={colors.onPrimary} />
                <Text style={[styles.buttonText, { color: colors.onPrimary }]}> Call</Text>
              </Pressable>
            </View>
          </SectionCard>

          <View style={{ alignItems: 'center', marginTop: 18 }}>
            <Text style={[styles.bodyText, { color: colors.outline }]}>© {new Date().getFullYear()} {companyName}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },

  bodyText: { fontSize: 14, lineHeight: 20 },

  row: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: { marginLeft: 6, fontWeight: '600' },

  aboutHero: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoPlaceholder: { width: 64, height: 64, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 18, fontWeight: '700' },
  appVersion: { fontSize: 13 },

  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  linkText: { marginRight: 6, fontWeight: '600' },
});
