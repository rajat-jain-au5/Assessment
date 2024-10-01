import { DELETE_COLUMN, GET_DASHBOARD_DATA, UPDATE_DATA_TYPE } from "./types";

const intialState = {
    isListLoading: true,
    dashboardData: null
};

export default function dashboardReducer(state = intialState, action) {
    let stateCopy = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case GET_DASHBOARD_DATA:
            stateCopy.dashboardDetails = action.payload;
            stateCopy.table_headers = action.payload.table_headers;
            stateCopy.table_data = action.payload.table_data;
            return stateCopy;
        case UPDATE_DATA_TYPE:
            const { columnIndex, newType, updatedData } = action.payload;

            stateCopy.table_headers = stateCopy.table_headers.map((header, index) => {
                if (index === columnIndex) {
                    return { ...header, type: newType };
                }
                return header;
            });
            console.log(stateCopy.table_headers, updatedData)
            stateCopy.table_data = updatedData;
            return stateCopy;
        case DELETE_COLUMN: {
            const columnIndex = action.payload;
            // Remove column from table_headers
            stateCopy.table_headers.splice(columnIndex, 1);

            // Remove column from each row in table_data
            stateCopy.table_data = stateCopy.table_data.map((row) => {
                row.splice(columnIndex, 1);
                return row;
            });

            return stateCopy;
        }

        default:
            return stateCopy;
    }
}