import React, { useEffect, useState } from "react";
import { Pokemon, PokemonResponse, usePokemon } from "../../../hooks";
import { Input, Table } from "antd";
import { Container, SearchContainer } from "pages/Pokemon/styled";

const tableColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "URL",
    dataIndex: "url",
    key: "url",
  },
];

type PokemonWithId = Pokemon & {
  id: number;
};

const PokemonPage = () => {
  const [pokemonResponse, setPokemonResponse] = useState<PokemonResponse>();
  const [pokemmon, setPokemon] = useState<PokemonWithId[]>([]);
  const [search, setSearch] = useState<string>();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { data, error, isLoading } = usePokemon(offset, limit);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setOffset((page - 1) * pageSize);
  };

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  useEffect(() => {
    if (data && !error) {
      setPokemonResponse(JSON.parse(data as unknown as string));
    }
  }, [data, error]);

  useEffect(() => {
    if (pokemonResponse?.results) {
      setTotalPages(Math.ceil(pokemonResponse.count / limit));

      const data = pokemonResponse.results.map((pokemon, index) => ({
        ...pokemon,
        id: index,
      }));

      if (search) {
        const filteredData = data.filter((pokemon) =>
          pokemon.name.includes(search),
        );
        setPokemon(filteredData);
      } else {
        setPokemon(data);
      }
    }
  }, [limit, pokemonResponse, search]);

  if (!pokemonResponse) {
    return <strong>Loading...</strong>;
  }

  return (
    <Container>
      {isLoading && <strong>Fetching Data...</strong>}

      <SearchContainer>
        <Input placeholder={"Search"} onChange={handleSearchChange} />
      </SearchContainer>

      <Table
        columns={tableColumns}
        dataSource={pokemmon}
        pagination={{
          defaultCurrent: page,
          total: totalPages,
          pageSize: limit,
          onChange: handlePaginationChange,
        }}
      />
    </Container>
  );
};

export default PokemonPage;
