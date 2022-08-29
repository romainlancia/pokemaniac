import React, { useMemo, useEffect, useCallback, useRef, useState } from "react"
import { useInfiniteQuery } from '@tanstack/react-query'
import { request, gql } from "graphql-request";
import Image from "next/image"
import { PokemonData } from "../../../types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable
} from "@tanstack/react-table";
import { useVirtual } from "react-virtual";
import PokemonTypeBadge from "../../common/PokemonTypeBadge";

const FETCH_SIZE = 500;
const POKEDEX_SIZE = 1154;

function usePokemons() {
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

//Refactor this
function formatId(id: string) {
    let formattedId = ""+id
    while(formattedId.length < 3) {
        formattedId = "0"+formattedId
    }
    return formattedId
}

const HomeBody = () => {
    const [pageParam, setPageParam] = useState<number>(1)
    const { data, fetchNextPage, isFetching, isLoading, isError } = usePokemons();

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const columns = React.useMemo<ColumnDef<PokemonData>[]>(
        () => [
            {
                accessorFn: ({ pokemon, sprites }) => [pokemon.id, sprites],
                header: "#",
                cell: ({ getValue }) => {
                    const [id, sprites] = getValue<Array<string>>()
                    const spritesParsed = JSON.parse(sprites)
                    return (
                        <div className="flex flex-row items-center justify-center">
                            {spritesParsed?.front_default ? (
                                    <Image className="object-cover" src={spritesParsed.front_default} width={56} height={42} />
                                ) : <div className="w-[56px] h-[42px]"/>
                            }
                            <p className="ml-1">{formatId(""+id)}</p>
                        </div>
                    )
                } 
            },
            {
                accessorFn: ({ pokemon }) => pokemon.name,
                header: 'Name',
                cell: ({ getValue }) => {
                    const name = getValue<string>()
                    return <p className="capitalize font-bold text-blue-500">{name}</p>
                }
            },
            {
                accessorFn: ({ pokemon }) => pokemon.types.map(({ type }) => type.name),
                header: 'Types',
                cell: ({ getValue }) => {
                    const types = getValue<Array<string>>()
                    return (
                        <div className="flex flex-col items-center justify-center">
                            {types.map((type: string, index: number) => (
                                <PokemonTypeBadge key={`${type}-${index}`} type={type} />
                            ))}
                        </div>
                    )
                }
            },
            {
                accessorFn: ({ pokemon }) => pokemon.stats[0].baseStat,
                header: "HP",
            },
            {
                accessorFn: ({ pokemon }) => pokemon.stats[1].baseStat,
                header: 'Attack',
            },
            {
                accessorFn: ({ pokemon }) => pokemon.stats[2].baseStat,
                header: 'Defense',
            },
            {
                accessorFn: ({ pokemon }) => pokemon.stats[3].baseStat,
                header: 'Sp. Atk',
            },
            {
                accessorFn: ({ pokemon }) => pokemon.stats[4].baseStat,
                header: 'Sp. Def',
            },
            {
                accessorFn: ({ pokemon }) => pokemon.stats[5].baseStat,
                header: 'Speed',
            },
        ],
        []
    )

    const flatData = useMemo(
        () => data?.pages?.flatMap(page => page) ?? [],
        [data]
    )

    const totalFetched = flatData.length;

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
        if (containerRefElement) {
            const { scrollHeight, scrollTop, clientHeight } = containerRefElement
            console.log("scrollHeight - scrollTop - clientHeight: ", scrollHeight - scrollTop - clientHeight)
            if (
                scrollHeight - scrollTop - clientHeight < 900 &&
                !isFetching &&
                totalFetched < POKEDEX_SIZE
            ) {
                console.log("hihihi")
                setPageParam(pageParam => pageParam + 1)
                fetchNextPage({ pageParam })
            }
        }
        },
        [fetchNextPage, isFetching, totalFetched, pageParam]
    )

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    const table = useReactTable({
        data: flatData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false
    });

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10
    });
    const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    const paddingBottom =
        virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0;

    // console.log("re-render")

    return data ? (
        <main>
            <div className="relative top-0 w-full h-28" style={{backgroundColor: "#373737"}}>
                <Image src="https://img.pokemondb.net/design/avif/header-lg.avif" priority layout='fill' objectFit="contain" />
            </div>
            <h1 className="text-4xl text-center font-bold mt-8 mx-8 mb-4">
                Complete Pokémon Pokédex
            </h1>
            <div className="rounded p-4 mx-8 mb-4" style={{backgroundColor: "#F0F0F0" }}>
                <p className="mb-4">This is a full list of <em>every Pokémon</em> from all 8 generations of the Pokémon series, along with their main stats.</p>
                <p>The table is sortable by clicking a column header, and searchable by using the controls above it.</p>
            </div>
            {!isLoading || isError ? (
                <>
                    <div
                        className="mx-8 h-[450px] max-w-full mt-8 overflow-auto"
                        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                        ref={tableContainerRef}
                    >
                        <table>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{ width: header.getSize() }}
                                    className="p-0 border border-gray-400 bg-[#ebebe5] px-[10px] py-[8px]"
                                    >
                                    {header.isPlaceholder ? null : (
                                        <div
                                        {...{
                                            className: header.column.getCanSort()
                                            ? "cursor-pointer select-none"
                                            : "",
                                            onClick: header.column.getToggleSortingHandler()
                                        }}
                                        >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: " 🔼",
                                            desc: " 🔽"
                                        }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    )}
                                    </th>
                                );
                                })}
                            </tr>
                            ))}
                        </thead>
                        <tbody>
                            {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }} />
                            </tr>
                            )}
                            {virtualRows.map((virtualRow) => {
                            const row = rows[virtualRow.index] as Row<PokemonData>;
                            return (
                                <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                    <td key={cell.id} className="font-sans text-center px-3 py-1 h-16 border-b">
                                        {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                        )}
                                    </td>
                                    );
                                })}
                                </tr>
                            );
                            })}
                            {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }} />
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </>
            ) : null}
        </main>
    ) : null
}

export default HomeBody