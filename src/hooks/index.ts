import { useInfiniteQuery } from '@tanstack/react-query'
import { request, gql } from "graphql-request";
import { FETCH_SIZE } from "consts"

export function usePokemons() {
    return useInfiniteQuery(['pokemons'], async ({ pageParam = 0 }) => {
        const endpoint = "https://beta.pokeapi.co/graphql/v1beta" 
        const query = gql`
            query pokemons($offset: Int!, $limit: Int!) {
                pokemons: pokemon_v2_pokemonsprites(offset: $offset, limit: $limit, order_by: { pokemon_id: asc }) {
                    sprites
                    pokemon: pokemon_v2_pokemon {
                        id
                        name
                        stats: pokemon_v2_pokemonstats {
                            baseStat: base_stat
                            stat: pokemon_v2_stat {
                            name
                            }
                        }
                        types: pokemon_v2_pokemontypes {
                            type: pokemon_v2_type {
                            name
                            }
                        }
                    }
                }
            }
        `
        const variables = {
            offset: pageParam * FETCH_SIZE,
            limit: FETCH_SIZE
        }
        const { pokemons } = await request(endpoint, query, variables);
        return pokemons;
    },
    {
        getNextPageParam: (_lastPage, allPages) => {
            return allPages.length
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}
