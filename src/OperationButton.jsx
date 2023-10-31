import { ACTIONS } from "./App";

export const OperationButton = ({operation, dispatch}) => {
    return (
        <button onClick={() => {dispatch({type: ACTIONS.ADD_OPERATION, payload: {operation: operation}})}} >{operation}</button>
    )
}