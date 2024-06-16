import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';
import { firestore } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

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
    const fetchOrders = async () => {
      const ordersCollection = collection(firestore, 'orders');
      const orderSnapshot = await getDocs(ordersCollection);
      const ordersList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersList);
    };

    fetchOrders();
  }, []);

  const renderOrder = ({ item }: { item: Order }) => (
    <View >
      <Text >Table {item.tableId}</Text>
      {item.items.map(product => (
        <Text key={`${item.id}-${product.id}`} >{`${product.name} - ${product.quantity} x $${product.price} = $${product.quantity * product.price}`}</Text>
      ))}
      <Text >Status: {item.status}</Text>
      <Text >{`Total Amount: $${item.totalAmount}`}</Text>
    </View>
  );

  return (
    <View >
      <Text >All Table Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id} // Use unique id from Firestore as key
      />
    </View>
  );
};

export default AllOrdersScreen;
