import Image from 'next/image';
import { Heading, Text, SimpleGrid } from '@chakra-ui/react';

const Characters = ({ characters }) => {
    return (
        <SimpleGrid columns={[1, 2, 3]} spacing="40px">
            {characters.map(character => (
                <div key={character.id}>
                    <Image src={character.image} alt={character.name} width={300} height={300} />
                    <Heading as="h4" align="center" size="md">
                        {character.name}
                    </Heading>
                    <Text align="center">Origin: {character.origin.name}</Text>
                    <Text align="center">Location: {character.location.name}</Text>
                </div>
            ))}
        </SimpleGrid>
    );
};

export default Characters;
