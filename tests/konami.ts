import type { Page } from "@playwright/test";

export const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export async function typeCode(page: Page): Promise<void> {
  for (const key of CODE) {
    await page.keyboard.press(key);
  }
}
