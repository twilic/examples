import type { TwilicValue } from "@twilic/core";

const REGIONS = ["us-east", "eu-west", "ap-northeast-1"] as const;
const PLANS = ["free", "pro", "enterprise"] as const;
const ROLES = ["admin", "member", "viewer"] as const;
const SERVICES = ["api", "db", "worker", "gateway"] as const;
const LEVELS = ["debug", "info", "warn", "error"] as const;

export function makeUsers(pageSize = 50): TwilicValue[] {
  return Array.from({ length: pageSize }, (_, index) => {
    const id = index + 1;
    return {
      id: BigInt(1000 + id),
      name: `user-${id}`,
      email: `user${id}@example.com`,
      role: ROLES[id % ROLES.length],
      created_at: BigInt(1_700_000_000_000 + id * 86_400_000),
      active: id % 4 !== 0,
      plan: PLANS[id % PLANS.length],
      region: REGIONS[id % REGIONS.length],
    };
  });
}

export function makeMetrics(): TwilicValue {
  return {
    cpu_pct: 42.1,
    mem_mb: 2048n,
    disk_read_mb: 120n,
    disk_write_mb: 45n,
    req_per_sec: 1250,
    err_rate: 0.02,
    p50_ms: 12.4,
    p95_ms: 48.7,
    p99_ms: 92.1,
    active_connections: 384n,
    queue_depth: 12n,
    cache_hit_pct: 94.2,
    db_pool_used: 18n,
    db_pool_max: 32n,
    uptime_sec: 864_000n,
  };
}

export function tickMetrics(base: TwilicValue, tick: number): TwilicValue {
  const record = base as Record<string, TwilicValue>;
  return {
    ...record,
    cpu_pct: 40 + (tick % 20) * 0.5,
    mem_mb: (2040n + BigInt(tick * 3)) as TwilicValue,
    req_per_sec: 1200 + tick * 5,
    p95_ms: 45 + (tick % 10),
    queue_depth: BigInt(10 + (tick % 7)),
  };
}

export function makeBatchHomogeneous(count: number): TwilicValue[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    return {
      id,
      userId: 100_000 + id,
      active: id % 2 === 0,
      tier: id % 3 === 0 ? "gold" : "standard",
      country: id % 5 === 0 ? "US" : "JP",
      usage: {
        requests: 5000 + id,
        errors: id % 17,
      },
    };
  });
}

export function makeTelemetryEvents(count: number): TwilicValue[] {
  const baseTs = 1_700_000_000_000n;
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const service = SERVICES[id % SERVICES.length];
    const level = id % 20 === 0 ? "warn" : "info";
    return {
      timestamp: baseTs + BigInt(id * 100),
      service,
      level,
      message: level === "warn" ? "slow query" : "request",
      duration_ms: level === "warn" ? 120 + (id % 200) : 8 + (id % 25),
    };
  });
}

export function makeLogEvents(count: number): TwilicValue[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const level = LEVELS[id % 25 === 0 ? 3 : id % 50 === 0 ? 2 : 1];
    const service = SERVICES[id % SERVICES.length];
    return {
      timestamp: BigInt(1_700_000_000_000 + id * 50),
      level,
      service,
      message:
        level === "error"
          ? `request failed id=${id}`
          : level === "warn"
            ? `retry scheduled id=${id}`
            : `request completed id=${id}`,
      request_id: `req-${(id % 1000).toString().padStart(4, "0")}`,
      duration_ms: 5 + (id % 40),
    };
  });
}

export function makeSessionBlob(userId: number): TwilicValue {
  return {
    user_id: BigInt(userId),
    email: `user${userId}@example.com`,
    roles: userId % 2 === 0 ? ["admin", "editor"] : ["viewer"],
    preferences: {
      locale: userId % 3 === 0 ? "ja-JP" : "en-US",
      theme: userId % 2 === 0 ? "dark" : "light",
      notifications: true,
    },
    last_seen_at: BigInt(1_700_000_000_000 + userId * 60_000),
    cart_items: userId % 4 === 0 ? 3 : 0,
  };
}
