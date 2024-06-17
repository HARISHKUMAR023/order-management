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
  const [tables, setTables] = useState<Table[]>([
    { id: 1, cart: [], order: null },
    { id: 2, cart: [], order: null },
    { id: 3, cart: [], order: null },
    { id: 4, cart: [], order: null },
    { id: 5, cart: [], order: null },
  ]);

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [productList] = useState<Product[]>([
    { id: 1, name: 'Pizza', price: 200 },
    { id: 2, name: 'Burger', price: 40 },
    { id: 3, name: 'Pasta', price: 130 },
    { id: 4, name: 'Salad', price: 45 },
    { id: 5, name: 'Soda', price: 25 },
  ]);

  const addProductToCart = (tableId: number, product: Product) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const existingProductIndex = table.cart.findIndex(item => item.id === product.id);
        let updatedCart;
        if (existingProductIndex >= 0) {
          updatedCart = [...table.cart];
          updatedCart[existingProductIndex].quantity += 1;
        } else {
          updatedCart = [...table.cart, { ...product, quantity: 1 }];
        }
        return { ...table, cart: updatedCart };
      }
      return table;
    }));
  };

  const submitOrder = async (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const totalAmount = table.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newOrder: Order = { id: '', items: table.cart, status: 'submitted', totalAmount };
      try {
        const docRef = await addDoc(collection(firestore, 'orders'), {
          tableId,
          items: newOrder.items,
          status: newOrder.status,
          totalAmount: newOrder.totalAmount,
        });
        newOrder.id = docRef.id;
        setTables(tables.map(t =>
          t.id === tableId
            ? { ...t, order: newOrder, cart: [] }
            : t
        ));
      } catch (error) {
        console.error("Error submitting order: ", error);
      }
    }
  };

  const updateOrder = async (tableId: number, extraItem: Product) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.order) {
      const updatedItems = [...table.order.items];
      const existingProductIndex = updatedItems.findIndex(item => item.id === extraItem.id);
      if (existingProductIndex >= 0) {
        updatedItems[existingProductIndex].quantity += 1;
      } else {
        updatedItems.push({ ...extraItem, quantity: 1 });
      }
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const updatedOrder = { ...table.order, items: updatedItems, totalAmount };
      try {
        const orderRef = doc(firestore, 'orders', table.order.id);
        await updateDoc(orderRef, {
          items: updatedOrder.items,
          totalAmount: updatedOrder.totalAmount,
        });
        setTables(tables.map(t =>
          t.id === tableId
            ? { ...t, order: updatedOrder }
            : t
        ));
      } catch (error) {
        console.error("Error updating order: ", error);
      }
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable style={styles.btn}
      onPress={() => addProductToCart(selectedTable!, item)}
    >
      <Text >{`Add ${item.name} - ₹ ${item.price}`}</Text>
    </Pressable>
  );

  return (
    <View  >
      <Text style={styles.main_title} >
        Restaurant Order Tracking
      </Text>
      <View style={styles.tablecard}>
        {tables.map(table => (
          <Pressable key={table.id} onPress={() => setSelectedTable(table.id)} style={[
            styles.tableicone, 
            selectedTable === table.id && styles.activeTableicone // Apply the active style conditionally
          ]} >
            <Image source={require('../../assets/images/table.png')} style={styles.image} />
            <Text style={selectedTable===table.id && styles.activeTableicone} >Table {table.id}</Text>
          </Pressable>
        ))}
      </View>

      {selectedTable && (
        <View  style={styles.tableview}>
          <Text style={{fontWeight:'bold'}} >Table {selectedTable} Order</Text>
          <FlatList
            data={productList}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
          />
          <Pressable style={styles.btnsubmit}
            onPress={() => submitOrder(selectedTable)}
            disabled={tables.find(table => table.id === selectedTable)?.cart.length === 0}
          >
            <Text style={styles.btnsubmittext} >Submit Order</Text>
          </Pressable>
          <Pressable  style={styles.btnsubmit}
            onPress={() => updateOrder(selectedTable, { id: 6, name: 'Extra Item', price: 1 })}
            disabled={!tables.find(table => table.id === selectedTable)?.order}
          >
            <Text style={styles.btnsubmittext} >Add Extra Item to Order</Text>
          </Pressable>
          <ScrollView style={styles.cartview}>
            <Text >Cart:</Text>
            {tables.find(table => table.id === selectedTable)?.cart.map((item, index) => (
              <Text key={index} >{`${item.name} - ${item.quantity} x ₹ ${item.price} = $${item.quantity * item.price}`}</Text>
            ))}
          </ScrollView>
          {tables.find(table => table.id === selectedTable)?.order && (
            <ScrollView >
              <Text >Order:</Text>
              {tables.find(table => table.id === selectedTable)?.order?.items.map((item, index) => (
                <Text key={index} >{`${item.name} - ${item.quantity} x ₹ ${item.price} = $${item.quantity * item.price}`}</Text>
              ))}
              <Text >
                {`Total Amount: ₹ ${tables.find(table => table.id === selectedTable)?.order?.totalAmount}`}
              </Text>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
  btn:{
    padding: 10,
    backgroundColor: 'lightblue',
    margin: 10,
  },
  tableicone:{
    padding: 10,
    backgroundColor: 'white',
    borderRadius:10,
   fontWeight: 'bold',
    shadowColor: "#000000",
shadowOffset: {
  width: 0,
  height: 4,
},
shadowOpacity:  0.19,
shadowRadius: 5.62,
elevation: 6
  },
  tablecard:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 10,
  },
  main_title:{
    padding: 15,
    backgroundColor: '#1f1f1f',
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
    color: 'white',
    fontWeight: 'bold',
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity:  0.19,
    shadowRadius: 5.62,
    elevation: 6
  },
  activeTableicone: {
    // styles for the active table button, e.g., background color change
    backgroundColor: '#ff8100', 
    color:'white',// Example color
    fontWeight:'bold'
  },
  cartview:{
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius:10,
   fontWeight: 'bold',
    shadowColor: "#000000",
shadowOffset: {
  width: 0,
  height: 4,
},
shadowOpacity:  0.19,
shadowRadius: 5.62,
elevation: 6

  },
  btnsubmit:{
    padding: 10,
    backgroundColor: '#ff8100',
    margin: 10,
    borderRadius:10,
   fontWeight: 'bold',
    shadowColor: "#000000",
  },
  btnsubmittext:{
fontWeight: 'bold',
color: 'white',
  },
  tableview:{
    padding: 10,
    backgroundColor: 'white',
    borderRadius:10,
   fontWeight: 'bold',
    shadowColor: "#000000",
shadowOffset: {
  width: 0,
  height: 4,
},
shadowOpacity:  0.19,
shadowRadius: 5.62,
elevation: 6
  }
  

});
