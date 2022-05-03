export default {
  __schema: {
    queryType: { name: "query_root" },
    mutationType: { name: "mutation_root" },
    subscriptionType: { name: "subscription_root" },
    types: [
      {
        kind: "OBJECT",
        name: "__Directive",
        fields: [
          {
            name: "args",
            type: { kind: "OBJECT", name: "__InputValue" },
            args: [],
          },
          {
            name: "description",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "isRepeatable",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "locations",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "name",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "__EnumValue",
        fields: [
          {
            name: "deprecationReason",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "description",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "isDeprecated",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "name",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "__Field",
        fields: [
          {
            name: "args",
            type: { kind: "OBJECT", name: "__InputValue" },
            args: [],
          },
          {
            name: "deprecationReason",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "description",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "isDeprecated",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "name",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "type", type: { kind: "OBJECT", name: "__Type" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "__InputValue",
        fields: [
          {
            name: "defaultValue",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "description",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "name",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "type", type: { kind: "OBJECT", name: "__Type" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "__Schema",
        fields: [
          {
            name: "description",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "directives",
            type: { kind: "OBJECT", name: "__Directive" },
            args: [],
          },
          {
            name: "mutationType",
            type: { kind: "OBJECT", name: "__Type" },
            args: [],
          },
          {
            name: "queryType",
            type: { kind: "OBJECT", name: "__Type" },
            args: [],
          },
          {
            name: "subscriptionType",
            type: { kind: "OBJECT", name: "__Type" },
            args: [],
          },
          { name: "types", type: { kind: "OBJECT", name: "__Type" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "__Type",
        fields: [
          {
            name: "description",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "enumValues",
            type: { kind: "OBJECT", name: "__EnumValue" },
            args: [
              {
                name: "includeDeprecated",
                type: { kind: "SCALAR", name: "Any" },
              },
            ],
          },
          {
            name: "fields",
            type: { kind: "OBJECT", name: "__Field" },
            args: [
              {
                name: "includeDeprecated",
                type: { kind: "SCALAR", name: "Any" },
              },
            ],
          },
          {
            name: "inputFields",
            type: { kind: "OBJECT", name: "__InputValue" },
            args: [],
          },
          {
            name: "interfaces",
            type: { kind: "OBJECT", name: "__Type" },
            args: [],
          },
          {
            name: "kind",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "name",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "ofType",
            type: { kind: "OBJECT", name: "__Type" },
            args: [],
          },
          {
            name: "possibleTypes",
            type: { kind: "OBJECT", name: "__Type" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork",
            type: { kind: "OBJECT", name: "artworks" },
            args: [],
          },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "activebids_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "activebids" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "activebids_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "activebids_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "activebids_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "activebids_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "activebids_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "activebids_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "activebids_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "activebids_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "activebids_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "activebids_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_avg_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_max_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_min_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_stddev_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_stddev_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_stddev_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_sum_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_var_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_var_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activebids_variance_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "activelistings_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "activelistings" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "activelistings_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "activelistings_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "activelistings_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "activelistings_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "activelistings_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "activelistings_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "activelistings_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "activelistings_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "activelistings_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "activelistings_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_avg_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_max_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_min_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_stddev_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_stddev_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_stddev_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_sum_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_var_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_var_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "activelistings_variance_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists",
        fields: [
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "artists_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artists" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "artists_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "artists_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "artists_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "artists_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "artists_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "artists_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "artists_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "artists_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "artists_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "artists_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_avg_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_max_fields",
        fields: [
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_min_fields",
        fields: [
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artists" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_stddev_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_stddev_pop_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_stddev_samp_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_sum_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_var_pop_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_var_samp_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artists_variance_fields",
        fields: [
          { name: "avg_sale", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "creations",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "highest_sale",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "sold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_sales",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks",
        fields: [
          {
            name: "artist",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users" },
            },
            args: [],
          },
          {
            name: "artist_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "artist_owned",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "asking_asset",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "auction_end",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_release_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_start",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "bid",
            type: {
              kind: "LIST",
              ofType: {
                kind: "NON_NULL",
                ofType: { kind: "OBJECT", name: "transactions" },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "description",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "edition",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "editions",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "favorited",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "favorites",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "favorites" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "favorites_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "filename",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "filetype", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "held", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "is_physical",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "last_active",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "num_favorites",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "owner",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users" },
            },
            args: [],
          },
          {
            name: "owner_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "slug", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "tags",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "tags" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "tags_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "tags_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          { name: "ticker", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "title",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "transactions",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "transactions" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "transactions_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "transactions_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "transferred_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "views",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "artworks_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artworks" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "artworks_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "artworks_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "artworks_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "artworks_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "artworks_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "artworks_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "artworks_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "artworks_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "artworks_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "artworks_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_avg_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_max_fields",
        fields: [
          {
            name: "artist_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "asking_asset",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "auction_end",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_release_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_start",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "description",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "filename", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "filetype", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owner_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "slug", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "ticker", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "title", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "transferred_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_min_fields",
        fields: [
          {
            name: "artist_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "asking_asset",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "auction_end",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_release_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_start",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auction_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "description",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "filename", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "filetype", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price_tx",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owner_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "slug", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "ticker", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "title", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "transferred_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artworks" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_stddev_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_stddev_pop_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_stddev_samp_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_sum_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_var_pop_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_var_samp_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "artworks_variance_fields",
        fields: [
          {
            name: "bid_increment",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "edition", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "editions", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "extension_interval",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "list_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "max_extensions",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "reserve_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "royalty", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "views", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_providers",
        fields: [
          {
            name: "account",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_accounts" },
            },
            args: [],
          },
          {
            name: "account_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "auth_provider",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "auth_provider_unique_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "provider",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_providers" },
            },
            args: [],
          },
          {
            name: "updated_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_providers_aggregate",
        fields: [
          {
            name: "aggregate",
            type: {
              kind: "OBJECT",
              name: "auth_account_providers_aggregate_fields",
            },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_providers" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_providers_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "auth_account_providers_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "auth_account_providers_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_providers_max_fields",
        fields: [
          {
            name: "account_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auth_provider",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auth_provider_unique_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_providers_min_fields",
        fields: [
          {
            name: "account_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auth_provider",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "auth_provider_unique_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_providers_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_providers" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_roles",
        fields: [
          {
            name: "account",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_accounts" },
            },
            args: [],
          },
          {
            name: "account_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "role",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "roleByRole",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_roles" },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_roles_aggregate",
        fields: [
          {
            name: "aggregate",
            type: {
              kind: "OBJECT",
              name: "auth_account_roles_aggregate_fields",
            },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_roles" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_roles_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "auth_account_roles_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "auth_account_roles_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_roles_max_fields",
        fields: [
          {
            name: "account_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "role", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_roles_min_fields",
        fields: [
          {
            name: "account_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "role", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_account_roles_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_roles" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_accounts",
        fields: [
          {
            name: "account_providers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_providers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "account_providers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "OBJECT",
                name: "auth_account_providers_aggregate",
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "account_roles",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_roles" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "account_roles_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_account_roles_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "active",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "custom_register_data",
            type: { kind: "SCALAR", name: "Any" },
            args: [{ name: "path", type: { kind: "SCALAR", name: "Any" } }],
          },
          {
            name: "default_role",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "is_anonymous",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "mfa_enabled",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "new_email",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "otp_secret",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "password_hash",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "refresh_tokens",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_refresh_tokens" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "refresh_tokens_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_refresh_tokens_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "role",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_roles" },
            },
            args: [],
          },
          {
            name: "ticket",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "ticket_expires_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "updated_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "user",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users" },
            },
            args: [],
          },
          {
            name: "user_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_accounts_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "auth_accounts_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_accounts" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_accounts_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "auth_accounts_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "auth_accounts_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_accounts_max_fields",
        fields: [
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "default_role",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "new_email",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "otp_secret",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "password_hash",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "ticket", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "ticket_expires_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_accounts_min_fields",
        fields: [
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "default_role",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "new_email",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "otp_secret",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "password_hash",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "ticket", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "ticket_expires_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_accounts_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_accounts" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_providers",
        fields: [
          {
            name: "account_providers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_providers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "account_providers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "OBJECT",
                name: "auth_account_providers_aggregate",
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "provider",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_providers_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "auth_providers_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_providers" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_providers_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "auth_providers_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "auth_providers_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_providers_max_fields",
        fields: [
          { name: "provider", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_providers_min_fields",
        fields: [
          { name: "provider", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_providers_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_providers" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_refresh_tokens",
        fields: [
          {
            name: "account",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_accounts" },
            },
            args: [],
          },
          {
            name: "account_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "expires_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "refresh_token",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_refresh_tokens_aggregate",
        fields: [
          {
            name: "aggregate",
            type: {
              kind: "OBJECT",
              name: "auth_refresh_tokens_aggregate_fields",
            },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_refresh_tokens" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_refresh_tokens_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "auth_refresh_tokens_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "auth_refresh_tokens_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_refresh_tokens_max_fields",
        fields: [
          {
            name: "account_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "expires_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "refresh_token",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_refresh_tokens_min_fields",
        fields: [
          {
            name: "account_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "expires_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "refresh_token",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_refresh_tokens_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_refresh_tokens" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_roles",
        fields: [
          {
            name: "account_roles",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_roles" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "account_roles_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_account_roles_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "accounts",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_accounts" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "accounts_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_accounts_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "role",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_roles_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "auth_roles_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_roles" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_roles_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "auth_roles_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "auth_roles_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_roles_max_fields",
        fields: [
          { name: "role", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_roles_min_fields",
        fields: [
          { name: "role", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "auth_roles_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_roles" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "collectors_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "collectors" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "collectors_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "collectors_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "collectors_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "collectors_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "collectors_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "collectors_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "collectors_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "collectors_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "collectors_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "collectors_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_avg_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_max_fields",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_min_fields",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "collectors" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_stddev_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_stddev_pop_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_stddev_samp_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_sum_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_var_pop_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_var_samp_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "collectors_variance_fields",
        fields: [
          {
            name: "avg_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "collected",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "owned", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "resold", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "total_price",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "currentuser",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "bio", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "blindkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confidential",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "display_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "full_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "info", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "is_admin", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "is_artist",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "location", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "mnemonic", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "multisig", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "pubkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "twitter", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "wallet_initialized",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "website", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "currentuser_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "currentuser_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "currentuser" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "currentuser_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "currentuser_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "currentuser_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "currentuser_max_fields",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "bio", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "blindkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confidential",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "display_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "full_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "info", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "location", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "mnemonic", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "multisig", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "pubkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "twitter", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "website", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "currentuser_min_fields",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "bio", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "blindkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confidential",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "display_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "full_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "info", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "location", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "mnemonic", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "multisig", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "pubkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "twitter", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "website", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "currentuser_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "currentuser" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "favorites",
        fields: [
          {
            name: "artwork",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artworks" },
            },
            args: [],
          },
          {
            name: "artwork_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "user",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users" },
            },
            args: [],
          },
          {
            name: "user_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "favorites_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "favorites_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "favorites" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "favorites_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "favorites_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "favorites_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "favorites_max_fields",
        fields: [
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "favorites_min_fields",
        fields: [
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "favorites_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "favorites" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "featured",
        fields: [
          {
            name: "artwork",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artworks" },
            },
            args: [],
          },
          {
            name: "artwork_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "end_date",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "start_date",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "white",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "featured_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "featured_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "featured" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "featured_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "featured_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "featured_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "featured_max_fields",
        fields: [
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "end_date", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "start_date",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "featured_min_fields",
        fields: [
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "end_date", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "start_date",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "featured_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "featured" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "follows",
        fields: [
          {
            name: "follower_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "user",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users" },
            },
            args: [],
          },
          {
            name: "userByFollowerId",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users" },
            },
            args: [],
          },
          {
            name: "user_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "follows_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "follows_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "follows" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "follows_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "follows_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "follows_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "follows_max_fields",
        fields: [
          {
            name: "follower_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "follows_min_fields",
        fields: [
          {
            name: "follower_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "follows_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "follows" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "invitees",
        fields: [
          {
            name: "email",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "invitees_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "invitees_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "invitees" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "invitees_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "invitees_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "invitees_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "invitees_max_fields",
        fields: [
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "invitees_min_fields",
        fields: [
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "invitees_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "invitees" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "mutation_root",
        fields: [
          {
            name: "delete_artists",
            type: { kind: "OBJECT", name: "artists_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_artworks",
            type: { kind: "OBJECT", name: "artworks_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_comments",
            type: { kind: "OBJECT", name: "comments_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_artworks_by_pk",
            type: { kind: "OBJECT", name: "artworks" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_comments_by_pk",
            type: { kind: "OBJECT", name: "comments" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_account_providers",
            type: {
              kind: "OBJECT",
              name: "auth_account_providers_mutation_response",
            },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_account_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_account_providers" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_account_roles",
            type: {
              kind: "OBJECT",
              name: "auth_account_roles_mutation_response",
            },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_account_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_account_roles" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_accounts",
            type: { kind: "OBJECT", name: "auth_accounts_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_accounts_by_pk",
            type: { kind: "OBJECT", name: "auth_accounts" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_providers",
            type: { kind: "OBJECT", name: "auth_providers_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_providers" },
            args: [
              {
                name: "provider",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_refresh_tokens",
            type: {
              kind: "OBJECT",
              name: "auth_refresh_tokens_mutation_response",
            },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_refresh_tokens_by_pk",
            type: { kind: "OBJECT", name: "auth_refresh_tokens" },
            args: [
              {
                name: "refresh_token",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_roles",
            type: { kind: "OBJECT", name: "auth_roles_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_auth_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_roles" },
            args: [
              {
                name: "role",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_collectors",
            type: { kind: "OBJECT", name: "collectors_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_currentuser",
            type: { kind: "OBJECT", name: "currentuser_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_favorites",
            type: { kind: "OBJECT", name: "favorites_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_favorites_by_pk",
            type: { kind: "OBJECT", name: "favorites" },
            args: [
              {
                name: "artwork_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "user_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_featured",
            type: { kind: "OBJECT", name: "featured_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_featured_by_pk",
            type: { kind: "OBJECT", name: "featured" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_follows",
            type: { kind: "OBJECT", name: "follows_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_follows_by_pk",
            type: { kind: "OBJECT", name: "follows" },
            args: [
              {
                name: "follower_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "user_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_invitees",
            type: { kind: "OBJECT", name: "invitees_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_invitees_by_pk",
            type: { kind: "OBJECT", name: "invitees" },
            args: [
              {
                name: "email",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_samples",
            type: { kind: "OBJECT", name: "samples_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_samples_by_pk",
            type: { kind: "OBJECT", name: "samples" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_tags",
            type: { kind: "OBJECT", name: "tags_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_tags_by_pk",
            type: { kind: "OBJECT", name: "tags" },
            args: [
              {
                name: "artwork_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "tag",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_transactions",
            type: { kind: "OBJECT", name: "transactions_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_transactions_by_pk",
            type: { kind: "OBJECT", name: "transactions" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_users",
            type: { kind: "OBJECT", name: "users_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_users_by_pk",
            type: { kind: "OBJECT", name: "users" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_utxos",
            type: { kind: "OBJECT", name: "utxos_mutation_response" },
            args: [
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "delete_utxos_by_pk",
            type: { kind: "OBJECT", name: "utxos" },
            args: [
              {
                name: "utxo",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "insert_artists",
            type: { kind: "OBJECT", name: "artists_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
            ],
          },
          {
            name: "insert_artists_one",
            type: { kind: "OBJECT", name: "artists" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "insert_artworks",
            type: { kind: "OBJECT", name: "artworks_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_artworks_one",
            type: { kind: "OBJECT", name: "artworks" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_account_providers",
            type: {
              kind: "OBJECT",
              name: "auth_account_providers_mutation_response",
            },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_account_providers_one",
            type: { kind: "OBJECT", name: "auth_account_providers" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_account_roles",
            type: {
              kind: "OBJECT",
              name: "auth_account_roles_mutation_response",
            },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_account_roles_one",
            type: { kind: "OBJECT", name: "auth_account_roles" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_accounts",
            type: { kind: "OBJECT", name: "auth_accounts_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_accounts_one",
            type: { kind: "OBJECT", name: "auth_accounts" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_providers",
            type: { kind: "OBJECT", name: "auth_providers_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_providers_one",
            type: { kind: "OBJECT", name: "auth_providers" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_refresh_tokens",
            type: {
              kind: "OBJECT",
              name: "auth_refresh_tokens_mutation_response",
            },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_refresh_tokens_one",
            type: { kind: "OBJECT", name: "auth_refresh_tokens" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_roles",
            type: { kind: "OBJECT", name: "auth_roles_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_auth_roles_one",
            type: { kind: "OBJECT", name: "auth_roles" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_collectors",
            type: { kind: "OBJECT", name: "collectors_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
            ],
          },
          {
            name: "insert_collectors_one",
            type: { kind: "OBJECT", name: "collectors" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "insert_currentuser",
            type: { kind: "OBJECT", name: "currentuser_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
            ],
          },
          {
            name: "insert_currentuser_one",
            type: { kind: "OBJECT", name: "currentuser" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "insert_favorites",
            type: { kind: "OBJECT", name: "favorites_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_favorites_one",
            type: { kind: "OBJECT", name: "favorites" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_featured",
            type: { kind: "OBJECT", name: "featured_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_featured_one",
            type: { kind: "OBJECT", name: "featured" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_follows",
            type: { kind: "OBJECT", name: "follows_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_follows_one",
            type: { kind: "OBJECT", name: "follows" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_invitees",
            type: { kind: "OBJECT", name: "invitees_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_invitees_one",
            type: { kind: "OBJECT", name: "invitees" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_samples",
            type: { kind: "OBJECT", name: "samples_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_samples_one",
            type: { kind: "OBJECT", name: "samples" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_tags",
            type: { kind: "OBJECT", name: "tags_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_tags_one",
            type: { kind: "OBJECT", name: "tags" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_transactions",
            type: { kind: "OBJECT", name: "transactions_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_transactions_one",
            type: { kind: "OBJECT", name: "transactions" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_users",
            type: { kind: "OBJECT", name: "users_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_users_one",
            type: { kind: "OBJECT", name: "users" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_utxos",
            type: { kind: "OBJECT", name: "utxos_mutation_response" },
            args: [
              {
                name: "objects",
                type: {
                  kind: "NON_NULL",
                  ofType: {
                    kind: "LIST",
                    ofType: {
                      kind: "NON_NULL",
                      ofType: { kind: "SCALAR", name: "Any" },
                    },
                  },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "insert_utxos_one",
            type: { kind: "OBJECT", name: "utxos" },
            args: [
              {
                name: "object",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              { name: "on_conflict", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "update_artists",
            type: { kind: "OBJECT", name: "artists_mutation_response" },
            args: [
              { name: "_inc", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_artworks",
            type: { kind: "OBJECT", name: "artworks_mutation_response" },
            args: [
              { name: "_inc", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_artworks_by_pk",
            type: { kind: "OBJECT", name: "artworks" },
            args: [
              { name: "_inc", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_account_providers",
            type: {
              kind: "OBJECT",
              name: "auth_account_providers_mutation_response",
            },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_account_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_account_providers" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_account_roles",
            type: {
              kind: "OBJECT",
              name: "auth_account_roles_mutation_response",
            },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_account_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_account_roles" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_accounts",
            type: { kind: "OBJECT", name: "auth_accounts_mutation_response" },
            args: [
              { name: "_append", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "_delete_at_path",
                type: { kind: "SCALAR", name: "Any" },
              },
              { name: "_delete_elem", type: { kind: "SCALAR", name: "Any" } },
              { name: "_delete_key", type: { kind: "SCALAR", name: "Any" } },
              { name: "_prepend", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_accounts_by_pk",
            type: { kind: "OBJECT", name: "auth_accounts" },
            args: [
              { name: "_append", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "_delete_at_path",
                type: { kind: "SCALAR", name: "Any" },
              },
              { name: "_delete_elem", type: { kind: "SCALAR", name: "Any" } },
              { name: "_delete_key", type: { kind: "SCALAR", name: "Any" } },
              { name: "_prepend", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_providers",
            type: { kind: "OBJECT", name: "auth_providers_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_providers" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_refresh_tokens",
            type: {
              kind: "OBJECT",
              name: "auth_refresh_tokens_mutation_response",
            },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_refresh_tokens_by_pk",
            type: { kind: "OBJECT", name: "auth_refresh_tokens" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_roles",
            type: { kind: "OBJECT", name: "auth_roles_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_auth_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_roles" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_collectors",
            type: { kind: "OBJECT", name: "collectors_mutation_response" },
            args: [
              { name: "_inc", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_currentuser",
            type: { kind: "OBJECT", name: "currentuser_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_favorites",
            type: { kind: "OBJECT", name: "favorites_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_favorites_by_pk",
            type: { kind: "OBJECT", name: "favorites" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_featured",
            type: { kind: "OBJECT", name: "featured_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_featured_by_pk",
            type: { kind: "OBJECT", name: "featured" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_follows",
            type: { kind: "OBJECT", name: "follows_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_follows_by_pk",
            type: { kind: "OBJECT", name: "follows" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_invitees",
            type: { kind: "OBJECT", name: "invitees_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_invitees_by_pk",
            type: { kind: "OBJECT", name: "invitees" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_samples",
            type: { kind: "OBJECT", name: "samples_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_samples_by_pk",
            type: { kind: "OBJECT", name: "samples" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_tags",
            type: { kind: "OBJECT", name: "tags_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_tags_by_pk",
            type: { kind: "OBJECT", name: "tags" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_transactions",
            type: { kind: "OBJECT", name: "transactions_mutation_response" },
            args: [
              { name: "_inc", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_transactions_by_pk",
            type: { kind: "OBJECT", name: "transactions" },
            args: [
              { name: "_inc", type: { kind: "SCALAR", name: "Any" } },
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_users",
            type: { kind: "OBJECT", name: "users_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_users_by_pk",
            type: { kind: "OBJECT", name: "users" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_utxos",
            type: { kind: "OBJECT", name: "utxos_mutation_response" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "where",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "update_utxos_by_pk",
            type: { kind: "OBJECT", name: "utxos" },
            args: [
              { name: "_set", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "pk_columns",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork",
            type: { kind: "OBJECT", name: "artworks" },
            args: [],
          },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "transaction",
            type: { kind: "OBJECT", name: "transactions" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "offers_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "offers" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "offers_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "offers_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "offers_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "offers_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "offers_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "offers_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "offers_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "offers_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "offers_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "offers_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_avg_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_max_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_min_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_stddev_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_stddev_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_stddev_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_sum_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_var_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_var_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "offers_variance_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "query_root",
        fields: [
          {
            name: "activebids",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "activebids" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "activebids_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "activebids_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "activelistings",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "activelistings" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "activelistings_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "activelistings_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artists",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artists" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artists_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artists_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworks",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artworks" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworks_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artworks_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworks_by_pk",
            type: { kind: "OBJECT", name: "artworks" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_account_providers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_providers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_providers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "OBJECT",
                name: "auth_account_providers_aggregate",
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_account_providers" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_account_roles",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_roles" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_roles_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_account_roles_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_account_roles" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_accounts",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_accounts" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_accounts_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_accounts_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_accounts_by_pk",
            type: { kind: "OBJECT", name: "auth_accounts" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_providers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_providers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_providers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_providers_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_providers" },
            args: [
              {
                name: "provider",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_refresh_tokens",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_refresh_tokens" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_refresh_tokens_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_refresh_tokens_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_refresh_tokens_by_pk",
            type: { kind: "OBJECT", name: "auth_refresh_tokens" },
            args: [
              {
                name: "refresh_token",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_roles",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_roles" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_roles_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_roles_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_roles" },
            args: [
              {
                name: "role",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "collectors",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "collectors" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "collectors_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "collectors_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "currentuser",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "currentuser" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "currentuser_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "currentuser_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "favorites" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "favorites_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites_by_pk",
            type: { kind: "OBJECT", name: "favorites" },
            args: [
              {
                name: "artwork_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "user_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "featured",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "featured" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "featured_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "featured_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "featured_by_pk",
            type: { kind: "OBJECT", name: "featured" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "follows",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "follows" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "follows_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "follows_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "follows_by_pk",
            type: { kind: "OBJECT", name: "follows" },
            args: [
              {
                name: "follower_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "user_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "invitees",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "invitees" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "invitees_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "invitees_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "invitees_by_pk",
            type: { kind: "OBJECT", name: "invitees" },
            args: [
              {
                name: "email",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "offers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "offers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "offers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "offers_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "recentactivity",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "recentactivity" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "recentactivity_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "recentactivity_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "samples",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "samples" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "samples_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "samples_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "samples_by_pk",
            type: { kind: "OBJECT", name: "samples" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "search",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "search" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "search_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "search_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "searchable",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "search" },
                },
              },
            },
            args: [
              {
                name: "args",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "searchable_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "search_aggregate" },
            },
            args: [
              {
                name: "args",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "tags",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "tags" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "tags_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "tags_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "tags_by_pk",
            type: { kind: "OBJECT", name: "tags" },
            args: [
              {
                name: "artwork_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "tag",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "transactions",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "transactions" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "transactions_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "transactions_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "transactions_by_pk",
            type: { kind: "OBJECT", name: "transactions" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "users",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "users" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "users_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "users_by_pk",
            type: { kind: "OBJECT", name: "users" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "utxos",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "utxos" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "utxos_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "utxos_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "utxos_by_pk",
            type: { kind: "OBJECT", name: "utxos" },
            args: [
              {
                name: "utxo",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork",
            type: { kind: "OBJECT", name: "artworks" },
            args: [],
          },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "bid",
            type: { kind: "OBJECT", name: "transactions" },
            args: [],
          },
          { name: "bid_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confirmed",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "contract", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user", type: { kind: "OBJECT", name: "users" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "recentactivity_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "recentactivity" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "recentactivity_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "recentactivity_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "recentactivity_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "recentactivity_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "recentactivity_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "recentactivity_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "recentactivity_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "recentactivity_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "recentactivity_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "recentactivity_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_avg_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_max_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "bid_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "contract", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_min_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "bid_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "contract", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_stddev_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_stddev_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_stddev_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_sum_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_var_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_var_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "recentactivity_variance_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "samples",
        fields: [
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "url",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "user_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "samples_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "samples_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "samples" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "samples_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "samples_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "samples_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "samples_max_fields",
        fields: [
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "url", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "samples_min_fields",
        fields: [
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "url", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "samples_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "samples" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "search",
        fields: [
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "s", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "search_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "search_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "search" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "search_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "search_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "search_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "search_max_fields",
        fields: [
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "s", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "search_min_fields",
        fields: [
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "s", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "subscription_root",
        fields: [
          {
            name: "activebids",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "activebids" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "activebids_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "activebids_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "activelistings",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "activelistings" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "activelistings_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "activelistings_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artists",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artists" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artists_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artists_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworks",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artworks" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworks_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artworks_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworks_by_pk",
            type: { kind: "OBJECT", name: "artworks" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_account_providers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_providers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_providers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "OBJECT",
                name: "auth_account_providers_aggregate",
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_account_providers" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_account_roles",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_account_roles" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_roles_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_account_roles_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_account_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_account_roles" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_accounts",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_accounts" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_accounts_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_accounts_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_accounts_by_pk",
            type: { kind: "OBJECT", name: "auth_accounts" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_providers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_providers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_providers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_providers_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_providers_by_pk",
            type: { kind: "OBJECT", name: "auth_providers" },
            args: [
              {
                name: "provider",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_refresh_tokens",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_refresh_tokens" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_refresh_tokens_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_refresh_tokens_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_refresh_tokens_by_pk",
            type: { kind: "OBJECT", name: "auth_refresh_tokens" },
            args: [
              {
                name: "refresh_token",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "auth_roles",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "auth_roles" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_roles_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "auth_roles_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "auth_roles_by_pk",
            type: { kind: "OBJECT", name: "auth_roles" },
            args: [
              {
                name: "role",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "collectors",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "collectors" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "collectors_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "collectors_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "currentuser",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "currentuser" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "currentuser_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "currentuser_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "favorites" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "favorites_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites_by_pk",
            type: { kind: "OBJECT", name: "favorites" },
            args: [
              {
                name: "artwork_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "user_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "featured",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "featured" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "featured_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "featured_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "featured_by_pk",
            type: { kind: "OBJECT", name: "featured" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "follows",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "follows" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "follows_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "follows_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "follows_by_pk",
            type: { kind: "OBJECT", name: "follows" },
            args: [
              {
                name: "follower_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "user_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "invitees",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "invitees" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "invitees_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "invitees_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "invitees_by_pk",
            type: { kind: "OBJECT", name: "invitees" },
            args: [
              {
                name: "email",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "offers",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "offers" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "offers_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "offers_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "recentactivity",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "recentactivity" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "recentactivity_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "recentactivity_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "samples",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "samples" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "samples_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "samples_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "samples_by_pk",
            type: { kind: "OBJECT", name: "samples" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "search",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "search" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "search_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "search_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "searchable",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "search" },
                },
              },
            },
            args: [
              {
                name: "args",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "searchable_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "search_aggregate" },
            },
            args: [
              {
                name: "args",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "tags",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "tags" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "tags_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "tags_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "tags_by_pk",
            type: { kind: "OBJECT", name: "tags" },
            args: [
              {
                name: "artwork_id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
              {
                name: "tag",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "transactions",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "transactions" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "transactions_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "transactions_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "transactions_by_pk",
            type: { kind: "OBJECT", name: "transactions" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "users",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "users" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "users_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "users_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "users_by_pk",
            type: { kind: "OBJECT", name: "users" },
            args: [
              {
                name: "id",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
          {
            name: "utxos",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "utxos" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "utxos_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "utxos_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "utxos_by_pk",
            type: { kind: "OBJECT", name: "utxos" },
            args: [
              {
                name: "utxo",
                type: {
                  kind: "NON_NULL",
                  ofType: { kind: "SCALAR", name: "Any" },
                },
              },
            ],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "tags",
        fields: [
          {
            name: "artwork",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artworks" },
            },
            args: [],
          },
          {
            name: "artwork_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "tag",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "tags_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "tags_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "tags" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "tags_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "tags_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "tags_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "tags_max_fields",
        fields: [
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "tag", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "tags_min_fields",
        fields: [
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "tag", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "tags_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "tags" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions",
        fields: [
          {
            name: "amount",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "artwork",
            type: { kind: "OBJECT", name: "artworks" },
            args: [],
          },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "bid",
            type: { kind: "OBJECT", name: "transactions" },
            args: [],
          },
          { name: "bid_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confirmed",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "contract", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "created_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "hash",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "type",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "user", type: { kind: "OBJECT", name: "users" }, args: [] },
          {
            name: "user_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "transactions_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "transactions" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_aggregate_fields",
        fields: [
          {
            name: "avg",
            type: { kind: "OBJECT", name: "transactions_avg_fields" },
            args: [],
          },
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "transactions_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "transactions_min_fields" },
            args: [],
          },
          {
            name: "stddev",
            type: { kind: "OBJECT", name: "transactions_stddev_fields" },
            args: [],
          },
          {
            name: "stddev_pop",
            type: { kind: "OBJECT", name: "transactions_stddev_pop_fields" },
            args: [],
          },
          {
            name: "stddev_samp",
            type: { kind: "OBJECT", name: "transactions_stddev_samp_fields" },
            args: [],
          },
          {
            name: "sum",
            type: { kind: "OBJECT", name: "transactions_sum_fields" },
            args: [],
          },
          {
            name: "var_pop",
            type: { kind: "OBJECT", name: "transactions_var_pop_fields" },
            args: [],
          },
          {
            name: "var_samp",
            type: { kind: "OBJECT", name: "transactions_var_samp_fields" },
            args: [],
          },
          {
            name: "variance",
            type: { kind: "OBJECT", name: "transactions_variance_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_avg_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_max_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "bid_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "contract", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_min_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artwork_id",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "asset", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "bid_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "contract", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "hash", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "psbt", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "type", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "transactions" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_stddev_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_stddev_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_stddev_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_sum_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_var_pop_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_var_samp_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "transactions_variance_fields",
        fields: [
          { name: "amount", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "users",
        fields: [
          {
            name: "account",
            type: { kind: "OBJECT", name: "auth_accounts" },
            args: [],
          },
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "artworks",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artworks" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworksByOwnerId",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "artworks" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworksByOwnerId_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artworks_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "artworks_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "artworks_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "bio", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "blindkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confidential",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "display_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "favorites",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "favorites" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "favorites_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "favorites_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          { name: "followed", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "follows",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "follows" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "followsByUserId",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "follows" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "followsByUserId_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "follows_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "follows_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "follows_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "full_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "info", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "is_admin",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "is_artist",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "location", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "mnemonic", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "multisig", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "num_followers",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "num_follows",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "pubkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "samples",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "samples" },
                },
              },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "samples_aggregate",
            type: {
              kind: "NON_NULL",
              ofType: { kind: "OBJECT", name: "samples_aggregate" },
            },
            args: [
              {
                name: "distinct_on",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "limit", type: { kind: "SCALAR", name: "Any" } },
              { name: "offset", type: { kind: "SCALAR", name: "Any" } },
              {
                name: "order_by",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "where", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          { name: "twitter", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "wallet_initialized",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          { name: "website", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "users_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "users_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "users" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "users_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "users_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "users_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "users_max_fields",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "bio", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "blindkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confidential",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "display_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "full_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "info", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "location", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "mnemonic", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "multisig", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "pubkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "twitter", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "website", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "users_min_fields",
        fields: [
          { name: "address", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "avatar_url",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "bio", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "blindkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "confidential",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "created_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          {
            name: "display_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "email", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "full_name",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "info", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "instagram",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "location", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "mnemonic", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "multisig", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "pubkey", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "twitter", type: { kind: "SCALAR", name: "Any" }, args: [] },
          {
            name: "updated_at",
            type: { kind: "SCALAR", name: "Any" },
            args: [],
          },
          { name: "username", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "website", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "users_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "users" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "utxos",
        fields: [
          {
            name: "user_id",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "utxo",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "utxos_aggregate",
        fields: [
          {
            name: "aggregate",
            type: { kind: "OBJECT", name: "utxos_aggregate_fields" },
            args: [],
          },
          {
            name: "nodes",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "utxos" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "utxos_aggregate_fields",
        fields: [
          {
            name: "count",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [
              {
                name: "columns",
                type: {
                  kind: "LIST",
                  ofType: {
                    kind: "NON_NULL",
                    ofType: { kind: "SCALAR", name: "Any" },
                  },
                },
              },
              { name: "distinct", type: { kind: "SCALAR", name: "Any" } },
            ],
          },
          {
            name: "max",
            type: { kind: "OBJECT", name: "utxos_max_fields" },
            args: [],
          },
          {
            name: "min",
            type: { kind: "OBJECT", name: "utxos_min_fields" },
            args: [],
          },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "utxos_max_fields",
        fields: [
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "utxo", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "utxos_min_fields",
        fields: [
          { name: "user_id", type: { kind: "SCALAR", name: "Any" }, args: [] },
          { name: "utxo", type: { kind: "SCALAR", name: "Any" }, args: [] },
        ],
        interfaces: [],
      },
      {
        kind: "OBJECT",
        name: "utxos_mutation_response",
        fields: [
          {
            name: "affected_rows",
            type: { kind: "NON_NULL", ofType: { kind: "SCALAR", name: "Any" } },
            args: [],
          },
          {
            name: "returning",
            type: {
              kind: "NON_NULL",
              ofType: {
                kind: "LIST",
                ofType: {
                  kind: "NON_NULL",
                  ofType: { kind: "OBJECT", name: "utxos" },
                },
              },
            },
            args: [],
          },
        ],
        interfaces: [],
      },
      { kind: "SCALAR", name: "Any" },
    ],
    directives: [],
  },
};
