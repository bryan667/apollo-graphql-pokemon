import React from 'react';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider, Query, graphql } from 'react-apollo';
import sample from 'lodash.sample';

const client = new ApolloClient({
  uri: 'https://graphql-pokemon.now.sh',
  clientState: {
    defaults: { counter: 0 },
    resolvers: {
      Mutation: {
        incCounter: (_, { value }, { cache }) => {
          cache.writeData({ data: { counter: value } });
          return null;
        },
      },
    },
  },
});

const GET_POKEMON = gql`
  query($name: String!) {
    counter @client
    pokemon(name: $name) {
      image
    }
  }
`;

const INCREMENT_COUNTER = gql`
  mutation($value: String!) {
    incCounter(value: $value) @client
  }
`;

const pokemonArray = [
  'Bulbasaur',
  'Charmander',
  'Ivysaur',
  'Pikachu',
  'Venusaur',
];

const Pokemon = ({ name, image }) => (
  <div>
    <img alt="pokemon" src={image} style={{ height: 200 }} />
  </div>
);

let PokemonQuery = props => (
  <Query query={GET_POKEMON} variables={{ name: sample(pokemonArray) }}>
    {({ loading, error, data, refetch }) => {
      if (error) return <div>Error</div>;

      return (
        <div style={{ textAlign: 'center', height: 200 }}>
          {console.log('propshere', props, data.counter)}
          {!loading ? (
            <Pokemon name={data.pokemon.name} image={data.pokemon.image} />
          ) : (
            <div>
              <img
                alt="loading"
                src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif"
                style={{ height: 200 }}
              />
            </div>
          )}
          <button
            className="button is-primary"
            onClick={async () => {
              await refetch({ name: sample(pokemonArray) });
              props.incCounter({ variables: { value: data.counter + 1 } });
            }}
            style={{ marginTop: 20 }}
          >
            Randomize - {data.counter}
          </button>
        </div>
      );
    }}
  </Query>
);

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <PokemonQuery />
  </ApolloProvider>
);

PokemonQuery = graphql(INCREMENT_COUNTER, { name: 'incCounter' })(PokemonQuery);

export default ApolloApp;
