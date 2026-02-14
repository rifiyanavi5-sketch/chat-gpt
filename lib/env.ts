const required = ["JWT_SECRET", "POSTGRES_URL"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  jwtSecret: process.env.JWT_SECRET as string
};
