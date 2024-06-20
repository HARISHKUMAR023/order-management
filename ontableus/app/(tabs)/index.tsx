import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { firestore } from '@/firebaseConfig';  // Ensure this path is correct
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native-virtualized-view';

interface Product {
  id: string;
  name: string;
  price: number;
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
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'products'));
        const productsData: Product[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          productsData.push({ id: doc.id, ...data } as Product);
        });
        setProductList(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

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
    <Pressable
      key={item.id} // Add this key prop
      style={styles.productButton}
      onPress={() => addProductToCart(selectedTable!, item)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.priceText}>₹ {item.price}</Text>
    </Pressable>
  );

  const renderCategoryButton = ({ item }: { item: string }) => (
    <Pressable
      key={item} // Add this key prop
      style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryButtonText, selectedCategory === item && styles.selectedCategoryButtonText]}>{item}</Text>
    </Pressable>
  );

  const filteredProducts = productList.filter(product => product.category === selectedCategory);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar barStyle="light-content" backgroundColor="#ff8100" />
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.mainTitle}>Restaurant Order Tracking</Text>
          <View style={styles.tableCard}>
            {tables.map(table => (
              <Pressable
                key={table.id} // Add this key prop
                onPress={() => setSelectedTable(table.id)}
                style={[
                  styles.tableIcon,
                  selectedTable === table.id && styles.activeTableIcon
                ]}
              >
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
                keyExtractor={item => item} // Ensure unique key for each category
                style={styles.categoryList}
              />

              <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={item => item.id} // Ensure unique key for each product
                style={styles.productList}
              />

              <View style={styles.cart}>
                <Text style={styles.cartTitle}>Cart</Text>
                {tables.find(table => table.id === selectedTable)?.cart.map(item => (
                  <Text key={item.id} style={styles.cartItem}>{item.name} x {item.quantity} - ₹{item.price * item.quantity}</Text>
                ))}
                <Pressable style={styles.clearCartButton} onPress={() => clearCart(selectedTable)}>
                  <Text style={styles.clearCartButtonText}>Clear Cart</Text>
                </Pressable>
                <Pressable style={styles.submitOrderButton} onPress={() => submitOrder(selectedTable)}>
                  <Text style={styles.submitOrderButtonText}>Submit Order</Text>
                </Pressable>
              </View>

              {tables.find(table => table.id === selectedTable)?.order && (
                <View style={styles.orderSummary}>
                  <Text style={styles.orderTitle}>Order Summary</Text>
                  {tables.find(table => table.id === selectedTable)?.order?.items.map(item => (
                    <Text key={item.id} style={styles.orderItem}>{item.name} x {item.quantity} - ₹{item.price * item.quantity}</Text>
                  ))}

                <Text style={styles.totalAmountText}>
                  {`Total Amount: ₹ ${tables.find(table => table.id === selectedTable)?.order?.totalAmount}`}
                </Text>
                  {/* <Pressable style={styles.updateOrderButton} onPress={() => updateOrder(selectedTable, tables.find(table => table.id === selectedTable)!.order!.items[0])}>
                    <Text style={styles.updateOrderButtonText}>Update Order</Text>
                  </Pressable> */}
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
    paddingBottom: 100,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  tableCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tableIcon: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    // borderRadius: 10,
    elevation: 5,
  },
  activeTableIcon: {
    backgroundColor: '#ff8100',
  },
  image: {
    width: 50,
    height: 50,
  },
  tableText: {
    marginTop: 5,
    fontSize: 16,
  },
  activeTableText: {
    color: 'white',
  },
  tableView: {
    paddingHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    // elevation: 5,
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  categoryList: {
    marginBottom: 20,
  },
  categoryButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#ff8100',
  },
  categoryButtonText: {
    fontSize: 16,
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  productList: {
    marginBottom: 20,
  },
  productButton: {
    padding: 10,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cart: {
    marginBottom: 20,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  clearCartButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  clearCartButtonText: {
    color: 'white',
    fontSize: 16,
  },
  submitOrderButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitOrderButtonText: {
    color: 'white',
    fontSize: 16,
  },
  orderSummary: {
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  updateOrderButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  updateOrderButtonText: {
    color: 'white',
    fontSize: 16,
  },
  totalAmountText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});
