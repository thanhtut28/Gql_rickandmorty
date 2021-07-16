/* eslint-disable react/jsx-no-undef */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { Heading, Box, Flex, Input, Stack, IconButton, useToast } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import Characters from '../components/Characters';

export default function Home(results) {
    const initialState = results;
    const [characters, setCharacters] = useState(initialState.characters);
    const [search, setSearch] = useState('');
    const toast = useToast();

    const searchSubmitHandler = async e => {
        e.preventDefault();
        const results = await fetch('/api/searchCharacters', {
            method: 'POST',
            body: search,
        });

        const { newCharacters, error } = await results.json();
        if (error) {
            toast({
                position: 'bottom',
                title: 'An error occured',
                description: error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            setCharacters(newCharacters);
        }
    };

    return (
        <Flex direction="column" justify="center" align="center">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box mb={4} py={8} flexDirection="column" align="center" justify="center">
                <Heading as="h1" size="2xl" mb={8}>
                    Rick and Morty
                </Heading>
                <form onSubmit={searchSubmitHandler}>
                    <Stack maxWidth="350px" width="100%" isInline mb={8}>
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <IconButton
                            colorScheme="blue"
                            aria-label="Search Database"
                            // eslint-disable-next-line react/jsx-no-undef
                            icon={<SearchIcon />}
                            disabled={!search}
                            type="submit"
                        />
                        <IconButton
                            colorScheme="red"
                            aria-label="Reset Button"
                            icon={<CloseIcon />}
                            disabled={!search}
                            onClick={() => {
                                setSearch('');
                                setCharacters(initialState.characters);
                            }}
                        />
                    </Stack>
                </form>
                <Characters characters={characters} />
            </Box>
            <footer className={styles.footer}>
                Powered by Energy Drinks 🥫 and YouTube Subscribers.
            </footer>
        </Flex>
    );
}

export async function getStaticProps() {
    const client = new ApolloClient({
        uri: 'https://rickandmortyapi.com/graphql/',
        cache: new InMemoryCache(),
    });
    const { data } = await client.query({
        query: gql`
            {
                characters(page: 1) {
                    info {
                        count
                        pages
                    }
                    results {
                        name
                        id
                        location {
                            id
                            name
                        }
                        origin {
                            id
                            name
                        }
                        episode {
                            id
                            episode
                            air_date
                        }
                        image
                    }
                }
            }
        `,
    });

    return {
        props: {
            characters: data.characters.results,
        },
    };
}
