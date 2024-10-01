import { getApiCall } from "../utils/request";
import { DELETE_COLUMN, GET_DASHBOARD_DATA, UPDATE_DATA_TYPE } from "./types";


export const getDashboardData = () => async (dispatch) => {
    try {
        const response = await getApiCall(`sample.json`);
        const data = response.data
        console.log(data)
        dispatch({ type: GET_DASHBOARD_DATA, payload: data });
    } catch (error) {
        console.log(error)
    }
}

export const updateDataType = (columnIndex, newType, updatedData) => async (dispatch) => {
    dispatch({ type: UPDATE_DATA_TYPE, payload: { columnIndex, newType, updatedData } });
}

export const deleteColumn = (index) => async (dispatch) => {
    dispatch({ type: DELETE_COLUMN, payload: index });
}

