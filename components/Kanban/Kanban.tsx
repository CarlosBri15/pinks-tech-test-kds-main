import s from "./Kanban.module.scss";
import Column from "../Column";
import { useOrders } from "@/contexts/Orders.context";
import { useRiders } from "@/contexts/Riders.context";
import { useState } from "react";
import OrderModal from "../OrderModal/OrderModal";
import { Order } from "@/dtos/Order.dto";

export default function Kanban() {
  const { orders, updateOrderStatus, pickup, showError } = useOrders();
  const { assignedOrders } = useRiders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <section className={s["pk-kanban"]}>
      <Column
        title="Pendiente"
        orders={orders.filter((i) => i.state === "PENDING")}
        assignedOrderIds={assignedOrders}
        onExpand={setSelectedOrder}
        onClick={(order) => updateOrderStatus(order.id, "IN_PROGRESS")}
        withSearch
      />
      <Column
        title="En preparación"
        orders={orders.filter((i) => i.state === "IN_PROGRESS")}
        assignedOrderIds={assignedOrders}
        onExpand={setSelectedOrder}
        onClick={(order) => updateOrderStatus(order.id, "READY")}
        withSearch
      />
      <Column
        title="Listo"
        orders={orders.filter((i) => i.state === "READY")}
        assignedOrderIds={assignedOrders}
        onExpand={setSelectedOrder}
        onClick={(order) => {
          if (assignedOrders.includes(order.id)) {
            pickup(order.id);
          } else {
            showError("¡Aún no ha llegado el Rider para esta orden!");
          }
        }}
        withSearch
      />
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          hasRider={assignedOrders.includes(selectedOrder.id)}
        />
      )}
    </section>
  );
}
