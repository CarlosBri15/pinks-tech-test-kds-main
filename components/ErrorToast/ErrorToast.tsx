import s from "./ErrorToast.module.scss";
import { useOrders } from "@/contexts/Orders.context";

export default function ErrorToast() {
  const { errorMessage } = useOrders();

  if (!errorMessage) return null;

  return (
    <div className={s.toast}>
      <span>{errorMessage}</span>
    </div>
  );
}
