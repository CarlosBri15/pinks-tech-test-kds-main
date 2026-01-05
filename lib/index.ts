import { Order } from "@/dtos/Order.dto";
import { Item } from "@/dtos/Item.dto";
import { EventEmitter } from "events";
import { getRandomId, getRandomInterval } from "./utils";

const MOCK_ITEMS: Item[] = [
  {
    id: "item_1",
    name: "Pink's Classic Burger",
    image: "",
    price: { currency: "EUR", amount: 12.5 },
  },
  {
    id: "item_2",
    name: "Cheese Krazy Burger",
    image: "",
    price: { currency: "EUR", amount: 14.0 },
  },
  {
    id: "item_3",
    name: "Classic Fries",
    image: "",
    price: { currency: "EUR", amount: 4.5 },
  },
  {
    id: "item_4",
    name: "Sweet Potato Fries",
    image: "",
    price: { currency: "EUR", amount: 5.5 },
  },
  {
    id: "item_5",
    name: "Vanilla Milkshake",
    image: "",
    price: { currency: "EUR", amount: 6.0 },
  },
  {
    id: "item_6",
    name: "Pink Lemonade",
    image: "",
    price: { currency: "EUR", amount: 3.5 },
  },
];

export class OrderOrchestrator {
  private interval: NodeJS.Timeout | undefined;
  private maxOrders: number = getRandomInterval(10, 30);
  private eventEmitter = new EventEmitter();

  private emit(order: Order) {
    this.eventEmitter.emit("order", order);
  }

  public run() {
    this.interval = setInterval(() => {
      const itemsCount = getRandomInterval(1, 12);
      const items: Item[] = [];
      for (let i = 0; i < itemsCount; i++) {
        const randomItem =
          MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)];
        items.push({ ...randomItem, id: `${randomItem.id}_${getRandomId()}` });
      }

      this.emit({
        id: getRandomId(),
        state: "PENDING",
        items: items,
        createdAt: Date.now(),
      });
      this.maxOrders--;
      if (this.maxOrders <= 0) {
        clearInterval(this.interval);
      }
    }, 5000);
    return this.eventEmitter;
  }
}
