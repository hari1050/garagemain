import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../supabaseConfig'; // Adjust the import path as necessary

export default function ServiceDetails({ route }) {
  const { buttonName } = route.params;
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Example fetch from Supabase, adjust according to your data schema
      const { data, error } = await supabase
        .from('details')
        .select('*')
        .eq('name', buttonName)
        .single();

      if (error) {
        console.error('Error fetching details:', error.message);
      } else {
        setDetailData(data);
      }
    };

    fetchData();
  }, [buttonName]);

  return (
    <View style={styles.container}>
      <Text>Details for: {buttonName}</Text>
      {/* Render your detail data here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
