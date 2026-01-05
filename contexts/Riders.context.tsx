import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useOrders } from "./Orders.context";
import { getRandomInterval } from "@/lib/utils";
import { Rider } from "@/dtos/Rider.dto";

export type RidersContextProps = {
  riders: Array<Rider>;
  assignedOrders: string[];
};

export const RidersContext = createContext<RidersContextProps>(
  // @ts-ignore
  {}
);

export type RidersProviderProps = {
  children: ReactNode;
};

export function RidersProvider(props: RidersProviderProps) {
  const [riders, setRiders] = useState<Array<Rider>>([]);
  const [assignedOrders, setAssignedOrders] = useState<string[]>([]);
  const pendingAssignments = useRef<Set<string>>(new Set());
  const { orders, pickup } = useOrders();

  useEffect(() => {
    const order = orders.find(
      (order) =>
        !assignedOrders.includes(order.id) &&
        !pendingAssignments.current.has(order.id)
    );

    if (order) {
      pendingAssignments.current.add(order.id);

      setTimeout(() => {
        setAssignedOrders((prev) => [...prev, order.id]);
        
        pendingAssignments.current.delete(order.id);

        setRiders((prev) => [
          ...prev,
          {
            orderWanted: order.id,
            pickup: () => pickup(order.id),
          },
        ]);
      }, getRandomInterval(4_000, 10_000));
    }
  }, [orders, assignedOrders]);

  const context = { riders, assignedOrders };
  return (
    <RidersContext.Provider value={context}>
      {props.children}
    </RidersContext.Provider>
  );
}

export const useRiders = () => useContext(RidersContext);