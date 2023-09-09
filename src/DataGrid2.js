//Charles Bruner 4/10/2023
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState, useRef } from "react";

function DataGrid2(props) {

    const data = props.data;
    const dataRef = useRef(null);
    const [selected, setIsSelected] = useState([]);
    let allSelected = false;

    useEffect(() => {
        // console.log(selected);
        props.setSharedData(selected);
    }, [selected])
    const handleSelectionChange = (selection) => {
        //console.log(selection)
        if (selected.includes(selection.id)) {
            setIsSelected(selected.filter(n => n !== selection.id));
        }
        else {
            setIsSelected([selection.id, ...selected]);
        }
    };

    const handleSelectAll = selection => {
        console.log(selection)
        if (selection.length == data.length) {
            setIsSelected(selection);
        }
        if (selection.length == 0) {
            setIsSelected([]);
        }
    }
    let count = 0;
    //sets id field accordingly
    data.forEach((d) => {
        d.id = count;
        count++;
    });
    //console.log(data);

    let columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "Week", headerName: "Week", width: 150 },
        { field: "javascript", headerName: "Javascript", width: 100 },
        { field: "python", headerName: "Python", width: 100 },
        { field: "java", headerName: "Java", width: 100 },
    ];
    let rows = data;

    return (
        <div ref={dataRef} className="data">
            <DataGrid rows={rows} columns={columns} pageSize={2} checkboxSelection onCellClick={handleSelectionChange} selectedRows={selected}
                onRowSelectionModelChange={(newSelection) => {
                    handleSelectAll(newSelection);
                }}
                selectionModel={selected} />
        </div>
    );
}

export default DataGrid2;