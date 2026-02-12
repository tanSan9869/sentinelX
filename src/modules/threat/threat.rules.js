export const RULES = {
  FAILED_LOGIN: 10,
  SUSPICIOUS_ROUTE: 25,
  HIGH_ERROR_RATE: 15,
  BLOCK_THRESHOLD: 100
};

export const suspiciousRoutes = [
  "/admin",
  "/wp-admin",
  "/.env",
  "/config",
  "/phpmyadmin"
];
