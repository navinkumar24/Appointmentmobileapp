import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import useColorSchemes from '@/themes/ColorSchemes'
import { ColorTheme } from '@/types/ColorTheme'


const DoctorProfile: React.FC = () => {
  const colors = useColorSchemes()
  const styles = dynamicStyles(colors)

  // Example data — replace with real data from your store or API
  const user = {
    name: 'Dr. Ajay Kumar',
    role: 'Product Designer',
    email: 'aisha.khan@example.com',
    phone: '+91 98765 43210',
    bio:
      'Designing delightful, human-centered products. Passionate about accessibility, motion and delightful micro-interactions.',
    avatar: null, // put a URI string here if available
    stats: {
      appointments: 128,
      reviews: 84,
      rating: 4.8,
    },
  }


  const PrimaryButton: React.FC<{ iconName: string | any; label: string }> = ({ iconName, label }) => (
    <Pressable style={styles.primaryButton} android_ripple={{ color: '#00000010' }}>
      <Ionicons name={iconName} size={18} style={styles.primaryIcon} />
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  )

  const OutlineButton: React.FC<{ iconName: string | any; label: string }> = ({ iconName, label }) => (
    <Pressable style={styles.outlineButton} android_ripple={{ color: '#00000006' }}>
      <Ionicons name={iconName} size={18} style={styles.outlineIcon} />
      <Text style={styles.outlineLabel}>{label}</Text>
    </Pressable>
  )

  const ListItem: React.FC<{ icon: string | any ; title: string ; subtitle?: string }> = ({ icon, title, subtitle }) => (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.75}>
      <View style={styles.listIconWrap}>
        <Ionicons name={icon} size={20} style={styles.listIcon} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text style={styles.listSubtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} style={styles.chevIcon} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Top gradient header */}
      <LinearGradient
        colors={[colors.primaryContainer, colors.secondaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View style={styles.avatarWrap}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{initials(user.name)}</Text>
              </View>
            )}
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={14} style={styles.icon} />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={14} style={styles.icon} />
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Ionicons name="pencil" size={18} style={styles.editIcon} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card row — stats */}
        <View style={styles.statsRow}>
          <StatCard label="Appointments" value={user.stats.appointments} colors={colors} />
          <StatCard label="Reviews" value={user.stats.reviews} colors={colors} />
          <StatCard label="Rating" value={user.stats.rating} suffix="★" colors={colors} />
        </View>

        {/* Bio */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.cardText}>{user.bio}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <PrimaryButton iconName="chatbubble-outline" label="Message" />
          <OutlineButton iconName="call-outline" label="Call" />
          <OutlineButton iconName="calendar-outline" label="Book" />
        </View>

        {/* Settings / details list */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <ListItem icon="card" title="Payment & Billing" subtitle="Manage cards and subscriptions" />
          <ListItem icon="notifications" title="Notifications" subtitle="Customize alerts" />
          <ListItem icon="shield-checkmark" title="Privacy" subtitle="Security settings" />
          <ListItem icon="help-circle" title="Help & Support" subtitle="Get assistance" />
        </View>

        {/* Recent activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityRow}>
            <View style={styles.activityDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>You completed a design review • 2 days ago</Text>
            </View>
            <Text style={styles.activityTime}>2d</Text>
          </View>
          <View style={styles.activityRow}>
            <View style={styles.activityDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>New review received (4.9) • 5 days ago</Text>
            </View>
            <Text style={styles.activityTime}>5d</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default DoctorProfile

/* ---------- Helper components ---------- */

const StatCard: React.FC<{ label: string; value: number | string; suffix?: string; colors: ColorTheme }> = ({
  label,
  value,
  suffix,
  colors,
}) => {
  return (
    <View style={[stylesStatic.statCard, { backgroundColor: colors.surfaceVariant }]}>
      <Text style={[stylesStatic.statValue]}>
        {value}
        {suffix ? <Text style={{ fontSize: 12 }}> {suffix}</Text> : null}
      </Text>
      <Text style={[stylesStatic.statLabel]}>{label}</Text>
    </View>
  )
}



/* ---------- Utilities & styles ---------- */

const initials = (fullName: string) => {
  return fullName
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Static styles used by internal subcomponents (these use neutral tokens — main theme applied in dynamicStyles)
const stylesStatic = StyleSheet.create({
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
})

const dynamicStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 18,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 6,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarWrap: {
      width: 80,
      height: 80,
      borderRadius: 16,
      overflow: 'hidden',
      marginRight: 14,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    avatarFallback: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.tertiaryContainer,
    },
    avatarInitial: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.onTertiaryContainer || '#fff',
    },
    headerInfo: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.onPrimaryContainer,
    },
    role: {
      fontSize: 13,
      color: colors.onPrimaryContainer,
      opacity: 0.9,
      marginTop: 2,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    contactText: {
      marginLeft: 6,
      fontSize: 12,
      color: colors.onPrimaryContainer,
      opacity: 0.95,
    },
    icon: {
      color: colors.onPrimaryContainer,
      opacity: 0.9,
    },
    editButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    editIcon: {
      marginRight: 6,
      color: colors.primary,
    },
    editText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 24,
    },
    statsRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 8,
      color: colors.onSurface,
    },
    cardText: {
      fontSize: 13,
      color: colors.onSurfaceVariant || colors.onSurface,
      lineHeight: 20,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      marginRight: 8,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryIcon: {
      marginRight: 8,
      color: colors.onPrimary,
    },
    primaryLabel: {
      color: colors.onPrimary,
      fontWeight: '700',
    },
    outlineButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.outline || colors.primary,
      paddingVertical: 12,
      marginLeft: 8,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    outlineIcon: {
      marginRight: 8,
      color: colors.primary,
    },
    outlineLabel: {
      color: colors.primary,
      fontWeight: '700',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outline || '#eee',
    },
    listIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      backgroundColor: colors.primaryContainer,
    },
    listIcon: {
      color: colors.onPrimaryContainer,
    },
    listTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.onSurface,
    },
    listSubtitle: {
      fontSize: 12,
      color: colors.onSurfaceVariant || '#666',
      marginTop: 2,
    },
    chevIcon: {
      color: colors.onSurfaceVariant || '#999',
    },
    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outline || '#eee',
    },
    activityDot: {
      width: 8,
      height: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
      marginRight: 12,
    },
    activityText: {
      fontSize: 13,
      color: colors.onSurfaceVariant || '#444',
    },
    activityTime: {
      fontSize: 12,
      color: colors.onSurfaceVariant || '#888',
      marginLeft: 8,
    },
  })

/* End of file */
