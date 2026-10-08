const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pooja sethu/src/app/(tabs)/index.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const regexMuhurthams = /\{\/\* Upcoming good muhurthams \*\/\}.*?<\/ScrollView>/s;
const newMuhurthams = `{/* Upcoming good muhurthams */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('upcomingMuhurthams')}</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {homeData.upcomingMuhurthams && homeData.upcomingMuhurthams.map((muhurtham: any, idx: number) => {
             const start = new Date(muhurtham.starts_at);
             const end = new Date(muhurtham.ends_at);
             const dateStr = start.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
             const timeStr = \`\${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - \${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}\`;

             return (
               <TouchableOpacity key={idx} style={styles.horizontalCard} onPress={() => router.push('/pooja/list')}>
                 <View style={styles.muhurthamBadge}>
                   <Text style={styles.muhurthamBadgeText}>{muhurtham.quality || 'Good'}</Text>
                 </View>
                 <Text style={styles.cardMainTitle}>{dateStr}</Text>
                 <Text style={styles.cardDesc}>{timeStr} · {muhurtham.lagnam} lagnam</Text>
               </TouchableOpacity>
             );
          })}
          {(!homeData.upcomingMuhurthams || homeData.upcomingMuhurthams.length === 0) && (
            <Text style={{ color: '#888', marginTop: 10, paddingLeft: 10 }}>No upcoming muhurthams found.</Text>
          )}
        </ScrollView>`;

content = content.replace(regexMuhurthams, newMuhurthams);

const regexFestivals = /\{\/\* Festivals ahead \*\/\}.*?<\/ScrollView>/s;
const newFestivals = `{/* Festivals ahead */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('festivalsAhead')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {homeData.festivals && homeData.festivals.map((festival: any, idx: number) => {
             const date = new Date(festival.day);
             const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
             const significanceEn = festival.significance?.en || 'Festival';

             return (
               <TouchableOpacity key={idx} style={[styles.horizontalCard, { height: 100 }]} onPress={() => router.push('/pooja/list')}>
                 <Text style={styles.cardMainTitle}>{significanceEn}</Text>
                 <Text style={[styles.cardDesc, { marginTop: 8 }]}>{dateStr}</Text>
               </TouchableOpacity>
             );
          })}
          {(!homeData.festivals || homeData.festivals.length === 0) && (
            <Text style={{ color: '#888', marginTop: 10, paddingLeft: 10 }}>No festivals coming up soon.</Text>
          )}
        </ScrollView>`;

content = content.replace(regexFestivals, newFestivals);

const regexPoojas = /\{\/\* Popular Poojas \*\/\}.*?<\/ScrollView>/s;
const newPoojas = `{/* Popular Poojas */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t('popularPoojas')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.horizontalScroll, { marginBottom: 40 }]}>
          {homeData.popularPoojas && homeData.popularPoojas.map((pooja: any) => (
             <TouchableOpacity 
               key={pooja.id}
               style={styles.horizontalCard} 
               onPress={() => router.push({
                 pathname: '/pooja/details',
                 params: {
                   id: pooja.id,
                   title: pooja.name,
                   subtitle: pooja.name,
                   price: 'Check Details',
                   desc: pooja.significance?.en || 'Detailed pooja services',
                   duration: 'Varies'
                 }
               })}
             >
               <Text style={styles.cardMainTitle}>{pooja.name}</Text>
               <Text style={styles.cardSubTitle}>{pooja.name}</Text>
               <Text style={[styles.cardDesc, { marginTop: 16 }]}>{pooja.code}</Text>
             </TouchableOpacity>
          ))}
          {(!homeData.popularPoojas || homeData.popularPoojas.length === 0) && (
            <Text style={{ color: '#888', marginTop: 10, paddingLeft: 10 }}>No poojas available right now.</Text>
          )}
        </ScrollView>`;

content = content.replace(regexPoojas, newPoojas);

fs.writeFileSync(filePath, content);
console.log('Successfully updated index.tsx!');
