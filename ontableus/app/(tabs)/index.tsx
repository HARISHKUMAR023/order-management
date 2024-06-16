import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { firestore } from '@/firebaseConfig';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Table {
  id: number;
  cart: CartItem[];
  order: Order | null;
}

interface Order {
  id: string;
  items: CartItem[];
  status: string;
  totalAmount: number;
}

export default function Tab() {
  // const [tables, setTables] = useState<Table[]>([
  //   { id: 1, cart: [], order: null },
  //   { id: 2, cart: [], order: null },
  //   { id: 3, cart: [], order: null },
  //   { id: 4, cart: [], order: null },
  //   { id: 5, cart: [], order: null },
  // ]);

  // const [selectedTable, setSelectedTable] = useState<number | null>(null);
  // const [productList] = useState<Product[]>([
  //   { id: 1, name: 'Pizza', price: 200 },
  //   { id: 2, name: 'Burger', price: 40 },
  //   { id: 3, name: 'Pasta', price: 130 },
  //   { id: 4, name: 'Salad', price: 45 },
  //   { id: 5, name: 'Soda', price: 25 },
  // ]);

  // const addProductToCart = (tableId: number, product: Product) => {
  //   setTables(tables.map(table => {
  //     if (table.id === tableId) {
  //       const existingProductIndex = table.cart.findIndex(item => item.id === product.id);
  //       let updatedCart;
  //       if (existingProductIndex >= 0) {
  //         updatedCart = [...table.cart];
  //         updatedCart[existingProductIndex].quantity += 1;
  //       } else {
  //         updatedCart = [...table.cart, { ...product, quantity: 1 }];
  //       }
  //       return { ...table, cart: updatedCart };
  //     }
  //     return table;
  //   }));
  // };

  // const submitOrder = async (tableId: number) => {
  //   const table = tables.find(t => t.id === tableId);
  //   if (table) {
  //     const totalAmount = table.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  //     const newOrder: Order = { id: '', items: table.cart, status: 'submitted', totalAmount };
  //     try {
  //       const docRef = await addDoc(collection(firestore, 'orders'), {
  //         tableId,
  //         items: newOrder.items,
  //         status: newOrder.status,
  //         totalAmount: newOrder.totalAmount,
  //       });
  //       newOrder.id = docRef.id;
  //       setTables(tables.map(t =>
  //         t.id === tableId
  //           ? { ...t, order: newOrder, cart: [] }
  //           : t
  //       ));
  //     } catch (error) {
  //       console.error("Error submitting order: ", error);
  //     }
  //   }
  // };

  // const updateOrder = async (tableId: number, extraItem: Product) => {
  //   const table = tables.find(t => t.id === tableId);
  //   if (table && table.order) {
  //     const updatedItems = [...table.order.items];
  //     const existingProductIndex = updatedItems.findIndex(item => item.id === extraItem.id);
  //     if (existingProductIndex >= 0) {
  //       updatedItems[existingProductIndex].quantity += 1;
  //     } else {
  //       updatedItems.push({ ...extraItem, quantity: 1 });
  //     }
  //     const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  //     const updatedOrder = { ...table.order, items: updatedItems, totalAmount };
  //     try {
  //       const orderRef = doc(firestore, 'orders', table.order.id);
  //       await updateDoc(orderRef, {
  //         items: updatedOrder.items,
  //         totalAmount: updatedOrder.totalAmount,
  //       });
  //       setTables(tables.map(t =>
  //         t.id === tableId
  //           ? { ...t, order: updatedOrder }
  //           : t
  //       ));
  //     } catch (error) {
  //       console.error("Error updating order: ", error);
  //     }
  //   }
  // };

  // const renderProduct = ({ item }: { item: Product }) => (
  //   <Pressable className='bg-orange-400 p-2 rounded-md mb-2'
  //     onPress={() => addProductToCart(selectedTable!, item)}
  //   >
  //     <Text className="text-white font-semibold text-center">{`Add ${item.name} - ₹ ${item.price}`}</Text>
  //   </Pressable>
  // );

  return (
    <View className="bg-black h-full w-full">
      <Text className='text-white'>welcome</Text>
      {/* <Text className="text-4xl font-bold text-center text-white bg-orange-600 p-4 shadow-lg">
        Restaurant Order Tracking
      </Text>
      <View className="flex-row flex-wrap justify-around p-4">
        {tables.map(table => (
          <Pressable key={table.id} onPress={() => setSelectedTable(table.id)} className="bg-orange-500 p-4 mt-2 rounded-sm items-center">
            <Image source={require('../../assets/images/table.png')} className="w-32 h-32 rounded-lg mb-2" style={styles.image} />
            <Text className="font-semibold text-white text-center">Table {table.id}</Text>
          </Pressable>
        ))}
      </View>

      {selectedTable && (
        <View className="p-4 rounded text-black bg-white mx-2">
          <Text className="text-lg font-semibold mb-2">Table {selectedTable} Order</Text>
          <FlatList
            data={productList}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
          />
          <Pressable className='bg-green-600 p-2 mt-2 rounded-md'
            onPress={() => submitOrder(selectedTable)}
            disabled={tables.find(table => table.id === selectedTable)?.cart.length === 0}
          >
            <Text className="font-semibold text-white text-center">Submit Order</Text>
          </Pressable>
          <Pressable className='bg-pink-600 p-2 mt-2 rounded-md'
            onPress={() => updateOrder(selectedTable, { id: 6, name: 'Extra Item', price: 1 })}
            disabled={!tables.find(table => table.id === selectedTable)?.order}
          >
            <Text className="font-semibold text-white text-center">Add Extra Item to Order</Text>
          </Pressable>
          <ScrollView className="mt-4">
            <Text className='text-green-500 text-lg font-semibold mb-2'>Cart:</Text>
            {tables.find(table => table.id === selectedTable)?.cart.map((item, index) => (
              <Text key={index} className="text-black">{`${item.name} - ${item.quantity} x ₹ ${item.price} = $${item.quantity * item.price}`}</Text>
            ))}
          </ScrollView>
          {tables.find(table => table.id === selectedTable)?.order && (
            <ScrollView className="mt-2">
              <Text className='text-rose-500 text-lg font-semibold mb-2'>Order:</Text>
              {tables.find(table => table.id === selectedTable)?.order?.items.map((item, index) => (
                <Text key={index} className="text-black">{`${item.name} - ${item.quantity} x ₹ ${item.price} = $${item.quantity * item.price}`}</Text>
              ))}
              <Text className='text-rose-500 text-lg font-bold mt-2'>
                {`Total Amount: ₹ ${tables.find(table => table.id === selectedTable)?.order?.totalAmount}`}
              </Text>
            </ScrollView>
          )}
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
