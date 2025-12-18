// app/screens/TermsScreen.tsx
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
  const colors = useColorSchemes();
  return (
    <Animatable.View
      animation="fadeInUp"
      duration={400}
      style={[styles.card, { backgroundColor: colors.surface }]}
      useNativeDriver
    >
      <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{title}</Text>
      <View style={{ marginTop: 8 }}>{children}</View>
    </Animatable.View>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const colors = useColorSchemes();
  return (
    <Animatable.View animation="fadeIn" duration={350} style={styles.faqItem} useNativeDriver>
      <Pressable
        onPress={() => setOpen((s) => !s)}
        style={styles.faqHeader}
        android_ripple={{ color: '#00000006' }}
      >
        <Text style={[styles.faqQuestion, { color: colors.onSurface }]}>{question}</Text>
        <MaterialIcons name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={colors.onSurface} />
      </Pressable>
      {open && (
        <Animatable.View animation="fadeInDown" duration={300} style={styles.faqBody} useNativeDriver>
          <Text style={[styles.faqAnswer, { color: colors.outline }]}>{answer}</Text>
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

const TermsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const colors = useColorSchemes();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  // Optional small FAQ relevant to Terms screen
  const faqs = [
    {
      question: 'When do these Terms take effect?',
      answer: 'These Terms are effective as of January 1, 2025 (the "Effective Date").',
    },
    {
      question: 'How will I know about changes?',
      answer:
        'We may update these Terms from time to time. Significant changes will be communicated through the App and/or email.',
    },
    {
      question: 'Who can I contact for legal questions?',
      answer: 'For legal questions contact legal@yourdomain.com or visit the Privacy Policy page linked in the app.',
    },
  ];

  return (
    <LinearGradient colors={[colors.surface, colors.secondaryContainer]} style={styles.gradient}>
      
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
      >
        

        <SectionCard title="Acceptance">
          <Text style={[styles.bodyText, { color: colors.onSurface }]}>
            By accessing or using the Appointment Booking App ("App"), you agree to be bound by these Terms. If you do not agree,
            do not use the App.
          </Text>
        </SectionCard>

        <SectionCard title="User Accounts">
          <Text style={[styles.bodyText, { color: colors.onSurface }]}>
            You are responsible for keeping your account credentials secure and for all activity under your account.
          </Text>
        </SectionCard>

        <SectionCard title="Payments and Cancellations">
          <Text style={[styles.bodyText, { color: colors.onSurface }]}>
            Payments processed through the App are subject to the provider's payment policy. Cancellation and refund rules are set
            by service providers and may vary.
          </Text>
        </SectionCard>

        <SectionCard title="Limitation of Liability">
          <Text style={[styles.bodyText, { color: colors.onSurface }]}>
            To the fullest extent permitted by law, the App is provided "as is" and we disclaim liability for indirect or incidental
            damages.
          </Text>
        </SectionCard>

        <SectionCard title="Changes to Terms">
          <Text style={[styles.bodyText, { color: colors.onSurface }]}>
            We may update these Terms from time to time. We will notify you of significant changes.
          </Text>
        </SectionCard>

        <SectionCard title="Contact for Terms">
          <Text style={[styles.bodyText, { color: colors.onSurface }]}>
            If you have questions about these Terms, email{' '}
            <Text
              style={[styles.linkText, { color: colors.primary }]}
              onPress={() => Linking.openURL('mailto:legal@yourdomain.com')}
            >
              legal@yourdomain.com
            </Text>{' '}
            or call{' '}
            <Text style={[styles.linkText, { color: colors.primary }]} onPress={() => Linking.openURL('tel:+15551234567')}>
              +1 555 123 4567
            </Text>
            .
          </Text>
        </SectionCard>

        <SectionCard title="Notes">
          <Text style={[styles.bodyText, { color: colors.outline, fontStyle: 'italic' }]}>
            This is a sample Terms & Conditions. Have them reviewed by legal counsel before publishing.
          </Text>
        </SectionCard>

        {/* Small FAQ at bottom */}
        <SectionCard title="Related Questions">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={f.question} answer={f.answer} />
          ))}
        </SectionCard>
      </ScrollView>
    </LinearGradient>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e6e9ef',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  gradient: { flex: 1, paddingHorizontal: 6, paddingTop: 8 },
  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },

  bodyText: { fontSize: 14, color: '#333', lineHeight: 20 },

  row: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
  },
  buttonText: { marginLeft: 6, fontWeight: '600' },

  faqItem: {
    marginBottom: 8,
  },

  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  faqQuestion: { fontSize: 15, fontWeight: '600', flexWrap : 'wrap' },
  faqBody: { paddingVertical: 8 },
  faqAnswer: { color: '#444', fontSize: 14 },

  tncHeading: { fontSize: 15, fontWeight: '700', marginBottom: 6 },

  aboutHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 18, fontWeight: '700' },
  appVersion: { fontSize: 13, color: '#666' },

  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  linkText: { marginRight: 6, color: '#1f6feb', fontWeight: '600' },
});
