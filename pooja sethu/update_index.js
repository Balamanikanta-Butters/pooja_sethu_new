const fs = require('fs');
let fileContent = fs.readFileSync('src/app/(tabs)/index.tsx', 'utf8');

const targetStr = `        {/* Panchangam Banner */}
        <View style={styles.panchangamBanner}>
          <View style={styles.bannerHeader}>
            <Text style={styles.bannerDate}>{formattedDate}</Text>
            <View style={styles.sampleBadge}>
              <Text style={styles.sampleBadgeText}>SAMPLE DATA</Text>
            </View>
          </View>
          <Text style={styles.bannerTitle}>{t('todaysPanchangam')}</Text>
          <Text style={styles.bannerSubtitle}>
            {t('panchangamDesc')}
          </Text>

          <View style={styles.bannerGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('tithi')}</Text>
              <Text style={styles.gridValue}>Bahula Saptami</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('nakshatram')}</Text>
              <Text style={styles.gridValue}>Mrigasira</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('masamSamvatsaram')}</Text>
              <Text style={styles.gridValue}>Bhadrapada - Parabhava</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('sunriseSunset')}</Text>
              <Text style={styles.gridValue}>6:05 AM - 5:58 PM</Text>
            </View>
          </View>

          <View style={styles.timingsCard}>
            <View style={styles.timingsRow}>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeGood}>
                  <Text style={styles.timingBadgeTextGood}>Good</Text>
                </View>
                <Text style={styles.timingName}>Amrita Kalam</Text>
                <Text style={styles.timingTime}>10:42 – 12:18 PM</Text>
              </View>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeGood}>
                  <Text style={styles.timingBadgeTextGood}>Good</Text>
                </View>
                <Text style={styles.timingName}>Abhijit</Text>
                <Text style={styles.timingTime}>11:38 AM – 12:25 PM</Text>
              </View>
            </View>

            <View style={[styles.timingsRow, { marginTop: 16 }]}>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeAvoid}>
                  <Text style={styles.timingBadgeTextAvoid}>Avoid</Text>
                </View>
                <Text style={styles.timingName}>Rahu Kalam</Text>
                <Text style={styles.timingTime}>9:00 – 10:30 AM</Text>
              </View>
              <View style={styles.timingItem}>
                <View style={styles.timingBadgeAvoid}>
                  <Text style={styles.timingBadgeTextAvoid}>Avoid</Text>
                </View>
                <Text style={styles.timingName}>Yamagandam</Text>
                <Text style={styles.timingTime}>1:30 – 3:00 PM</Text>
              </View>
            </View>
          </View>
        </View>`;

const replacementStr = `        {/* Panchangam Banner */}
        <View style={styles.panchangamBanner}>
          <View style={styles.bannerHeader}>
            <Text style={styles.bannerDate}>{panchangam ? new Date(panchangam.day).toLocaleDateString('en-US', dateOptions) : formattedDate}</Text>
          </View>
          <Text style={styles.bannerTitle}>{t('todaysPanchangam')}</Text>
          <Text style={styles.bannerSubtitle}>
            {panchangam && panchangam.significance && panchangam.significance.en ? panchangam.significance.en : t('panchangamDesc')}
          </Text>

          {panchangam && (
          <View style={styles.bannerGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('tithi')}</Text>
              <Text style={styles.gridValue}>{panchangam.tithi}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('nakshatram')}</Text>
              <Text style={styles.gridValue}>{panchangam.nakshatram}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('masamSamvatsaram')}</Text>
              <Text style={styles.gridValue}>{panchangam.masam} - {panchangam.samvatsaram}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>{t('sunriseSunset')}</Text>
              <Text style={styles.gridValue}>{panchangam.sunrise.substring(0,5)} - {panchangam.sunset.substring(0,5)}</Text>
            </View>
          </View>
          )}

          {panchangam && (
          <View style={styles.timingsCard}>
            <View style={styles.timingsRow}>
              {panchangam.good_periods?.map((p, idx) => (
              <View key={idx} style={styles.timingItem}>
                <View style={styles.timingBadgeGood}>
                  <Text style={styles.timingBadgeTextGood}>Good</Text>
                </View>
                <Text style={styles.timingName}>{p.name}</Text>
                <Text style={styles.timingTime}>{p.from} - {p.to}</Text>
              </View>
              ))}
            </View>

            <View style={[styles.timingsRow, { marginTop: 16 }]}>
              {panchangam.avoid_periods?.map((p, idx) => (
              <View key={idx} style={styles.timingItem}>
                <View style={styles.timingBadgeAvoid}>
                  <Text style={styles.timingBadgeTextAvoid}>Avoid</Text>
                </View>
                <Text style={styles.timingName}>{p.name}</Text>
                <Text style={styles.timingTime}>{p.from} - {p.to}</Text>
              </View>
              ))}
            </View>
          </View>
          )}
        </View>`;

fileContent = fileContent.replace(targetStr, replacementStr);
fs.writeFileSync('src/app/(tabs)/index.tsx', fileContent);
console.log("Replaced successfully!");
