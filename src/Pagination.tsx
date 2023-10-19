import { ChangeEvent, Dispatch, FC, useCallback, SetStateAction } from "react";
import { PaginationData } from "./types";

interface PaginationProps {
  value: PaginationData;
  setValue: Dispatch<SetStateAction<PaginationData>>;
}

const Pagination: FC<PaginationProps> = ({ value, setValue }) => {
  const page = value.offset / value.limit + 1;
  const setLimit = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => 
      setValue({
        limit: parseInt(e.target.value, 10),
        offset: 0
      }),
      [setValue]
  );

  const onNextPage = useCallback(() => {
    setValue((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  }, [setValue]);

  const onPrevPage = useCallback(() => {
    setValue((prev) => ({
      ...prev,
      offset: Math.max(prev.offset - prev.limit, 0)
    }));
  }, [setValue]);

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
      <div>
        <span>By page:</span>
        <select
          value={value.limit}
          style={{ marginLeft: "4px" }}
          onChange={setLimit}
        >
          <option>2</option>
          <option>4</option>
          <option>8</option>
        </select>
      </div>
      <button disabled={page === 1} onClick={onPrevPage}>
        prev
      </button>
      <span>page: {page}</span>
      <button onClick={onNextPage}>next</button>
    </div>
  );
};

export default Pagination;