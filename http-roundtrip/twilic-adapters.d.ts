import type { TwilicValue } from "@twilic/core";
import "axios";
import "express";
import "fastify";

/**
 * Published @twilic/{express,axios,fastify} 0.1.x omit module augmentations from dist/.
 * Keep this local shim so the round-trip example typechecks until those packages ship types.
 */
declare global {
  namespace Express {
    interface Request {
      twilicBody?: TwilicValue;
    }
  }
}

declare module "axios" {
  interface AxiosRequestConfig {
    twilicBody?: TwilicValue;
    twilicResponse?: boolean;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    twilicBody?: TwilicValue;
  }

  interface FastifyReply {
    twilic(
      value: TwilicValue,
      init?: { statusCode?: number; headers?: Record<string, string> },
    ): FastifyReply;
  }
}

export {};
