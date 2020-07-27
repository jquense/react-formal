/* eslint-disable */

declare module '@restart/hooks/useMergeState' {
  declare type Updater<TState> = (state: TState) => Partial<TState> | null;
  /**
   * Updates state, partial updates are merged into existing state values
   */
  declare type MergeStateSetter<TState> = (
    update: Updater<TState> | Partial<TState> | null,
  ) => void;

  declare function useMergeState<TState extends {}>(
    initialState: (() => TState) | TState,
  ): [TState, MergeStateSetter<TState>] {
  };

  export default useMergeState;
}
