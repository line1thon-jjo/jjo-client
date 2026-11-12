import { GREETINGS } from "@/constants/home";

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  const slot = GREETINGS.findLast(({ from }) => hour >= from) ?? GREETINGS[GREETINGS.length - 1];
  return slot.text;
}
