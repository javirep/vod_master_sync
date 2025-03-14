'use clients';

import React, { useEffect } from "react";

import './Table.scss';
import Typography from "../Typography/Typography";
import classNames from "classnames";
import { Checkboxes, CheckboxType } from "../Inputs/Checkboxes/Checkboxes";
import { Button } from "../Button/Button";
import { NumberInput } from "../Inputs/NumberInput/NumberInput";
import TableIndexator from "./TableIndexator";
import { Checkbox } from "../Inputs/Checkbox/Checkbox";

export type RowType = {
    [key: string]: string;
};

type HeaderType = {
    colKey: string;
    colText: string;
    width: number;
};

type selectRowArg = {
    rows: string[],
    selected: boolean
}

type TableProps = {
    header: HeaderType[]
    rows: RowType[];
    showCheckboxes?: boolean;
    addButton?: {
        text: string;
        onClick: (row: RowType) => void;
    };
    selectRow?: (o: selectRowArg) => void;
};

export const Table: React.FC<TableProps> = (props: TableProps) => {

    const { rows, header, showCheckboxes=true, addButton, selectRow} = props; 
    const [colsToShow, setColsToShow] = React.useState<{[key: string]: boolean}>({});
    //const [rowsToShow, setRowsToShow] = React.useState<RowType[]>([]);
    //const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [allBoxesChecked, setAllBoxesChecked] = React.useState<boolean>(false);

    useEffect(() => {
        setColsToShow(header.reduce((acc, col) => {
            acc[col.colKey] = true;
            return acc;
        }, {}));
    }
    , []);


    /* useEffect(() => {
        setRowsToShow(rows.slice(0, rowsPerPage));
    }
    , [rows, rowsPerPage]); */


    const handleCheckboxChange = (newCheckboxes: CheckboxType[]) => {
        setColsToShow(newCheckboxes.reduce((acc, cb) => {
            acc[cb.value] = cb.checked;
            return acc;
        }
        , {}));        
    };

    /* const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value));
    }; */

    /* const handlePageChange = (newRowsToShow) => {
        setRowsToShow(newRowsToShow);
    }    */     

    const getCheckBoxes = () => {
        return header.map((col, i) => {
            return { value: col.colKey, label: col.colText, checked: colsToShow[col.colKey] }
        });
    }

    const handleSelectAllRows = () => {
        setAllBoxesChecked(!allBoxesChecked);
        selectRow && selectRow({rows: rows.map(row => row.id), selected: !allBoxesChecked});
    }

    const handleSelectRows = (row: RowType, forceSelect?) => {
        selectRow && selectRow({ rows:[row.id], selected:forceSelect ? forceSelect : !row.selected });
    }
    
    return (
        <div className="table-wrapper">

            {
                showCheckboxes && (
                    <Checkboxes 
                        checkboxes={getCheckBoxes()} 
                        onChange={(newCheckboxes) => handleCheckboxChange(newCheckboxes)} 
                        className="mb-4"
                    />
                )
            }

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                        {
                            selectRow && <th><Checkbox label="" checked={allBoxesChecked} onChange={()=>handleSelectAllRows()}/></th>
                        }
                        {
                            header.map((col, index) => {
                                if (colsToShow[col.colKey]) return <th key={index} style={{width: col.width}}>
                                    <Typography type={'input-label'} > {col.colText} </Typography>
                                </th>
                            })
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className={classNames({'grey': i % 2 == 0})}>
                                {
                                    selectRow && <th><Checkbox label="" checked={row.selected ? true : false} onChange={()=>handleSelectRows(row)}/></th>
                                }
                                {
                                    header.map((col, j) => colsToShow[col.colKey] ?  <td key={j} height={50}>
                                            <Typography style={{width: col.width}} type='body'>{row[col.colKey]} </Typography>
                                        </td> : null )
                                }
                                {
                                    addButton 
                                    &&  <td>
                                            <Button type='secondary' text={addButton.text} onClick={() => addButton.onClick(row)} />
                                        </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <Typography type='body'>Total count: {rows.length}</Typography>

                {/* <TableIndexator itemsPerPage={rowsPerPage} totalItems={rows} onChange={handlePageChange} />
                
                <NumberInput placeholder={rowsPerPage.toString()} labelText={'Results per Page: '} onChange={(e) => {handleRowsPerPageChange(e)}} /> */}
            </div>
        </div>
    );
};