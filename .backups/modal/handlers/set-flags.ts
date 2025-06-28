import {setModalFlagsAction} from "../actions";
import {runDispatch} from "../reducer";

export const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  runDispatch(setModalFlagsAction(modalId, flags));
};