import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql/',
    cache: new InMemoryCache(),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const name = req.body;

    try {
        const { data } = await client.query({
            query: gql`
                query($name: String!) {
                    characters(filter: { name: $name }) {
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
            variables: { name },
        });

        res.status(200).json({
            newCharacters: data.characters.results,
            error: null,
        });
    } catch (error) {
        if (error.message === '404: Not Found') {
            res.status(404).json({
                newCharacters: null,
                error: 'No Character Found',
            });
        } else {
            res.status(500).json({
                newCharacters: null,
                error: 'Internal Error. Please Try again',
            });
        }
    }
};
