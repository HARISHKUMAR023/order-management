import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore } from '@/firebaseConfig';
import { collection, getDocs,onSnapshot } from 'firebase/firestore';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  tableId: number;
  items: CartItem[];
  status: string;
  totalAmount: number;
}

const AllOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const ordersCollection = collection(firestore, 'orders');
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersList);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.tableId}>Table {item.tableId}</Text>
      {item.items.map(product => (
        <Text key={`${item.id}-${product.id}`} style={styles.product}>
          {`${product.name} - ${product.quantity} x ₹${product.price} = ₹${product.quantity * product.price}`}
        </Text>
      ))}
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.totalAmount}>{`Total Amount: ₹${item.totalAmount}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>All Table Orders</Text>
      <FlatList
        style={styles.flatList}
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default AllOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  flatList: {
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  tableId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  product: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff8100',
    marginTop: 5,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
});