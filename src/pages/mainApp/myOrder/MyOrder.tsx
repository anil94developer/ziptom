import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAppNavigation } from "../../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchOrders, Order, OrderItem } from "../../../redux/slices/orderSlice";
import Header from "../../../componets/header";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/ThemeContext";

const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || "";
  switch (normalizedStatus) {
    case "preparing":
    case "pending":
      return "#ff9800";
    case "on the way":
    case "out_for_delivery":
    case "out for delivery":
      return "#2196f3";
    case "delivered":
      return "#4caf50";
    case "cancelled":
    case "canceled":
      return "#f44336";
    default:
      return "#999";
  }
};

const getStatusIcon = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || "";
  switch (normalizedStatus) {
    case "delivered":
      return "check-circle";
    case "on the way":
    case "out_for_delivery":
    case "out for delivery":
      return "delivery-dining";
    case "preparing":
    case "pending":
      return "hourglass-empty";
    case "cancelled":
    case "canceled":
      return "cancel";
    default:
      return "hourglass-empty";
  }
};

const formatOrderItems = (items: OrderItem[]): string => {
  if (!items || items.length === 0) return "No items";
  return items
    .map((item: OrderItem) => {
      const itemName = item.name || item.productId?.name || "Item";
      return `${item.quantity}x ${itemName}`;
    })
    .join(", ");
};

const MyOrdersList = () => {
  const { goToOrderDetails } = useAppNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { orders, loading, error, pagination } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 50 }));
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchOrders({ page: 1, limit: 50 }));
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const firstItem = item.items?.[0];
    const firstItemImage = firstItem?.productId?.image || "";
    const restaurantName = item.restaurantId?.name || "Restaurant";
    const itemsText = formatOrderItems(item.items);
    const totalPrice = item.grandTotal || item.finalAmount || item.totalAmount || 0;
    const status = item.status || "pending";

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface }]}
        onPress={() => {
          goToOrderDetails({ order: item });
        }}
      >
        {firstItemImage ? (
          <Image source={{ uri: firstItemImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.border }]} />
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.restaurant, { color: colors.text }]}>
            {restaurantName}
          </Text>
          <Text style={[styles.items, { color: colors.textSecondary }]}>
            {itemsText}
          </Text>
          <Text style={[styles.price, { color: colors.text }]}>
            ₹{totalPrice.toFixed(2)}
          </Text>
          {item.orderId && (
            <Text style={[styles.orderId, { color: colors.textSecondary }]}>
              Order ID: {item.orderId}
            </Text>
          )}

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <MaterialIcons
              name={getStatusIcon(status)}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Orders" onBack={() => navigation.goBack()} onAdd={() => {}} />

      {loading && orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading orders...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={onRefresh}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-bag" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No orders yet
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
            Your orders will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id || item.orderId || Math.random().toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  restaurant: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  items: { fontSize: 13, marginVertical: 2 },
  price: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  orderId: { fontSize: 11, marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  statusText: { color: "#fff", marginLeft: 4, fontSize: 12 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default MyOrdersList;
