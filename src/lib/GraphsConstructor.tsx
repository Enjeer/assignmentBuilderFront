import React, {useState, useEffect} from "react";


export interface dataEntry {
    id: string;
    name: string;
    data: string;
}

export interface GraphProps{
    id:  string;
    type: "linear" | "area" | "bar" | "scatter" | "pie";
    dataEntries: dataEntry[];
}


export default function GraphsConstructor({type, dataEntries}: GraphProps){
    return (
        
    )
}