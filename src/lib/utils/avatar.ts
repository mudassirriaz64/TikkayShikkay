const AVATAR_PALETTE = ["#d9381e", "#f4be54", "#e8927c", "#ffb4a2", "#c98a5e"];

export function initialsAvatar(name: string, index: number): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const bg = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="${bg}"/><text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="serif" font-size="40" font-weight="700" fill="#131313">${initials}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
