import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView,  StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { firestore } from '@/firebaseConfig';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native-virtualized-view';
interface Product {
  id: number;
  name: string;
  price: number;
  icon?: string;
  category: string;
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productList] = useState<Product[]>([
    { id: 1, name: 'Veg Momos', price: 70, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 2, name: 'Corn Momos', price: 80, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 3, name: 'Cold Coffee', price: 70, icon: require('../../assets/images/icone/coffee.png'), category: 'Signature' },
    { id: 4, name: 'Hot Coffee', price: 80, icon: require('../../assets/images/icone/coffee.png'), category: 'Signature' },
    { id: 5, name: 'Pizza', price: 200, icon: require('../../assets/images/icone/pizza.png'), category: 'Main Course' },
    { id: 6, name: 'Burger', price: 40, icon: require('../../assets/images/icone/burger.png'), category: 'Main Course' },
    { id: 7, name: 'Pasta', price: 130, icon: require('../../assets/images/icone/pasta.png'), category: 'Main Course' },
    { id: 8, name: 'Salad', price: 45, icon: require('../../assets/images/icone/salad.png'), category: 'Starters' },
    { id: 9, name: 'Soda', price: 25, icon: require('../../assets/images/icone/soda.png'), category: 'Beverages' },
    { id: 10, name: 'Panner Tikka Momos', price: 100, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 11, name: 'Mushroom Momos', price: 90, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 12, name: 'Chocolate Momos', price: 120, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 13, name: 'Chicken Momos', price: 100, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 14, name: 'Chicken Hariyali Momos', price: 110, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 15, name: 'Chicken Peri Peri', price: 110, icon: require('../../assets/images/icone/momo.png'), category: 'Momos' },
    { id: 16, name: 'Classic French Fries', price: 70, icon: require('../../assets/images/icone/fried.png'), category: 'Fries' },
    { id: 17, name: 'Peri Peri ', price: 90, icon: require('../../assets/images/icone/fried.png'), category: 'Fries' },
    { id: 18, name: 'Cheese Balls', price: 90, icon: require('../../assets/images/icone/fried.png'), category: 'Fries' },
    { id: 19, name: 'Veg Nuggets', price: 90, icon: require('../../assets/images/icone/fried.png'), category: 'Fries' },
    { id: 20, name: 'Chicken Nuggets', price: 120, icon: require('../../assets/images/icone/fried.png'), category: 'Fries' },
    { id: 21, name: 'Crispy Chicken Strips', price: 100, icon: require('../../assets/images/icone/fried.png'), category: 'Fries' },
   {id: 22, name: 'Caramel Coffee', price: 100, icon: require('../../assets/images/icone/coffee.png'), category: 'Signature' },
   {id: 23, name: 'Hazelnut COffee', price: 100, icon: require('../../assets/images/icone/coffee.png'), category: 'Signature' },

   {id: 24, name: 'Affogato Signature', price: 120, icon: require('../../assets/images/icone/coffee.png'), category: 'Signature' },
   {id: 25, name: 'Blueberry', price: 90, icon: require('../../assets/images/icone/mojito.png'), category: 'MOJITO' },
   {id: 26, name: 'Green apple', price: 90, icon: require('../../assets/images/icone/mojito.png'), category: 'MOJITO' },
   {id: 27, name: 'virgin ', price: 90, icon: require('../../assets/images/icone/mojito.png'), category: 'MOJITO' },
   {id: 28, name: 'Lime Mint ', price: 80, icon: require('../../assets/images/icone/mojito.png'), category: 'MOJITO' },
   {id: 29, name: 'Strawberry ', price: 90, icon: require('../../assets/images/icone/mojito.png'), category: 'MOJITO' },
   {id: 30, name: 'Classic Omelette ', price: 50, icon: require('../../assets/images/icone/mojito.png'), category: 'Bread Omelette' },
   {id: 31, name: 'Cheese Omelette', price: 60, icon: require('../../assets/images/icone/mojito.png'), category: 'Bread Omelette' },
   {id: 32, name: 'Chilly cheese ', price: 70, icon: require('../../assets/images/icone/mojito.png'), category: 'Bread Omelette' },
   {id: 33, name: 'Double egg bread  ', price: 80, icon: require('../../assets/images/icone/mojito.png'), category: 'Bread Omelette' },


  ]);

  const categories = Array.from(new Set(productList.map(product => product.category)));

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

  const clearCart = (tableId: number) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, cart: [] } : table
    ));
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
    <Pressable style={styles.productButton} onPress={() => addProductToCart(selectedTable!, item)}>
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.priceText}>₹ {item.price}</Text>
    </Pressable>
  );

  const renderCategoryButton = ({ item }: { item: string }) => (
    <Pressable
      style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryButtonText, selectedCategory === item && styles.selectedCategoryButtonText]}>{item}</Text>
    </Pressable>
  );

  const filteredProducts = productList.filter(product => product.category === selectedCategory);

  return (
    <View style={styles.container}>
    <SafeAreaView  >
      <StatusBar barStyle="light-content" backgroundColor="#ff8100" />
      <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.mainTitle}>Restaurant Order Tracking</Text>
        <View style={styles.tableCard}>
          {tables.map(table => (
            <Pressable key={table.id} onPress={() => setSelectedTable(table.id)} style={[
              styles.tableIcon, 
              selectedTable === table.id && styles.activeTableIcon
            ]}>
              <Image source={require('../../assets/images/table.png')} style={styles.image} />
              <Text style={[styles.tableText, selectedTable === table.id && styles.activeTableText]}>Table {table.id}</Text>
            </Pressable>
          ))}
        </View>

        {selectedTable && (
          <View style={styles.tableView}>
            <Text style={styles.tableTitle}>Table {selectedTable} Order</Text>
           
            <FlatList
              horizontal
              data={categories}
              renderItem={renderCategoryButton}
              keyExtractor={item => item}
              style={styles.categoryList}
            />
          
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={item => item.id.toString()}
              style={styles.productList}
            />
            <Pressable 
              style={styles.submitButton} 
              onPress={() => submitOrder(selectedTable)}
              disabled={tables.find(table => table.id === selectedTable)?.cart.length === 0}>
              <Text style={styles.submitButtonText}>Submit Order</Text>
            </Pressable>
            <Pressable 
              style={styles.extraButton} 
              onPress={() => updateOrder(selectedTable, { id: 10, name: 'Extra Item', price: 1, category: 'Extras' })}
              disabled={!tables.find(table => table.id === selectedTable)?.order}>
              <Text style={styles.submitButtonText}>Add Extra Item</Text>
            </Pressable>
            <Pressable 
              style={styles.clearButton} 
              onPress={() => clearCart(selectedTable)}
              disabled={tables.find(table => table.id === selectedTable)?.cart.length === 0}>
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </Pressable>
            <View style={styles.cartView}>
              <Text style={styles.cartTitle}>Cart:</Text>
              {tables.find(table => table.id === selectedTable)?.cart.map((item, index) => (
                <Text key={index} style={styles.cartText}>{`${item.name} - ${item.quantity} x ₹ ${item.price} = ₹ ${item.quantity * item.price}`}</Text>
              ))}
            </View>
            {tables.find(table => table.id === selectedTable)?.order && (
              <View>
                <Text style={styles.cartTitle}>Order:</Text>
                {tables.find(table => table.id === selectedTable)?.order?.items.map((item, index) => (
                  <Text style={styles.cartText} key={index}>{`${item.name} - ${item.quantity} x ₹ ${item.price} = ₹ ${item.quantity * item.price}`}</Text>
                ))}
                <Text style={styles.totalAmountText}>
                  {`Total Amount: ₹ ${tables.find(table => table.id === selectedTable)?.order?.totalAmount}`}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#ff8100',
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  tableCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tableIcon: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  activeTableIcon: {
    backgroundColor: '#ff8100',
  },
  tableText: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  activeTableText: {
    color: '#fff',
  },
  tableView: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  tableTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
  categoryList: {
    marginBottom: 10,
  },
  productList: {
    maxHeight: 400,
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#ddd',
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#ff8100',
  },
  categoryButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  productButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  priceText: {
    fontWeight: 'bold',
    color: '#ff8100',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#ff8100',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  extraButton: {
    padding: 15,
    backgroundColor: '#ff8100',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    padding: 15,
    backgroundColor: '#ff8100',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  cartView: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  cartTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cartText: {
    fontWeight: 'bold',
  },
  totalAmountText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});
