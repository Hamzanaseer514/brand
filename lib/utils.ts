// Utility function to generate image - mix between 1.png to 10.png
export function getPlaceholderImage(index: number, type: 'product' | 'category' = 'product'): string {
  // Use actual images from public folder - cycle through 1.png to 10.png
  const imageIndex = (index % 10) + 1; // Cycles through 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  return `/images/${imageIndex}.png`;
}

export function getRandomImage(): string {
  // Randomly pick between 1.png to 10.png
  const randomIndex = Math.floor(Math.random() * 10) + 1;
  return `/images/${randomIndex}.png`;
}

