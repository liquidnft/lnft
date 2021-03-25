import { getIntrospectionQuery } from 'graphql';
import fetch from 'node-fetch'; // or your preferred request in Node.js
import * as fs from 'fs';
import { getIntrospectedSchema, minifyIntrospectionQuery } from '@urql/introspection';
fetch('http://localhost:8080/v1/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Hasura-Admin-Secret': 'liquidart' },
  body: JSON.stringify({
    variables: {},
    query: getIntrospectionQuery({ descriptions: false }),
  }),
})
  .then(result => result.json())
  .then(({ data }) => {
    const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));
    fs.writeFileSync('./src/schema.js', JSON.stringify(minified));
  });
