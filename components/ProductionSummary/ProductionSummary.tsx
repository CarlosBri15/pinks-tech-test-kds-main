import s from "./ProductionSummary.module.scss";
import { useOrders } from "@/contexts/Orders.context";
import { groupItems } from "@/lib/utils";

export default function ProductionSummary() {
  const { orders } = useOrders();

  const activeOrders = orders.filter((o) => o.state === "IN_PROGRESS");

  const allItems = activeOrders.flatMap((o) => o.items);
  const grouped = groupItems(allItems);

  if (grouped.length === 0) return null;

  return (
    <div className={s.container}>
      <div className={s.title}>Total a Cocinar:</div>
      <div className={s.items}>
        {grouped.map(({ item, count }, index) => (
          <div key={index} className={s.item}>
            <span className={s.count}>{count}x</span>
            <span className={s.name}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
