// screens/index.tsx or app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useContext, useLayoutEffect } from 'react';
import { Alert, Button, FlatList, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ItemsContext } from './context/ItemsContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { items, deleteItem } = useContext(ItemsContext);

  const handlePrintTime = async () => {
    //const currentTime = new Date().toLocaleTimeString();
    const message = `
    =========================
              XY
        123 Main Stree
            +91-987
    =========================
    Item         Qty   Price
    -------------------------
    Milk          2    25.00 
    Bread         1    30.00 
    Butter        1    45.00 
    Eggs          1    60.00 
    -------------------------
    Subtotal                   
    GST 5%                    
    -------------------------
    Grand Total               
    =========================
          THANK YOU VISIT
    =========================
    `;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteItem(items[index].id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Home" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* KPI Section */}
      <View style={styles.kpiContainer}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button title="Print Current Time" onPress={handlePrintTime} />
        </View>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>{items.length}</Text>
          <Text style={styles.kpiTitle}>Total Records</Text>
        </View>

        <View style={styles.kpiBox}>
          <Text style={styles.kpiValue}>
            ₹{" "}
            {items.reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0)}
          </Text>
          <Text style={styles.kpiTitle}>Total Amount</Text>
        </View>
      </View>

      <FlatList
  data={items}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item, index }) => (
    <TouchableOpacity
      style={styles.item}
      onLongPress={() => handleDelete(index)}
    >
      <View style={styles.itemLeft}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{item.id}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.itemTextName}>{item.name}</Text>
          <Text style={styles.itemText}>{item.date}</Text>
          <Text style={styles.itemText}>By: {item.by}</Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.amountText}>₹ {item.amount}</Text>
      </View>
    </TouchableOpacity>
  )}
  ListEmptyComponent={
    <Text style={{ textAlign: 'center', padding: 20, color: 'gray' }}>
      No items added yet.
    </Text>
  }
/>


      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    padding: 16,
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  kpiBox: {
    alignItems: 'center',
    flex: 1,
  },
  kpiTitle: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
    fontWeight: '500',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
   itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  idBadge: {
    backgroundColor: '#6200ea',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  idText: {
    color: 'white',
    fontSize: 12,
  },
  details: {
    flexShrink: 1,
  },
  itemTextName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemText: {
    fontSize: 14,
    color: '#666',
  },
  itemRight: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2979FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
