
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Linking,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import useColorSchemes from '@/themes/ColorSchemes';
import { LinearGradient } from 'expo-linear-gradient';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const colors = useColorSchemes()
  return (
    <Animatable.View animation="fadeInUp" duration={400} style={[styles.card, { backgroundColor: colors.surface }]} useNativeDriver>
      <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{title}</Text>
      <View style={{ marginTop: 8 }}>{children}</View>
    </Animatable.View>
  )
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const colors = useColorSchemes()
  return (
    <Animatable.View animation="fadeIn" duration={350} style={styles.faqItem} useNativeDriver>
      <Pressable onPress={() => setOpen((s) => !s)} style={styles.faqHeader} android_ripple={{ color: '#00000006' }}>
        <Text style={[styles.faqQuestion, { color: colors.onSurface }]}>{question}</Text>
        <MaterialIcons name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} />
      </Pressable>
      {open && (
        <Animatable.View animation="fadeInDown" duration={300} style={styles.faqBody} useNativeDriver>
          <Text style={[styles.faqAnswer, { color: colors.outline }]}>{answer}</Text>
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

const HelpCenterScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const colors = useColorSchemes()

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer:
        'Open the Services page, choose a service, select an available slot and confirm. You will receive a confirmation in-app and by email.',
    },
    {
      question: 'Can I reschedule or cancel?',
      answer:
        'Yes — open the "My Appointments" tab, pick the appointment and choose reschedule or cancel. Fees may apply depending on the provider policy.',
    },
    {
      question: 'How do I contact support?',
      answer: 'Use the contact form in this screen or write to support@yourdomain.com. For urgent matters call +1 555 123 4567.',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <LinearGradient
      colors={[colors.surface, colors.secondaryContainer]}
      style={styles.gradient}
    >
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="Frequently Asked Questions">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={f.question} answer={f.answer} />
          ))}
        </SectionCard>

        <SectionCard title="Contact Support">
          <Text style={[styles.bodyText, { color: colors.onSurface }]}>
            We're here to help. Tap a button below to get in touch or visit our support portal for guides and troubleshooting.
          </Text>

          <View style={styles.row}>
            <Pressable style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.onSurface, }]} onPress={() => Linking.openURL('mailto:support@yourdomain.com')}>
              <Entypo name="email" size={18} color={colors.onPrimary} />
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}> Email Support</Text>
            </Pressable>

            <Pressable style={[styles.button, { marginLeft: 12, backgroundColor: colors.primary, shadowColor: colors.onSurface, }]} onPress={() => Linking.openURL('tel:+15551234567')}>
              <MaterialIcons name="call" size={18} color={colors.onPrimary} />
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}> Call Us</Text>
            </Pressable>
          </View>
        </SectionCard>

        <SectionCard title="Quick Guides">
          <Text style={styles.bodyText}>Getting started video, booking walkthroughs and tips to make the most of the app.</Text>
        </SectionCard>
      </ScrollView>
    </LinearGradient>
  );
};

export default HelpCenterScreen;




// Shared styles used by all three components
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: StyleSheet.hairlineWidth,},
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { flex: 1 },
  gradient: { flex: 1, paddingHorizontal: 6, paddingTop: 16 },
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

  bodyText: { fontSize: 14, color: '#333', lineHeight: 20 },

  row: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8},
  buttonText: { marginLeft: 6, fontWeight: '600' },

  faqItem: {
    marginBottom: 8
  },

  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  faqQuestion: { fontSize: 15, fontWeight: '600' },
  faqBody: { paddingVertical: 8 },
  faqAnswer: { color: '#444', fontSize: 14 },

  tncHeading: { fontSize: 15, fontWeight: '700', marginBottom: 6 },

  aboutHero: { flexDirection: 'row', alignItems: 'center',  padding: 14, borderRadius: 12, marginBottom: 12 },
  logoPlaceholder: { width: 64, height: 64, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 18, fontWeight: '700' },
  appVersion: { fontSize: 13, color: '#666' },

  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  linkText: { marginRight: 6, color: '#1f6feb', fontWeight: '600' },
});

