import s from "./OrderModal.module.scss";
import { Order } from "@/dtos/Order.dto";
import { groupItems } from "@/lib/utils";

type OrderModalProps = {
  order: Order;
  onClose: () => void;
  hasRider: boolean;
};

const STATE_TRANSLATIONS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Preparación",
  READY: "Listo",
  DELIVERED: "Entregado",
};

export default function OrderModal({
  order,
  onClose,
  hasRider,
}: OrderModalProps) {
  const groupedItems = groupItems(order.items);

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <header className={s.header}>
          <div>
            <h2>Orden #{order.id}</h2>
            <span className={s.stateLabel}>
              {STATE_TRANSLATIONS[order.state] || order.state}
            </span>
          </div>
          <button onClick={onClose} className={s.closeButton}>
            ✕
          </button>
        </header>

        <div className={s.content}>
          <div className={`${s.riderSection} ${hasRider ? s.active : ""}`}>
            <span className={s.riderLabel}>Estado del Rider</span>
            <span className={s.riderStatus}>
              {hasRider ? "Asignado" : "Buscando..."}
            </span>
          </div>

          <div className={s.itemsContainer}>
            <h3>Productos</h3>
            <ul className={s.items}>
              {groupedItems.map(({ item, count }, index) => (
                <li key={index}>
                  <div className={s.itemInfo}>
                    {count > 1 && (
                      <span className={s.countBadge}>{count}x</span>
                    )}
                    <span className={s.itemName}>{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
