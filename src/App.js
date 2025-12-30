
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
  const [rowData, setRowData] = useState(() => {
    try {
      const saved = localStorage.getItem("students");
      return saved ? JSON.parse(saved) : [...data];
    } catch (e) {
      return [...data];
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    grade: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    addressStreet: "",
    addressCity: "",
    addressPincode: "",
  });
  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (fd) => {
    const errs = {};
    if (!fd.fullName || fd.fullName.trim().length < 2) errs.fullName = 'Full name is required';
    if (!fd.age || !/^[0-9]+$/.test(fd.age) || Number(fd.age) < 5 || Number(fd.age) > 100)
      errs.age = 'Age must be a number between 5 and 100';
    if (!fd.grade || !/^[A-D]$/.test(fd.grade)) errs.grade = 'Grade must be A, B, C or D';
    if (!fd.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    else if (new Date(fd.dateOfBirth) > new Date()) errs.dateOfBirth = 'Date of birth cannot be in the future';
    if (!fd.phone || !/^\d{10}$/.test(fd.phone)) errs.phone = 'Phone must be 10 digits';
    if (!fd.email || !/^\S+@\S+\.\S+$/.test(fd.email)) errs.email = 'Email is invalid';
    if (!fd.addressStreet || fd.addressStreet.trim().length === 0) errs.addressStreet = 'Street is required';
    if (!fd.addressCity || fd.addressCity.trim().length === 0) errs.addressCity = 'City is required';
    if (!fd.addressPincode || !/^\d{6}$/.test(fd.addressPincode)) errs.addressPincode = 'Pincode must be 6 digits';
    return errs;
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const validation = validate(formData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const newStudent = {
      name: formData.fullName,
      age: formData.age,
      grade: formData.grade,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
      email: formData.email,
      address: {
        street: formData.addressStreet,
        city: formData.addressCity,
        pincode: formData.addressPincode,
      },
    };

    setRowData((prev) => {
      const updated = [...prev, newStudent];
      try {
        localStorage.setItem("students", JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    // Try persisting to local API if available
    fetch("http://localhost:4000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then((saved) => {
        // replace last (unsaved) entry with saved entry (which includes id)
        setRowData((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = saved;
          try {
            localStorage.setItem("students", JSON.stringify(updated));
          } catch (err) {}
          return updated;
        });
      })
      .catch(() => {
        // ignore; localStorage already updated
      });

    setErrors({});

    setFormData({
      fullName: "",
      age: "",
      grade: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      addressStreet: "",
      addressCity: "",
      addressPincode: "",
    });
    setShowForm(false);
  };
  return (
    <div>
      <button onClick={() => setShowForm((s) => !s)} style={{ marginBottom: 8 }}>
        + Add
      </button>
      {showForm && (
        <form onSubmit={handleAddStudent} style={{ marginBottom: 12 }}>
          <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <div role="alert">{errors.fullName}</div>}
          <input name="age" type="text" placeholder="Age" value={formData.age} onChange={handleChange} />
          {errors.age && <div role="alert">{errors.age}</div>}
          <input name="grade" type="text" placeholder="Grade" value={formData.grade} onChange={handleChange} />
          {errors.grade && <div role="alert">{errors.grade}</div>}
          <input name="dateOfBirth" type="date" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} />
          {errors.dateOfBirth && <div role="alert">{errors.dateOfBirth}</div>}
          <input name="phone" type="text" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <div role="alert">{errors.phone}</div>}
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <div role="alert">{errors.email}</div>}
          <input name="addressStreet" type="text" placeholder="Street" value={formData.addressStreet} onChange={handleChange} />
          {errors.addressStreet && <div role="alert">{errors.addressStreet}</div>}
          <input name="addressCity" type="text" placeholder="City" value={formData.addressCity} onChange={handleChange} />
          {errors.addressCity && <div role="alert">{errors.addressCity}</div>}
          <input name="addressPincode" type="text" placeholder="Pincode" value={formData.addressPincode} onChange={handleChange} />
          {errors.addressPincode && <div role="alert">{errors.addressPincode}</div>}
          <button type="submit">Submit</button>
        </form>
      )}
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
    </div>
  );
}

export default App;
export { WishHappyBirthday };
