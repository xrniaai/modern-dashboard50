/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as appeals from "../appeals.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as dashboard from "../dashboard.js";
import type * as http from "../http.js";
import type * as leaderboard from "../leaderboard.js";
import type * as redemptions from "../redemptions.js";
import type * as seedUsers from "../seedUsers.js";
import type * as surveys from "../surveys.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  appeals: typeof appeals;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  dashboard: typeof dashboard;
  http: typeof http;
  leaderboard: typeof leaderboard;
  redemptions: typeof redemptions;
  seedUsers: typeof seedUsers;
  surveys: typeof surveys;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
