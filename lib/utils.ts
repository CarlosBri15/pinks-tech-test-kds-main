import { Item } from "@/dtos/Item.dto";

export function getRandomId() {
  const length = 5;
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getRandomInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function groupItems(items: Item[]) {
  const grouped: { [key: string]: { item: Item; count: number } } = {};
  items.forEach((item) => {
    if (grouped[item.name]) {
      grouped[item.name].count += 1;
    } else {
      grouped[item.name] = { item, count: 1 };
    }
  });
  return Object.values(grouped);
}
