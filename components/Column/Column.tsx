import s from "./Column.module.scss";
import { Order } from "@/dtos/Order.dto";
import { groupItems } from "@/lib/utils";
import Timer from "@/components/Timer/Timer";
import { useState } from "react";

export type ColumnProps = {
  orders: Array<Order>;
  title: string;
  onClick?: (order: Order) => void;
  assignedOrderIds?: string[];
  onExpand?: (order: Order) => void;
  withSearch?: boolean;
};

export default function Column(props: ColumnProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = props.orders.filter((order) => {
    if (!props.withSearch || !searchQuery) return true;
    return order.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getEmptyState = () => {
    switch (props.title) {
      case "Pendiente":
        return { icon: "", text: "SISTEMA EN ESPERA" };
      case "En preparación":
        return { icon: "", text: "COCINA DESPEJADA" };
      case "Listo":
        return { icon: "", text: "SIN ENTREGAS" };
      default:
        return { icon: "", text: "VACÍO" };
    }
  };

  return (
    <div className={s["pk-column"]}>
      <div className={s["pk-column__title"]}>
        <h3>{props.title}</h3>
        <span className={s["pk-column__count"]}>{props.orders.length}</span>
      </div>
      
      {props.withSearch && (
        <div className={s["pk-column__search-container"]}>
          <input
            type="text"
            placeholder="Buscar pedido..."
            className={s["pk-column__search"]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={s["pk-column__search-clear"]}
              onClick={() => setSearchQuery("")}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      )}

      <div className={s["pk-column__content"]}>
        {filteredOrders.length === 0 ? (
          <div className={s["pk-column__empty"]}>
            <p>
              {searchQuery ? "NO SE ENCUENTRA" : getEmptyState().text}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const hasRider = props.assignedOrderIds?.includes(order.id);
            const groupedItems = groupItems(order.items);
            return (
              <div
                key={order.id}
                onClick={() => props.onClick && props.onClick(order)}
                className={s["pk-card"]}
              >
                <div className={s["pk-card__header"]}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span className={s["pk-card__id"]}>
                      #{order.id.slice(0, 5)}
                    </span>
                    <Timer startTime={order.createdAt} />
                  </div>
                  <span
                    className={`${s["pk-card__rider"]} ${
                      hasRider ? s["pk-card__rider--active"] : ""
                    }`}
                  >
                    {hasRider ? "RIDER" : "BUSCANDO"}
                  </span>
                </div>
                <div className={s["pk-card__items"]}>
                  {groupedItems.map(({ item, count }, index) => (
                    <div key={index} className={s["pk-card__item"]}>
                      {count > 1 && (
                        <span className={s["pk-card__item-count"]}>
                          {count}x
                        </span>
                      )}
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className={s["pk-card__actions"]}>
                  {props.onExpand && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onExpand!(order);
                      }}
                      className={s["pk-card__btn-expand"]}
                      title="Ver Detalles"
                    >
                      ⛶
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
