import { useMemo } from "react";
import { Axios } from "axios";
import { useQuery } from "react-query";

export type Pokemon = {
  name: string;
  url: string;
};

export type PokemonResponse = {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
};

export const usePokemon = (offset?: number, limit: number = 10) => {
  const axios = useMemo(() => {
    return new Axios({
      baseURL: "https://pokeapi.co/api/v2",
      validateStatus: (status) => status >= 200 && status < 500,
    });
  }, []);

  return useQuery(
    ["pokemon", offset, limit],
    async () =>
      axios.get<PokemonResponse>("/pokemon", {
        params: {
          offset,
          limit,
        },
      }),
    {
      select: (response) => response.data,
    },
  );
};
