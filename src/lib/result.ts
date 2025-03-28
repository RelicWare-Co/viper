import { err, ok, type Result, type ResultAsync } from "neverthrow";

export type InferOkData<T> = T extends Result<infer TData, any> ? TData : never;
export type InferAsyncOkData<T> =
  T extends ResultAsync<infer TData, any> ? TData : never;

export type InferErrError<T> =
  T extends Result<any, infer TError> ? TError : never;
export type InferAsyncErrError<T> =
  T extends ResultAsync<any, infer TError> ? TError : never;

export type MergeResults<T1, T2> =
  T1 extends Result<infer D1, infer E1>
    ? T2 extends Result<infer D2, infer E2>
      ? Result<D1 | D2, E1 | E2>
      : never
    : never;

export type ResultToResultAsync<T extends Result<unknown, unknown>> =
  T extends Result<infer D, infer E> ? ResultAsync<D, E> : never;

export type MergeResultAsync<T1, T2> =
  T1 extends ResultAsync<infer D1, infer E1>
    ? T2 extends ResultAsync<infer D2, infer E2>
      ? ResultAsync<D1 | D2, E1 | E2>
      : never
    : never;

// These are needed for the `createAction()` method to work.
// neverthrow results can not be sent over the wire in server actions.

/**
 * The return type of a function returned by `createAction()`. This is needed as NeverThrow `Result`s can not be sent over the wire in server actions.
 *
 * Can be converted to a `Result` using `actionResultToResult()`
 */
export type ActionResult<T, E> = ActionOk<T, E> | ActionErr<T, E>;

export type ActionOk<T, E> = {
  ok: true;
  value: T;
};
export const actionOk = <T>(value: T): ActionOk<T, never> => ({
  ok: true,
  value,
});
export type InferActionOkData<T> =
  T extends ActionOk<infer TData, any> ? TData : never;

export type ActionErr<T, E> = {
  ok: false;
  error: E;
};
export const actionErr = <E>(error: E): ActionErr<never, E> => ({
  ok: false,
  error,
});
export type InferActionErrError<T> =
  T extends ActionErr<any, infer TError> ? TError : never;
/**
 * Converts a `ResultAsync<T,E>` to a `<ActionResult<T,E>`.
 */
export type ResultAsyncToActionResult<T> = [T] extends [
  ResultAsync<infer D, infer E>,
]
  ? ActionResult<D, E>
  : never;

export type ActionResultToResultAsync<T> = [T] extends [
  ActionResult<infer D, infer E>,
]
  ? ResultAsync<D, E>
  : never;

export type ActionResultToResult<T> = [T] extends [
  ActionResult<infer D, infer E>,
]
  ? Result<D, E>
  : never;

/**
 * Converts a `Result<T,E>` to an `ActionResult<T,E>`.
 */
export const resultToActionResult = <
  R extends Result<any, any>,
  T = R extends Result<infer T, any> ? T : never,
  E = R extends Result<any, infer E> ? E : never,
>(
  result: R,
): ActionResult<T, E> => {
  if (result.isOk()) {
    return actionOk(result.value);
  }
  return actionErr(result.error);
};

/**
 * Type utility to convert a Result type to an ActionResult type
 */
export type ResultToActionResult<T> = [T] extends [
  Result<infer D, infer E>,
]
  ? ActionResult<D, E>
  : never;

/**
 * Converts an `ActionResult<T,E>` to a `Result<T,E>` or passes through a `Result<T,E>`.
 * This function is now overloaded to handle both ActionResult and Result types.
 */
export function actionResultToResult<
  R extends ActionResult<any, any>,
  T = R extends ActionResult<infer T, any> ? T : never,
  E = R extends ActionResult<any, infer E> ? E : never,
>(
  actionResult: R,
): Result<T, E>;
export function actionResultToResult<
  R extends Result<any, any>,
  T = R extends Result<infer T, any> ? T : never,
  E = R extends Result<any, infer E> ? E : never,
>(
  result: R,
): Result<T, E>;
export function actionResultToResult<T, E>(
  input: ActionResult<T, E> | Result<T, E>,
): Result<T, E> {
  // If it's already a Result type, just return it
  if ('isOk' in input && typeof input.isOk === 'function') {
    return input as Result<T, E>;
  }
  
  // Otherwise handle it as an ActionResult
  const actionResult = input as ActionResult<T, E>;
  if (actionResult.ok) {
    return ok((actionResult as ActionOk<T, E>).value);
  }
  return err((actionResult as ActionErr<T, E>).error);
}