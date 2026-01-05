import s from "./UndoToast.module.scss";
import { useOrders } from "@/contexts/Orders.context";
import { useEffect, useState } from "react";

const STATE_TRANSLATIONS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Preparación",
  READY: "Listo",
  DELIVERED: "Entregado",
};

export default function UndoToast() {
  const { undo, canUndo, lastActionTrigger, lastActionDetails } = useOrders();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastActionTrigger > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastActionTrigger]);

  if (!canUndo || !visible || !lastActionDetails) return null;

  const { orderId, actionType, newState } = lastActionDetails;
  const shortId = orderId.slice(0, 5);

  return (
    <div className={s.toast}>
      <span>
        {actionType === "moved"
          ? `Orden #${shortId} movida a ${STATE_TRANSLATIONS[newState!]}`
          : `Orden #${shortId} entregada`}
      </span>
      <button
        onClick={() => {
          undo();
          setVisible(false);
        }}
        className={s.undoBtn}
      >
        DESHACER
      </button>
    </div>
  );
}
