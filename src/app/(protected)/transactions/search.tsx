import { Button } from "@/components/ui/button";

const Search = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* <Button type="submit">Search</Button> */}
    </div>
  );
};

export default Search;
