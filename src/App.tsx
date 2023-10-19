import { ChangeEvent, useCallback, useRef, useState, useEffect, ReactNode } from "react";
import { requestUsers } from "./api";
import type { PaginationData, User, Query, FiltersData } from "./types";
import { useDebounce } from "./lib/useDebounce";
import Pagination from "./Pagination";
import "./styles.css";


const initialFilterValues: FiltersData = {
  name: "",
  age: ""
};

const initialPaginationValues: PaginationData = {
  offset: 0,
  limit: 4
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [filters, setFilters] = useState(initialFilterValues);
  const [pagination, setPagination] = useState(initialPaginationValues);
  const debouncedFilters = useDebounce(filters);
  const prevQueryRef = useRef<Query | null>(null);

  const patchFormFromInput = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [target.name]: target.value
      }));
      setPagination(initialPaginationValues);
    },
    []
  );  

  const getUsers = (): ReactNode => {
    if (isLoading || error) return;
    if (users.length === 0)
      return <div style={{ marginTop: "16px" }} >Users not found</div>;
    return users.map((user, index) => (
      <div key={user.id} style={{ marginTop: index === 0 ? "16px" : "4px" }} >
        {user.name}, {user.age}
      </div>
    ));
  };

  useEffect(() => {
    const request = async () => {
      setIsLoading(true);
      const query = { ...pagination, ...debouncedFilters };
      prevQueryRef.current = query;

      try {
        const fetchedUsers = await requestUsers(query);
        if (prevQueryRef.current !== query) return;
        setUsers(fetchedUsers);
      } catch (e) {
        if (prevQueryRef.current !== query) return;
        if (e) setError(((e as Record<string, string>) || {}).message);
      } finally {
        if (prevQueryRef.current !== query) return;
        setIsLoading(false);
      }
    };

    request();
  }, [pagination, debouncedFilters]);

  return (
    <div>
      <input 
        value={filters.name}
        placeholder="Name"
        name="name"
        onChange={patchFormFromInput}
      />
      <input 
        value={filters.age}
        style={{ marginLeft: "8px" }}
        placeholder="Age"
        type="number"
        name="age"
        onChange={patchFormFromInput}
      />

      <Pagination value={pagination} setValue={setPagination} />

      {isLoading && <div style={{ marginTop: "16px" }} >Loading...</div>}
      {!isLoading && error && <div style={{ marginTop: "16px" }} >{error}</div>}
      {getUsers()}
    </div>
  )
};