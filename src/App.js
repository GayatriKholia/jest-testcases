
import './App.css';
import data from "./students.json";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
// import { themeQuartz } from "ag-grid-community";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const WishHappyBirthday = ({ name }) => (
  <button onClick={() => alert(`Happy Birthday 🎂 ${name}`)}>
    Wish Birthday 🎂
  </button>
);

function App() {
  const [rowData, setRowData] = useState([...data]);
  const [columnDefs, setColumns] = useState([
    {
      field: "name",
      flex: 1,
      headerName: "Full Name",
      filter: true,
      editable: true,
      checkboxSelection: true,
    },
    {
      field: "age",
      flex: 1,
      headerName: "Age",
      filter: true,
      floatingFilter: true,
      cellClassRules: { "rag-green": (params) => params.value < 22 },
    },
    {
      field: "grade",
      flex: 1,
      headerName: "Grade",
      filter: true,
      floatingFilter: true,
    },
    { field: "dateOfBirth", flex: 1, headerName: "Date of Birth" },
    { field: "phone", flex: 1, headerName: "Phone" },
    { field: "email", flex: 1, headerName: "Email" },
    {
      headerName: "Address",
      valueGetter: ({ data }) =>
        `${data.address.street}, ${data.address.city},${data.address.pincode}`,
    },
    {
      field: "birthday",
      cellRenderer: (props) => {
        console.log(props);
        return <WishHappyBirthday name={props.data.name} />;
      },
    },
  ]);
  const rowClassRules = {
    rowred: (row) => row.data.grade === "D",
  };
  return (
    <div style={{ height: 600, width: "100%" }}>
      <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 15]}
          rowClassRules={rowClassRules}
        />
    </div>
  );
}

export default App;
export { WishHappyBirthday };
