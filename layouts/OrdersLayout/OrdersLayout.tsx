import Logo from "@/bases/Logo";
import s from "./OrdersLayout.module.scss";
import Kanban from "@/components/Kanban";
import ProductionSummary from "@/components/ProductionSummary/ProductionSummary";
import UndoToast from "@/components/UndoToast/UndoToast";
import ErrorToast from "@/components/ErrorToast/ErrorToast";
import { useOrders } from "@/contexts/Orders.context";

export default function OrdersLayout() {
  const { isSoundEnabled, toggleSound } = useOrders();

  return (
    <main className={s["pk-layout"]}>
      <nav className={s["pk-layout__navbar"]}>
        <Logo size="S" />
        <span>KDS: Krazy Display Service</span>
        <button
          className={s.soundButton}
          onClick={toggleSound}
          title={isSoundEnabled ? "Desactivar sonido" : "Activar sonido"}
        >
          {isSoundEnabled ? "🔊" : "🔇"}
        </button>
      </nav>
      <article className={s["pk-layout__app"]}>
        <Kanban />
      </article>
      <UndoToast />
      <ErrorToast />
      <ProductionSummary />
    </main>
  );
}
