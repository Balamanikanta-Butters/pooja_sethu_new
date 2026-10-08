const fs = require('fs');
let fileContent = fs.readFileSync('src/app/(tabs)/index.tsx', 'utf8');

// We also need to add the fetch for homeData
if (!fileContent.includes('const [homeData, setHomeData]')) {
    fileContent = fileContent.replace(
        'const [panchangam, setPanchangam] = useState<any>(null);',
        `const [panchangam, setPanchangam] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>({ popularPoojas: [], upcomingMuhurthams: [], festivals: [] });`
    );

    fileContent = fileContent.replace(
        'fetchPanchangam();',
        `fetchPanchangam();
    const fetchHomeData = async () => {
      try {
        const res = await fetch('http://192.168.88.6:5000/api/home');
        const data = await res.json();
        if (data.success) {
          setHomeData(data);
        }
      } catch (e) {
        console.error('Error fetching home data:', e);
      }
    };
    fetchHomeData();`
    );
}

const targetStrLower = `        {/* Upcoming good muhurthams */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('upcomingMuhurthams')}</Text>
          <View style={styles.sampleBadgeInline}>
            <Text style={styles.sampleBadgeTextInline}>SAMPLE</Text>
          </View>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={styles.horizontalCard} onPress={() => router.push('/pooja/list')}>
            <View style={styles.muhurthamBadge}>
              <Text style={styles.muhurthamBadgeText}>Gruhapravesam</Text>
            </View>
            <Text style={styles.cardMainTitle}>Thu, 22 Oct</Text>
            <Text style={styles.cardDesc}>7:10 – 8:52 AM · Vrischika lagnam</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.horizontalCard} onPress={() => router.push('/pooja/list')}>
            <View style={styles.muhurthamBadge}>
              <Text style={styles.muhurthamBadgeText}>Vivaham</Text>
            </View>
            <Text style={styles.cardMainTitle}>Sun, 25 Oct</Text>
            <Text style={styles.cardDesc}>Night 10:32 PM · Simha lagnam</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Festivals ahead */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('festivalsAhead')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={[styles.horizontalCard, { height: 100 }]} onPress={() => router.push('/pooja/list')}>
            <Text style={styles.cardMainTitle}>Devi Navaratri</Text>
            <Text style={[styles.cardDesc, { marginTop: 8 }]}>Begins Sun, 11 Oct</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.horizontalCard, { height: 100 }]} onPress={() => router.push('/pooja/list')}>
            <Text style={styles.cardMainTitle}>Vijaya Dashami</Text>
            <Text style={[styles.cardDesc, { marginTop: 8 }]}>Tue, 20 Oct</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Popular Poojas */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('popularPoojas')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.horizontalScroll, { marginBottom: 40 }]}>
          <TouchableOpacity 
            style={styles.horizontalCard} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                title: 'Gruhapravesam',
                subtitle: 'గృహప్రవేశం',
                price: 'Dakshina From ₹4,300',
                desc: 'House-warming with Ganapathi Pooja, Vastu Pooja and milk boiling before the family moves in.',
                duration: '3 hrs'
              }
            })}
          >
            <Text style={styles.cardMainTitle}>Gruhapravesam</Text>
            <Text style={styles.cardSubTitle}>గృహప్రవేశం</Text>
            <Text style={[styles.cardDesc, { marginTop: 16 }]}>From ₹4,300</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.horizontalCard} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                title: 'Satyanarayana Vratham',
                subtitle: 'సత్యనారాయణ వ్రతం',
                price: 'Dakshina From ₹2,600',
                desc: 'A powerful vratham dedicated to Lord Vishnu for peace, prosperity and resolving obstacles.',
                duration: '2.5 hrs'
              }
            })}
          >
            <Text style={styles.cardMainTitle}>Satyanarayana Vratham</Text>
            <Text style={styles.cardSubTitle}>సత్యనారాయణ వ్రతం</Text>
            <Text style={[styles.cardDesc, { marginTop: 16 }]}>From ₹2,600</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.horizontalCard} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                title: 'Ganapathi Homam',
                subtitle: 'గణపతి హోమం',
                price: 'Dakshina From ₹3,800',
                desc: 'Invoking Lord Ganesha to remove obstacles and bless new beginnings.',
                duration: '2 hrs'
              }
            })}
          >
            <Text style={styles.cardMainTitle}>Ganapathi Homam</Text>
            <Text style={styles.cardSubTitle}>గణపతి హోమం</Text>
            <Text style={[styles.cardDesc, { marginTop: 16 }]}>From ₹3,800</Text>
          </TouchableOpacity>
        </ScrollView>`;

const replacementStrLower = `        {/* Upcoming good muhurthams */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('upcomingMuhurthams')}</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {homeData.upcomingMuhurthams.map((m: any, idx: number) => (
          <TouchableOpacity key={idx} style={styles.horizontalCard} onPress={() => router.push('/pooja/list')}>
            <View style={styles.muhurthamBadge}>
              <Text style={styles.muhurthamBadgeText}>{m.details?.en || 'Muhurtham'}</Text>
            </View>
            <Text style={styles.cardMainTitle}>{new Date(m.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
            <Text style={styles.cardDesc}>{m.start_time.substring(0,5)} – {m.end_time.substring(0,5)}</Text>
          </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Festivals ahead */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('festivalsAhead')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {homeData.festivals.map((f: any, idx: number) => (
          <TouchableOpacity key={idx} style={[styles.horizontalCard, { height: 100 }]} onPress={() => router.push('/pooja/list')}>
            <Text style={styles.cardMainTitle}>{f.significance.en}</Text>
            <Text style={[styles.cardDesc, { marginTop: 8 }]}>{new Date(f.day).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
          </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Poojas */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('popularPoojas')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.horizontalScroll, { marginBottom: 40 }]}>
          {homeData.popularPoojas.map((p: any, idx: number) => (
          <TouchableOpacity 
            key={idx}
            style={styles.horizontalCard} 
            onPress={() => router.push({
              pathname: '/pooja/details',
              params: {
                title: p.name.en,
                subtitle: p.name.te || p.name.en,
                price: 'Check prices',
                desc: p.description?.en || '',
                duration: 'View details'
              }
            })}
          >
            <Text style={styles.cardMainTitle}>{p.name.en}</Text>
            <Text style={styles.cardSubTitle}>{p.name.te || p.name.en}</Text>
            <Text style={[styles.cardDesc, { marginTop: 16 }]} numberOfLines={1}>{p.description?.en || ''}</Text>
          </TouchableOpacity>
          ))}
        </ScrollView>`;

fileContent = fileContent.replace(targetStrLower, replacementStrLower);
fs.writeFileSync('src/app/(tabs)/index.tsx', fileContent);
console.log("Replaced successfully!");
