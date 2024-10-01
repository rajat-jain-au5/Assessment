import React, { useEffect, useState } from 'react';
import './style.scss';
import { deleteColumn, getDashboardData, updateDataType } from '../../Redux/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';

export default function Dashboard() {
    const [active, setActive] = useState('data');
    const dispatch = useDispatch();
    const { dashboardDetails, table_headers, table_data } = useSelector(state => state);
    const [columnDataTypes, setColumnDataTypes] = useState({});

    useEffect(() => {
        dispatch(getDashboardData());
    }, [dispatch]);

    const onTabChange = (e) => {
        setActive(e)
    }

    useEffect(() => {
        if (table_headers?.length) {
            setColumnDataTypes(table_headers.reduce((acc, header) => {
                acc[header.name] = header.type;
                return acc;
            }, {}));
        }
    }, [table_headers]);

    // Handle column data type change
    const handleColumnDataTypeChange = (headerName, newType, columnIndex) => {
        const updatedData = table_data?.map((row) => {
            let newValue = row[columnIndex];

            switch (newType) {
                case 'int':
                    newValue = parseInt(newValue, 10);
                    break;
                case 'float':
                    newValue = parseFloat(newValue);
                    break;
                case 'date':
                    newValue = new Date(newValue).toISOString().split('T')[0] || '';
                    break;
                default:
                    newValue = String(newValue);
            }

            return row.map((cell, idx) =>
                idx === columnIndex ? newValue : cell
            );
        });

        dispatch(updateDataType(
            columnIndex,
            newType,
            updatedData
        ));

        setColumnDataTypes(prev => ({
            ...prev,
            [headerName]: newType
        }));
    };

    // Delete Column
    const deleteCol = (index) => {
        dispatch(deleteColumn(index))
    }

    // Download TableData
    const downloadData = async () => {
        const formattedData = table_data.map(row => {
            return table_headers.reduce((acc, header, index) => {
                acc[header.name] = row[index];
                return acc;
            }, {});
        });
        await downloadExcel(formattedData);
    }

    const downloadExcel = (data, filename = 'table_data.xlsx') => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate and trigger download
        XLSX.writeFile(workbook, filename);
    };


    return (
        <div className='dashboard-holder'>
            <div className='dashboard-tabs'>
                <div className='d-flex  align-items-center'>
                    <div onClick={() => onTabChange('data')} className={active === 'data' ? 'active tabs' : 'tabs'}>Data</div>
                    <div onClick={() => onTabChange('summary')} className={active === 'summary' ? 'active tabs' : 'tabs'}>Summary</div>
                    <div onClick={() => onTabChange('logs')} className={active === 'logs' ? 'active tabs' : 'tabs'}>Logs</div>
                </div>
                <button className='download-btn' onClick={downloadData}>Download</button>

            </div>
            <div className='dashboard-header'>
                <div className='d-flex  align-items-center'>
                    <div className='dashboard-box'>PROJECT NAME</div> &nbsp;<h4>{dashboardDetails?.project_name}</h4>&nbsp;&nbsp;
                    <div className='dashboard-box'>OUTPUT DATASET NAME</div> &nbsp;<h4>{dashboardDetails?.output_name}</h4>&nbsp;&nbsp;
                    <div className='dashboard-box'>LAST RUN</div> &nbsp;<h4>{dashboardDetails?.last_run?.split('T')[0]}</h4>
                </div>
                <div className='row_count'>
                    Rows :  {dashboardDetails?.row_count}
                </div>
            </div>
            <div className='table-parent'>
                <Table responsive>
                    <thead>
                        <tr>
                            {table_headers && table_headers?.map((header, index) => (
                                <th key={header.name} style={{ minWidth: 130 }}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h5 className='text-elipsis' title={header.name}>{header.name}</h5>
                                        <img src='/images/delete-icon.svg' className='cursor-pointer' onClick={() => deleteCol(index)} alt='' />
                                    </div>
                                    <div>
                                        <select
                                            className='form-control'
                                            value={columnDataTypes[header.name] || 'string'}
                                            onChange={(e) => handleColumnDataTypeChange(header.name, e.target.value, index)}
                                        >
                                            <option value="string">String</option>
                                            <option value="int">Int</option>
                                            <option value="float">Float</option>
                                            {header.name === 'Date' ? <option value="date">Date</option> : null}
                                        </select>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table_data && table_data?.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
