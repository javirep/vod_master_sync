'use client'

import React, { useState } from "react";

import Typography from "../Typography/Typography";
import { RowType } from "./Table";
import classNames from "classnames";

type TableIndexatorProps = {
    itemsPerPage: number;
    totalItems: RowType[];
    onChange: (itemsToShow: RowType[]) => void;
}

type IndexatorButtonProps = {
    onClick: () => void, 
    text: string,
    currentPage: boolean
}

const TableIndexator = (props: TableIndexatorProps) => {
    const { itemsPerPage, totalItems, onChange } = props;
    const [ currentPage, setCurrentPage ] = useState(0);
    
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const newItems = totalItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
        onChange(newItems);
    }

    const getButtonsToShow = () => {
        const buttonsToShow:number[] = [];

        const t = Math.ceil(totalItems.length / itemsPerPage) ;

        const mapToJSX = (i: number, index) => {
            if (i < 0) return <Typography key={index} type="input-label">...</Typography>
            return <IndexatorButton key={index} onClick={() => handlePageChange(i)} text={(i + 1).toString()} currentPage={i == currentPage} />
        }

        if ( t <= 5 ) {
            for (let i = 0; i < t; i++) {
                buttonsToShow.push(i);
            }

            return buttonsToShow.map(mapToJSX);
        }

        buttonsToShow.push(0);
        
        if (currentPage < 3 ) {

            for (let j = 0; j <= currentPage; j++ ){
                buttonsToShow.push(j + 1);
            }
           
        }
        else {
            buttonsToShow.push(-1);
        }

        if (currentPage > 2 && currentPage < t - 3) {
            buttonsToShow.push(currentPage - 1);
            buttonsToShow.push(currentPage);
            buttonsToShow.push(currentPage + 1);
        }
  
        if (currentPage >= t - 3) {
            for (let k = t - currentPage;  k > 0; k--) {
                buttonsToShow.push( t - k - 1 );
            }
        }
        else {
            buttonsToShow.push(-1); 
        }
            
        buttonsToShow.push(t-1); 

        return buttonsToShow.map(mapToJSX);
    }

    return (
        <>
        {
            itemsPerPage < totalItems.length 
            && 
            <div className="table-indexator">
                {getButtonsToShow()}
            </div>
        }
        </>
    )
}

const IndexatorButton = (props: IndexatorButtonProps) => {
    if (props.text === "...") {
        return (
            <div className="table-indexator-button" onClick={props.onClick}>
                <Typography type="body">...</Typography>
            </div>
        )
    }

    return (
        <div className={classNames("table-indexator-button", { 'active' : props.currentPage })} onClick={props.onClick}>
            <Typography type="body">{props.text}</Typography>
        </div>
    )
}

export default TableIndexator;