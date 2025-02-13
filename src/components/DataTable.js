import React, { useState, useEffect, useCallback } from "react";
import apiService from "../api/apiService";
import styled from "styled-components";
import Modal from "react-modal";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const StyledTh = styled.th`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
`;

const StyledTd = styled.td`
  border: none;
  padding: 12px 15px;
  color: #333;

  &:nth-child(odd) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #ecf0f1;
  }
`;

const StyledTr = styled.tr`
  &:last-child ${StyledTd} {
    border-bottom: none;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px;
  background-color: #f2f2f2;
  border-radius: 8px;
`;

const Button = styled.button`
  background-color: #2ecc71;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 0 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 200px;
`;

const ColumnVisibilityContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f2f2f2;
  border-radius: 8px;
`;

const ColumnVisibilityLabel = styled.label`
  margin-right: 15px;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #555;

  input {
    margin-right: 5px;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  font-size: 14px;
`;

const LoadingMessage = styled.div`
  color: #3498db;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #eaf2ff;
  border: 1px solid #bdd7ee;
  border-radius: 5px;
  font-size: 14px;
`;

const FormContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 500px;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
  },
};

const NoResultsMessage = styled.div`
  padding: 20px;
  text-align: center;
  font-size: 18px;
  color: #777;
`;

Modal.setAppElement("#root");

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [currentData, setCurrentData] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const debouncedFetchData = useCallback(
    debounce((search) => {
      fetchData(search);
    }, 800),
    []
  );

  useEffect(() => {
    debouncedFetchData(searchTerm);
  }, [searchTerm, debouncedFetchData]);

  useEffect(() => {
    fetchData(searchTerm); 
  }, [page, sortColumn, sortOrder]);

  const fetchData = async (search) => {
    setLoading(true);
    setError(null);
    setNoResults(false);

    try {
      let params = {
        _page: page,
        _limit: limit,
      };

      if (search) {
        params.q = search;
      }

      if (sortColumn) {
        params._sort = sortColumn;
        params._order = sortOrder;
      }

      const { data: fetchedData, totalCount: fetchedTotalCount } =
        await apiService?.getAllData(params);

      setData(fetchedData);
      setTotalCount(parseInt(fetchedTotalCount, 10) || 0);

      if (fetchedData?.length > 0) {
        const columnNames = Object.keys(fetchedData[0]);
        setColumns(columnNames);
        setVisibleColumns(columnNames);
      } else {
        setNoResults(true);
      }
    } catch (err) {
      setError(err.message || "An error occurred fetching data.");
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnVisibility = (column) => {
    setVisibleColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((c) => c !== column)
        : [...prevColumns, column]
    );
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); 
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    setCurrentData(data ? { ...data } : getDefaultData());
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === "coordinates[0]" || name === "coordinates[1]") {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = null;
      }
    }

    setCurrentData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
      ...(name === "alias" || name === "regions" || name === "unlocs"
        ? { [name]: value.split(",").map((item) => item.trim()) }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const dataToSend = { ...currentData };
      if (dataToSend.coordinates) {
        dataToSend.coordinates[0] =
          dataToSend.coordinates[0] === null
            ? undefined
            : dataToSend.coordinates[0];
        dataToSend.coordinates[1] =
          dataToSend.coordinates[1] === null
            ? undefined
            : dataToSend.coordinates[1];

        if (
          dataToSend.coordinates[0] === undefined &&
          dataToSend.coordinates[1] === undefined
        ) {
          delete dataToSend.coordinates;
        }
      }

      if (modalType === "create") {
        await apiService.createData(dataToSend);
        toast.success("Data created successfully!");
        fetchData(searchTerm); 
      } else {
        await apiService.updateData(currentData.id, dataToSend);
        toast.success("Data updated successfully!");
        fetchData(searchTerm); 
      }

      closeModal();
    } catch (err) {
      setError(err.message || "An error occurred.");
      toast.error(`Error: ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteData(id);
      toast.success("Data deleted successfully!");
      fetchData(searchTerm); 
    } catch (error) {
      console.error("Error deleting data:", error);
      setError(error.message || "Error deleting data");
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    }
  };

  const generateId = () => {
    const letters = "AE";
    const numbers = "0123456789";
    let id = letters;

    for (let i = 0; i < 3; i++) {
      id += letters[Math.floor(Math.random() * letters.length)];
      id += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return id;
  };

  const getDefaultData = () => ({
    id: generateId(),
    name: "",
    city: "",
    country: "",
    alias: [],
    regions: [],
    province: "",
    timezone: "",
    unlocs: [],
    code: "",
    coordinates: [null, null], 
  });

  if (loading) {
    return <LoadingMessage>Loading data...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <>
      <div>
        <label>Search: </label>
        <Input
          placeholder="Search ID"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <ColumnVisibilityContainer>
        {columns?.map((column) => (
          <ColumnVisibilityLabel key={column}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(column)}
              onChange={() => handleColumnVisibility(column)}
            />
            {column}
          </ColumnVisibilityLabel>
        ))}
      </ColumnVisibilityContainer>

      {noResults ? (
        <NoResultsMessage>No results found.</NoResultsMessage>
      ) : (
        <StyledTable>
          <thead>
            <tr>
              {visibleColumns?.map((column) => (
                <StyledTh key={column} onClick={() => handleSort(column)}>
                  {column} {sortColumn === column && (sortOrder === "asc" ? "▲" : "▼")}
                </StyledTh>
              ))}
              <StyledTh>Actions</StyledTh>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <StyledTr key={item.id}>
                {visibleColumns?.map((column) => (
                  <StyledTd key={`${item.id}-${column}`}>
                    {String(item[column])}
                  </StyledTd>
                ))}
                <StyledTd>
                  <Button onClick={() => openModal("update", item)}>
                    Update
                  </Button>
                  <Button onClick={() => handleDelete(item.id)}>Delete</Button>
                </StyledTd>
              </StyledTr>
            ))}
          </tbody>
        </StyledTable>
      )}

      <Button onClick={() => openModal("create")}>Create New</Button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={ModalStyles}
        contentLabel={`${modalType === "create" ? "Create" : "Update"} Data`}
      >
        <h2>{modalType === "create" ? "Create New Data" : "Update Data"}</h2>
        <form onSubmit={handleSubmit}>
          <FormContainer>
            <FormGroup>
              <FormLabel>Id:</FormLabel>
              <FormInput
                type="text"
                name="id"
                value={currentData?.id || ""}
                onChange={handleInputChange}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Name:</FormLabel>
              <FormInput
                type="text"
                name="name"
                value={currentData?.name || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>City:</FormLabel>
              <FormInput
                type="text"
                name="city"
                value={currentData?.city || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Country:</FormLabel>
              <FormInput
                type="text"
                name="country"
                value={currentData?.country || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Coordinates[0]:</FormLabel>
              <FormInput
                type="number"
                name="coordinates[0]"
                value={currentData?.coordinates?.[0] || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Coordinates[1]:</FormLabel>
              <FormInput
                type="number"
                name="coordinates[1]"
                value={currentData?.coordinates?.[1] || ""}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Alias (comma-separated):</FormLabel>
              <FormInput
                type="text"
                name="alias"
                value={currentData?.alias?.join(",") || ""}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Regions (comma-separated):</FormLabel>
              <FormInput
                type="text"
                name="regions"
                value={currentData?.regions?.join(",") || ""}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Province:</FormLabel>
              <FormInput
                type="text"
                name="province"
                value={currentData?.province || ""}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Timezone:</FormLabel>
              <FormInput
                type="text"
                name="timezone"
                value={currentData?.timezone || ""}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Unlocs (comma-separated):</FormLabel>
              <FormInput
                type="text"
                name="unlocs"
                value={currentData?.unlocs?.join(",") || ""}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Code:</FormLabel>
              <FormInput
                type="text"
                name="code"
                value={currentData?.code || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormContainer>
          <PaginationContainer>
            <Button type="submit">
              {modalType === "create" ? "Create" : "Update"}
            </Button>
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>
          </PaginationContainer>
        </form>
      </Modal>

      <PaginationContainer>
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </PaginationContainer>
    </>
  );
};

export default DataTable;