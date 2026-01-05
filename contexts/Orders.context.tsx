import { Order } from "@/dtos/Order.dto";
import { OrderOrchestrator } from "@/lib";
import { playSound } from "@/lib/sound";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

export type OrdersContextProps = {
  orders: Array<Order>;
  pickup: (orderId: string) => void;
  updateOrderStatus: (orderId: string, state: Order["state"]) => void;
  undo: () => void;
  canUndo: boolean;
  lastActionTrigger: number;
  lastActionDetails: {
    orderId: string;
    actionType: "moved" | "picked_up";
    newState?: Order["state"];
  } | null;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  errorMessage: string | null;
  showError: (message: string) => void;
};

export const OrdersContext = createContext<OrdersContextProps>(
  // @ts-ignore
  {}
);

export type OrdersProviderProps = {
  children: ReactNode;
};

export function OrdersProvider(props: OrdersProviderProps) {
  const [orders, setOrders] = useState<Array<Order>>([]);
  const [history, setHistory] = useState<Array<Array<Order>>>([]);
  const [lastActionTrigger, setLastActionTrigger] = useState(0);
  const [lastActionDetails, setLastActionDetails] = useState<OrdersContextProps["lastActionDetails"]>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const isSoundEnabledRef = useRef(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const newState = !prev;
      isSoundEnabledRef.current = newState;
      return newState;
    });
  };

  const saveHistory = () => {
    setHistory((prev) => [...prev.slice(-9), [...orders]]);
    setLastActionTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const orderOrchestrator = new OrderOrchestrator();
    const listener = orderOrchestrator.run();
    listener.on("order", (order) => {
      setOrders((prev) => [...prev, order]);
      if (isSoundEnabledRef.current) {
        playSound("new-order");
      }
    });
  }, []);

  const pickup = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order?.state === "READY") {
      setLastActionDetails({ orderId, actionType: "picked_up" });
      saveHistory();
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      return;
    }
    showError("¡La orden no está lista para recoger! Muevela a 'Listo' primero.");
  };

  const updateOrderStatus = (orderId: string, state: Order["state"]) => {
    setLastActionDetails({ orderId, actionType: "moved", newState: state });
    saveHistory();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, state } : o))
    );
  };

  const undo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setOrders(lastState);
    setHistory((prev) => prev.slice(0, -1));
  };

  const context = {
    orders,
    pickup,
    updateOrderStatus,
    undo,
    canUndo: history.length > 0,
    lastActionTrigger,
    lastActionDetails,
    isSoundEnabled,
    toggleSound,
    errorMessage,
    showError,
  };

  return (
    <OrdersContext.Provider value={context}>
      {props.children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
